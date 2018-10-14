import React, { Component } from 'react';
import { getDimension } from '../../libs/getDimension';
import { listen, unlisten } from '../../libs/broadcast';
import { getWebGLContext, Program, Texture } from '../../webgl';
import { loadImage } from '../../libs/loadImage';
import animate from '../../libs/animate';
import * as store from '../../store';
import { image2canvas } from '../../libs/imgToCanvas';
import styles from '../../../scss/index.scss';

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const vs = `
precision lowp float;

attribute vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0, 1);
}
`;

const fs = `
precision lowp float;

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_disp;
uniform vec2 u_resolution;
uniform float u_time;

uniform float dispFactor;

const float PI = 3.141592653589793238;

void main() {
    vec2 div = 1.0 / u_resolution.xy;
    vec2 uv = gl_FragCoord.xy * div;
    uv.y = 1.0 - uv.y;

    float intensity = 0.3;

    float delta = u_time * 0.02;
    vec2 dispVec = texture2D(u_disp, uv - delta).rg;
    vec2 distortedPosition1 = uv + dispVec * intensity * dispFactor - (intensity * dispFactor / 2.);
    vec2 distortedPosition2 = uv + dispVec * intensity * (1.0 - dispFactor) - (intensity * (1.0 - dispFactor) / 2.);
    vec2 baseDistortion = dispVec * 0.005;
    vec4 _texture1 = texture2D(u_texture1, distortedPosition1 + baseDistortion);
    vec4 _texture2 = texture2D(u_texture2, distortedPosition2 + baseDistortion);
    gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;

class ProjectSlider extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            width: 0,
            height: 0
        };
        this.gl = null;
        this.program = null;
        this.texture1 = null;
        this.texture2 = null;
        this.dispTexture = null;
        this.nullTexture = null;
        this.values = {
            intensity: 0.005,
            displacement: 0
        };
        this.projects = [];
        this.currIndex = -1;
    }

    componentDidMount() {
        listen('resize', this.handleResize);
        this.initWebGL();
        this.handleResize();
        loadImage(require('../../../images/clouds.jpg')).then(img => {
            this.dispTexture = new Texture(this.gl, 512, 512, img, this.gl.REPEAT);
            this.renderCanvas();
        });

        this.projects = store.projects();
        this.projects.forEach(project => {
            loadImage(`/images/${project.data.thumb}`).then(img => {
                project.data.image = img;
                this.updateProjectTexture(project);
            });
        });

    }

    componentDidUpdate(prevProps) {
        if (prevProps.selected !== this.props.selected) {
            const { selected } = this.props;
            this.texture1 = prevProps.selected < 0 ? this.nullTexture : this.projects[prevProps.selected].data.texture;
            this.texture2 = this.projects[selected] ? this.projects[selected].data.texture : this.nullTexture;
            this.values.displacement = 0;
            this.change();
        }
    }

    updateProjectTexture = project => {
        const { width, height } = getDimension();
        if (!project.data.image) {
            return false;
        }
        project.data.canvas = image2canvas(project.data.image, width, height);
        project.data.texture = new Texture(this.gl, width, height, project.data.canvas);
    };

    change = () => {
        animate({
            targets: this.values,
            displacement: 1,
            duration: 1000,
            complete: () => {}
        });
    };

    renderCanvas = () => {
        
        requestAnimationFrame(this.renderCanvas);

        if (!this.texture1 || !this.texture2 || !this.dispTexture) {
            return false;
        }

        const time = performance.now() / 1e3;

        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.program.use();
        this.program.setTextures({
            u_texture1: this.texture1,
            u_texture2: this.texture2,
            u_disp: this.dispTexture
        });
        this.program.setBuffer('a_position', QUAD, 2);
        this.program.setUniforms({
            u_resolution: new Float32Array([this.state.width, this.state.height]),
            dispFactor: this.values.displacement,
            u_time: time,
            u_intensity: this.values.intensity
        });
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, QUAD.length / 2);
    };

    componentWillUnmount() {
        unlisten('resize', this.handleResize);
    }

    initWebGL = () => {
        this.gl = getWebGLContext(this.canvas);
        this.program = new Program(this.gl, vs, fs);
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    };

    handleResize = event => {
        const { width, height } = getDimension();
        this.setState({ width, height });
        this.gl.viewport(0, 0, width, height);
        this.projects.forEach(project => {
            this.updateProjectTexture(project);
        });
        this.updateNullTexture();
        if(this.props.selected >= 0) {
            this.texture1 = this.projects[this.props.selected].data.texture ? this.projects[this.props.selected].data.texture : null;
            this.texture2 = this.nullTexture;
        } else {
            this.texture1 = this.nullTexture;
            this.texture2 = this.nullTexture;
        }
        this.values.displacement = 0;
    };

    updateNullTexture = () => {
        const { width, height } = getDimension();
        this.nullTexture = new Texture(this.gl, width, height, null);
    };

    render() {
        const { width, height } = this.state;
        return (
            <canvas
                ref={o => this.canvas = o}
                width={width}
                height={height}
                className={styles['project-slider-canvas']}
            />
        );
    }

}

export default ProjectSlider;
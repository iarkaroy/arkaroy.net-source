import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDimension } from '../../libs/getDimension';
import { listen, unlisten } from '../../libs/broadcast';
import { getWebGLContext, Program, Texture } from '../../webgl';
import { loadImage } from '../../libs/loadImage';
import animate from '../../libs/animate';
import * as store from '../../store';
import { image2canvas } from '../../libs/imgToCanvas';
import styles from '../../../scss/index.scss';
import { isPrerender } from '../../libs/isPrerender';
import { matchRoutes } from '../../router/matchRoutes';

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
    vec2 baseDistortion = dispVec * 0.008;
    vec4 _texture1 = texture2D(u_texture1, distortedPosition1 + baseDistortion);
    vec4 _texture2 = texture2D(u_texture2, distortedPosition2 + baseDistortion);
    gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;

class ProjectSlider extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

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
            displacement: 0
        };
        this.projects = [];
        this.currIndex = store.getSelectedProject();
        this.loaded = 0;
    }

    componentDidMount() {
        if (isPrerender()) {
            return false;
        }
        listen('resize', this.handleResize);
        listen('projectchange', this.changeProject);
        this.initWebGL();
        this.handleResize();
        const { router } = this.context;
        const { history } = router;
        const { location } = history;
        const match = matchRoutes(location.pathname, this.props.routes);
        if (match.component && match.component.name === 'ProjectPage') {
            const id = match.params.id;
            const index = store.projectIndex(id);
            this.currIndex = -100;
            store.setSelectedProject(index);
        }
        loadImage(require('../../../images/clouds.jpg')).then(img => {
            this.dispTexture = new Texture(this.gl, 512, 512, img, this.gl.REPEAT);
            requestAnimationFrame(this.renderCanvas);
        });

        document.fonts.load(`900 8rem 'Inter UI'`, 'BESbswy')
            .then(fonts => {
                if (fonts.length) {
                    this.projects = store.projects();
                    this.projects.forEach((project, index) => {
                        loadImage(`/images/${project.data.thumb}`).then(img => {
                            project.data.image = img;
                            this.updateProjectTexture(project, index);
                            this.loaded++;
                            if (this.loaded === this.projects.length) {
                                // console.log('loaded');
                            }
                        });
                    });
                }
            });
    }

    componentWillUnmount() {
        unlisten('resize', this.handleResize);
        unlisten('projectchange', this.changeProject);
    }

    changeProject = index => {
        if (this.currIndex === -100) {
            this.currIndex = index;
        } else {
            const prevIndex = this.currIndex;
            this.currIndex = index;
            this.texture1 = prevIndex < 0 ? this.nullTexture : this.projects[prevIndex].data.texture;
            this.texture2 = this.projects[this.currIndex] ? this.projects[this.currIndex].data.texture : this.nullTexture;
            this.values.displacement = 0;
            this.change();
        }
    };

    updateProjectTexture = (project, index) => {
        const { width, height } = getDimension();
        if (!project.data.image) {
            return false;
        }

        // Create canvas with project image as background
        project.data.canvas = image2canvas(project.data.image, width * 2, height * 2);

        const ctx = project.data.canvas.getContext('2d');

        // Fill light transparent background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width * 2, height * 2);

        // Draw project title
        const fontSize = Math.max(Math.floor(width * 0.015), 8);
        ctx.font = `900 ${fontSize}rem 'Inter UI'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';

        // Draw project title in single or multi line based on title width
        const textWidth = ctx.measureText(project.data.title).width;
        if (textWidth > width * 2 * 0.8) {
            const titleParts = project.data.title.split(' ');
            const lineHeight = fontSize * 1.2 * 10;
            for (let i = 0; i < titleParts.length; ++i) {
                ctx.fillText(titleParts[i], width, height + (i * lineHeight) - (titleParts.length / 2 * lineHeight - lineHeight / 2));
            }
        } else {
            ctx.fillText(project.data.title, width, height);
        }

        // Generate texture
        project.data.texture = new Texture(this.gl, width * 2, height * 2, project.data.canvas);

        if (index === this.currIndex) {
            this.texture1 = project.data.texture;
        }
    };

    change = () => {
        animate({
            targets: this.values,
            displacement: 1,
            duration: 1000,
            complete: () => { }
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
            u_resolution: new Float32Array([this.state.width * 2, this.state.height * 2]),
            dispFactor: this.values.displacement,
            u_time: time
        });
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, QUAD.length / 2);
    };

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
        this.gl.viewport(0, 0, width * 2, height * 2);
        this.projects.forEach((project, index) => {
            this.updateProjectTexture(project, index);
        });
        this.updateNullTexture();
        if (this.currIndex >= 0) {
            this.texture1 = this.projects[this.currIndex] ? this.projects[this.currIndex].data.texture : null;
            this.texture2 = this.nullTexture;
        } else {
            this.texture1 = this.nullTexture;
            this.texture2 = this.nullTexture;
        }
        this.values.displacement = 0;
    };

    updateNullTexture = () => {
        const { width, height } = getDimension();
        this.nullTexture = new Texture(this.gl, width * 2, height * 2, null);
    };

    render() {
        const { width, height } = this.state;
        return (
            <canvas
                ref={o => this.canvas = o}
                width={width * 2}
                height={height * 2}
                style={{
                    width,
                    height
                }}
                className={styles['project-slider-canvas']}
            />
        );
    }

}

export default ProjectSlider;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDimension } from '../../libs/getDimension';
import { listen, unlisten, broadcast } from '../../libs/broadcast';
import { getWebGLContext, Program, Texture } from '../../webgl';
import { loadImage } from '../../libs/loadImage';
import animate from '../../libs/animate';
import * as store from '../../store';
import { image2canvas } from '../../libs/imgToCanvas';
import styles from '../../../sass/index.sass';
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
uniform float u_scroll;

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
    vec2 baseDistortion = dispVec * (u_scroll * 0.0005 + 0.008) - ((u_scroll * 0.0005 + 0.008) / 2.);
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
            height: 0,
            scroll: 0,
            scale: 1.3,
            opacity: 0
        };
        this.gl = null;
        this.program = null;
        this.texture1 = null;
        this.texture2 = null;
        this.dispTexture = null;
        this.values = {
            displacement: 0,
            scale: 1.3,
            opacity: 0
        };
        this.projects = [];
        this.currIndex = store.getSelectedProject();
        this.imagesLoaded = 0;
        this.config = {
            isHome: false,
            isProject: false,
            inTransition: false,
        };
    }

    componentDidMount() {
        if (isPrerender()) {
            return false;
        }
        listen('resize', this.handleResize);
        this.initWebGL();

        const { router } = this.context;
        const { history } = router;
        this.history = history;
        this.unlisten = this.history.listen(this.handleNavigation);

        this.projects = store.projects();

        loadImage(require('../../../images/clouds.jpg')).then(img => {
            this.dispTexture = new Texture(this.gl, 512, 512, img, this.gl.REPEAT);
            this.imagesLoaded++;
            if (this.imagesLoaded === this.projects.length + 1) {
                this.onAssetsLoaded();
            }
        });


        this.projects.forEach((project, index) => {
            loadImage(`/images/${project.data.thumb}`).then(img => {
                project.data.image = img;
                this.imagesLoaded++;
                if (this.imagesLoaded === this.projects.length + 1) {
                    this.onAssetsLoaded();
                }
            });
        });
        listen('projectchange', this.changeProject);
        listen('scroller:scroll', this.updateScroll);
        listen('overlayclosed', this.onOverlayClosed);
    }

    componentWillUnmount() {
        unlisten('resize', this.handleResize);
        unlisten('projectchange', this.changeProject);
        unlisten('scroller:scroll', this.updateScroll);
        if (this.unlisten) {
            this.unlisten();
        }
        unlisten('overlayclosed', this.onOverlayClosed);
    }

    onAssetsLoaded = () => {
        this.handleResize();
        this.handleNavigation();
        requestAnimationFrame(this.renderCanvas);
        broadcast('assetsloaded');
        animate({
            targets: this.values,
            scale: 1,
            opacity: 1,
            duration: 1200,
            easing: 'cubicOut',
            update: () => {
                this.setState({
                    scale: this.values.scale,
                    opacity: this.values.opacity
                })
            }
        });
    }

    onOverlayClosed = () => {

    };

    handleNavigation = location => {
        location = location || this.history.location;
        const match = matchRoutes(location.pathname, this.props.routes);
        const page = match.component ? match.component.name : null;
        if (page === 'HomePage') {
            this.config.isHome = true;
            this.config.isProject = false;
        } else if (page === 'ProjectPage') {
            this.config.isHome = false;
            this.config.isProject = true;
            const id = match.params.id;
            const index = store.projectIndex(id);
            store.setSelectedProject(index);
        } else {
            this.config.isHome = false;
            this.config.isProject = false;
        }
    };

    updateScroll = scroll => {
        this.setState({ scroll });
    };

    changeProject = index => {
        if (this.config.isHome) {
            const prevIndex = this.currIndex;
            this.currIndex = index;
            this.texture1 = this.projects[prevIndex].data.texture;
            this.texture2 = this.projects[this.currIndex].data.texture;
            this.values.displacement = 0;
            this.change();
        } else if (this.config.isProject) {
            this.currIndex = index;
            this.texture1 = this.texture2 = this.projects[this.currIndex].data.texture;
            this.values.displacement = 0;
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
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width * 2, height * 2);

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
            duration: 600,
            easing: 'cubicInOut',
            complete: () => { }
        });
    };

    renderCanvas = () => {

        requestAnimationFrame(this.renderCanvas);

        const { width, height, scroll } = this.state;

        if (scroll >= height) {
            return false;
        }

        if (!this.config.isHome && !this.config.isProject) {
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            return false;
        }

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
            u_resolution: new Float32Array([width * 2, height * 2]),
            dispFactor: this.values.displacement,
            u_time: time,
            u_scroll: scroll
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

        this.texture1 = this.texture2 = this.projects[this.currIndex].data.texture;

        this.values.displacement = 0;
    };

    render() {
        const { width, height, scroll, scale, opacity } = this.state;
        return (
            <canvas
                ref={o => this.canvas = o}
                width={width * 2}
                height={height * 2}
                style={{
                    width,
                    height,
                    transform: `translate3d(0, ${parseInt(-scroll / 2)}px, 0) scale(${scale}, ${scale})`,
                    opacity: opacity
                }}
                className={styles['slider-canvas']}
            />
        );
    }

}

export default ProjectSlider;
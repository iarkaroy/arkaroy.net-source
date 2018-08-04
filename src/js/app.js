import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { cover, contain } from './libs/canvas-background-size';
import { loadImage } from './libs/load-image';
import { displacementCanvas } from './libs/displacement-canvas';
import * as glUtils from './libs/webgl-utils';

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

const vertex = `
#ifdef GL_ES
precision highp float;
#endif

attribute vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0, 1);
}
`;

const fragment = `
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_disp;
uniform vec2 u_resolution;

void main() {
    vec2 div = 1.0 / u_resolution.xy;
    vec2 uv = gl_FragCoord.xy * div;
    uv.y = 1.0 - uv.y;
    vec4 color = texture2D(u_disp, uv);
    gl_FragColor = color;
}
`;

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            canvases: []
        };
        this._displacementCanvas = null;
        this._data = null;
    }

    async componentDidMount() {
        var apiEndpoint = "https://iarkaroy.cdn.prismic.io/api/v2";

        Prismic.getApi(apiEndpoint).then(api => {
            return api.query(""); // An empty query will return all the documents
        }).then(response => {
            this._data = response.results;
            this.prepareCanvases();
        }, err => {
            console.log("Something went wrong: ", err);
        });
        this._displacementCanvas = await displacementCanvas();
        this.initWebGL();
    }

    initWebGL = () => {
        this.gl = glUtils.getWebGLContext(this.canvas);
        this.program = glUtils.program(this.gl, vertex, fragment);
        this.buffer = glUtils.buffer(this.gl);
    };

    draw = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const { canvases } = this.state;
        this.texture1 = glUtils.texture(this.gl, width, height, canvases[0]);
        this.texture2 = glUtils.texture(this.gl, width, height, canvases[1]);
        this.dispTexture = glUtils.texture(this.gl, width, height, this._displacementCanvas);

        this.gl.useProgram(this.program);
        this.texture1.bind(0, this.program.u_texture1);
        this.texture2.bind(1, this.program.u_texture2);
        this.dispTexture.bind(2, this.program.u_disp);
        this.buffer.data(QUAD, this.program.a_position, 2);
        this.gl.uniform2fv(this.program.u_resolution, new Float32Array([width, height]));
        glUtils.reset(this.gl, width, height, true);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, QUAD.length / 2);
    };

    prepareCanvases = async () => {
        const projects = this.getProjects();
        var canvases = [];
        for (let i = 0; i < projects.length; ++i) {
            let canvas = await this.getCanvas(projects[i]);
            canvases.push(canvas);
        }
        this.setState({ canvases }, this.draw);
    };

    getProjects = () => {
        if (!this._data) {
            return [];
        }
        var projects = this._data.filter(d => {
            return d.type === 'project';
        });
        return projects;
    };

    getCanvas = async (project) => {
        const img = await loadImage(project.data.image.url);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        const { width, height, offsetX, offsetY } = cover(ctx.canvas.width, ctx.canvas.height, img.width, img.height);
        ctx.drawImage(img, offsetX, offsetY, width, height);

        /*
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const { data } = imagedata;
        for (var i = 0; i < data.length; i += 4) {
            var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
        }

        ctx.putImageData(imageData, x, y);
        */

        return ctx.canvas;
    };

    render() {
        return (
            <canvas ref={o => { this.canvas = o }} width={window.innerWidth} height={window.innerHeight} />
        );
    }

}

export default App;
import * as glUtils from './webgl-utils';
import animate from './animate';

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

uniform float dispFactor;

const float PI = 3.141592653589793238;

mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 div = 1.0 / u_resolution.xy;
    vec2 uv = gl_FragCoord.xy * div;
    uv.y = 1.0 - uv.y;

    float angle1 = 3.0 * PI / 4.0;
    float angle2 = angle1;
    float intensity1 = 0.1;
    float intensity2 = 0.1;

    vec4 disp = texture2D(u_disp, uv);
    vec2 dispVec = vec2(disp.r, disp.g);
    vec2 distortedPosition1 = uv + getRotM(angle1) * dispVec * intensity1 * dispFactor;
    vec2 distortedPosition2 = uv + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
    vec4 _texture1 = texture2D(u_texture1, distortedPosition1);
    vec4 _texture2 = texture2D(u_texture2, distortedPosition2);
    gl_FragColor = mix(_texture1, _texture2, dispFactor);
}
`;

class SlideTransition {

    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.width = width || 0;
        this.height = height || 0;
        this.gl = glUtils.getWebGLContext(this.canvas);
        this.program = glUtils.program(this.gl, vertex, fragment);
        this.buffer = glUtils.buffer(this.gl);
        this.texture1 = this.texture2 = this.disp = null;
        this.dispFactor = { pos: 0 };
    }

    transit(from, to, disp, duration = 1000, callback = null) {
        this.texture1 = glUtils.texture(this.gl, this.width, this.height, from);
        this.texture2 = glUtils.texture(this.gl, this.width, this.height, to);
        this.disp = glUtils.texture(this.gl, this.width, this.height, disp);
        this.dispFactor = { pos: 0 };
        animate({
            targets: this.dispFactor,
            pos: 1,
            duration: duration,
            easing: 'quintInOut',
            update: () => {
                this.render();
            },
            complete: callback
        });
    }

    render(image = null) {
        if(image) {
            this.texture1 = this.texture2 = this.disp = glUtils.texture(this.gl, this.width, this.height, image);
        }
        this.gl.useProgram(this.program);
        this.texture1.bind(0, this.program.u_texture1);
        this.texture2.bind(1, this.program.u_texture2);
        this.disp.bind(2, this.program.u_disp);
        this.buffer.data(QUAD, this.program.a_position, 2);
        this.gl.uniform2fv(this.program.u_resolution, new Float32Array([this.width, this.height]));
        this.gl.uniform1f(this.program.dispFactor, this.dispFactor.pos);
        glUtils.reset(this.gl, this.width, this.height, true);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, QUAD.length / 2);
    }

}

export default SlideTransition;
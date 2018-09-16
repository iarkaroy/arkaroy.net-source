import React, { Component } from 'react';
import { getDimension } from '../libs/getDimension';
import { listen, unlisten } from '../libs/broadcast';
import styles from '../../scss/index.scss';
import { getWebGLContext, Program, Framebuffer, Texture } from '../webgl';
import Mat4 from '../libs/mat4';
import { getOilDispMap } from '../libs/getOilDispMap';
import { getOilSphereMap } from '../libs/getOilSphereMap';

const vs = `
precision lowp float;
attribute vec2 a_tex_coord;
attribute vec2 a_position;
attribute float a_alpha;
uniform mat4 m_mvp;
varying vec2 v_tex_coord;
varying float v_alpha;
void main(){
    vec4 a=vec4(a_position,0.0,1.0);
    v_tex_coord=a_tex_coord;
    v_alpha=a_alpha;
    gl_Position=m_mvp*a;
}
`;

const fs0 = `
precision lowp float;
uniform sampler2D u_image;
varying vec2 v_tex_coord;
varying float v_alpha;
void main(){
    gl_FragColor=texture2D(u_image,v_tex_coord)*v_alpha;
}
`;

const fs1 = `
precision lowp float;
uniform sampler2D u_image;
uniform sampler2D u_image_1;
uniform sampler2D u_image_2;
uniform float u_time;
uniform float u_curl_strength;
uniform float u_fade;
varying vec2 v_tex_coord;
varying float v_alpha;
const float a=0.0000001;
const vec2 b=vec2(1.0/40.0,0.0);
mat2 c;
vec2 d(float e){
    return fract(sin(vec2(e,e+1.0))*vec2(43758.5453123,22578.1459123));
}
vec4 f(vec2 g,float h){
    float i=1.0;
    float j=length(g);
    float k=(i-j)/i;
    float l=pow(k,4.0)*sin(u_time*0.25)*4.0;
    l+=u_time*0.2;
    float m=sin(l);
    float n=cos(l);
    g=vec2(dot(g,vec2(n,-m)),dot(g,vec2(m,n)));
    return texture2D(u_image_2,g/h)*2.0-vec4(1.0);
}
vec4 o(vec2 g,float h){
    return (f(g+b.xy,h)-f(g-b.xy,h))/(2.0*b.x);
}
vec4 p(vec2 g,float h){
    return (f(g+b.yx,h)-f(g-b.yx,h))/(2.0*b.x);
}
vec4 q(vec4 r,vec4 s,float t,float u){
    vec3 rgb=vec3(1.0);
    vec4 v=vec4(rgb,r.a*t+s.a*(1.0-u));
    return v;
}
void main(){
    vec4 w=texture2D(u_image,v_tex_coord);
    float h=0.75;
    vec2 x=v_tex_coord-vec2(0.5);
    vec2 y=0.0001*u_curl_strength*(0.1-w.a*0.05)*vec2(p(x,h).x,-o(x,h).x)*h;
    vec4 z=texture2D(u_image_1,v_tex_coord+y);
    z.a*=(1.0+y.x);
    gl_FragColor=q(w*v_alpha,z,0.3,u_fade);
}
`;
const fs2 = `
precision lowp float;
uniform sampler2D u_image;
uniform float u_time;
uniform vec3 u_color_1;
uniform vec3 u_color_2;
uniform vec3 u_color_3;
uniform vec3 u_color_4;
uniform float u_division;
varying vec2 v_tex_coord;
varying float v_alpha;
#define HASHSCALE1 .1031
float a(vec2 b){
    vec3 c=fract(vec3(b.xyx)*HASHSCALE1);
    c+=dot(c,c.yzx+19.19);
    return fract((c.x+c.y)*c.z);
}
float d(in vec2 b){
    vec2 e=floor(b);
    vec2 f=fract(b);
    vec2 g=f*f*(3.0-2.0*f);
    return mix(mix(a(e+vec2(0.0,0.0)),a(e+vec2(1.0,0.0)),g.x),mix(a(e+vec2(0.0,1.0)),a(e+vec2(1.0,1.0)),g.x),g.y);
}
float h(in vec2 i){
    return d(i/64.0)*64.0+d(i/16.)*16.+d(i/4.)*4.;
}
void main(){
    vec4 j=texture2D(u_image,v_tex_coord);
    float k=0.5;
    vec2 l=v_tex_coord*64.0*(pow(j.a,0.35)*0.15);
    float m=0.5+0.5*sin(l.x+l.y+h(l+u_time*k));
    vec3 n;
    vec3 o;
    if(v_tex_coord.y>u_division){
        n=u_color_1;
        o=u_color_2;
    }else{
        n=u_color_3;
        o=u_color_4;
    }
    vec4 p=vec4(mix(n,o,m),m*0.85+0.15);
    gl_FragColor=p*j*v_alpha;
}
`;

const fs3 = `
precision lowp float;
uniform sampler2D u_image;
uniform float u_time;
uniform float u_size;
uniform float u_amount;
varying vec2 v_tex_coord;
varying float v_alpha;
const float a=3.1415926535897932;
float b(float c){
    float d=sin(u_size*a*c+u_time);
    float e=1.0-pow(abs(d*1.1),0.8);
    d=e*d;
    return d;
}
void main(){
    vec2 f=v_tex_coord-vec2(0.5);
    vec2 g=normalize(f);
    float c=length(f);
    float d=b(c);
    vec2 h=-g*d/(1.0+2.0*c);
    vec2 i=v_tex_coord+h*u_amount;
    vec4 j=texture2D(u_image,i);
    vec2 k=i*(1.0-i.xy);
    float l=clamp(k.x*k.y*32.0,0.0,1.0);
    float m=j.a*l;m=m>0.85?smoothstep(0.0,1.0,(m-0.85)/0.15):0.0;
    vec3 n=j.rgb*m;
    gl_FragColor=vec4(n,m)*v_alpha;
}
`;

const classNames = {
    fixedCenter: 'fixed-center'
};

class OilCanvas extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            width: 0,
            height: 0
        };
        this.sphereSize = 0;
        this.gl = null;
        this.programs = [];
        this.framebuffers = [];
        this.textureSphere = null;
        this.textureMap = null;
        this.frameId = null;
        this.pos = {
            x: 0,
            y: 0
        };
        this.m4 = null;
        this.mvp = null;
        this.curlStrength = 200;

    }

    updateViewport = () => {
        this.reset();

        const { width, height } = this.state;
        const size = Math.min(width, height);
        const size2 = size * 2;

        if (!this.gl) {
            this.initWebGL();
        }

        // Init framebuffers
        this.framebuffers[0] = new Framebuffer(this.gl, size2, size2);
        this.framebuffers[1] = new Framebuffer(this.gl, size2, size2);
        this.framebuffers[2] = new Framebuffer(this.gl, size2, size2);

        this.initTextureSphere();

        this.gl.viewport(0, 0, size2, size2);

        this.m4 = new Mat4();
        this.m4.translate({ x: -1, y: 1, z: 0 });
        this.m4.scale({
            x: 2 / size2,
            y: -2 / size2,
            z: 0
        });

        this.pos = {
            x: (size2 - this.sphereSize) / 2,
            y: (size2 - this.sphereSize) / 2
        };

        this.mvp = new Mat4();
        this.mvp.copy(this.m4);

        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.frameId = requestAnimationFrame(this.loop);
    };

    initWebGL = () => {
        if (!this.canvas) {
            return false;
        }
        this.gl = getWebGLContext(this.canvas);
        this.gl.clearColor(0, 0, 0, 0);

        // Init programs
        this.programs[0] = new Program(this.gl, vs, fs0);
        this.programs[1] = new Program(this.gl, vs, fs1);
        this.programs[2] = new Program(this.gl, vs, fs2);
        this.programs[3] = new Program(this.gl, vs, fs3);

        this.initTextureMap();
    };

    initTextureSphere = () => {
        const { width, height } = this.state;
        const size = Math.min(width, height);
        const size2 = size * 2;
        this.sphereSize = 0.65 * size2;

        const oilSphere = getOilSphereMap(this.sphereSize);

        this.textureSphere = new Texture(this.gl, this.sphereSize, this.sphereSize, oilSphere);
    };

    initTextureMap = () => {
        const oilDispMap = getOilDispMap();
        this.textureMap = new Texture(this.gl, 512, 512, oilDispMap, this.gl.REPEAT);
    };

    reset = () => {
        const { width, height } = this.state;
        const size = Math.min(width, height);
        const size2 = size * 2;
        this.positions = new Float32Array([
            0, 0,
            size2, 0,
            0, size2,
            size2, size2
        ]);
        this.texcoords = new Float32Array([
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ]);
        this.curlStrength = 200;
    }

    loop = () => {
        this.frameId = requestAnimationFrame(this.loop);

        const { width, height } = this.state;
        const size = Math.min(width, height);
        const size2 = size * 2;

        const time = (performance.now() / 1e3).toFixed(4);

        const currPosX = this.pos.x + Math.cos(0.1 * time * Math.PI * 2) * size2 / 16;
        const currPosY = this.pos.y + Math.sin(0.1 * time * Math.PI * 2) * size2 / 16;
        const mat = new Mat4();
        mat.translate({
            x: currPosX,
            y: currPosY,
            z: 0
        });
        this.mvp.copy(this.m4);
        this.mvp.multiply(mat);

        const alphaValue = 1;
        const alphaData = new Float32Array(2048);
        for (let i = 0; i < 8; ++i) {
            alphaData[i] = alphaValue;
        }

        this.curlStrength *= 0.995;
        if (this.curlStrength < 20) {
            this.curlStrength = 20;
        }

        const positionData = new Float32Array(2048);
        positionData[2] = positionData[5] = positionData[6] = positionData[7] = this.sphereSize;

        const texCoordData = new Float32Array(2048);
        texCoordData[2] = texCoordData[5] = texCoordData[6] = texCoordData[7] = 1;

        const elementBuffer = this.gl.createBuffer();
        const indexes = [0, 1, 2, 2, 1, 3];
        var elementBufferData = new Uint16Array(256 * 6);
        for (var e = 0; e < 256; e++) {
            for (var i = 0; i < 6; i++) {
                elementBufferData[e * 6 + i] = e * 4 + indexes[i];
            }
        }

        this.framebuffers[0].bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.programs[0].use();
        this.programs[0].setUniforms({
            m_mvp: this.mvp.array
        });
        this.programs[0].setBuffers({
            a_position: positionData,
            a_tex_coord: texCoordData,
            a_alpha: alphaData
        });
        this.programs[0].setTextures({
            u_image: this.textureSphere
        });
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, elementBufferData, this.gl.DYNAMIC_DRAW);
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);


        this.framebuffers[1].bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.programs[1].use();
        this.programs[1].setTextures({
            u_image: this.framebuffers[0],
            u_image_1: this.framebuffers[2],
            u_image_2: this.textureMap
        });
        this.programs[1].setUniforms({
            u_time: time,
            u_curl_strength: this.curlStrength,
            u_fade: 0.002,
            m_mvp: this.m4.array
        });
        this.programs[1].setBuffers({
            a_position: this.positions,
            a_tex_coord: this.texcoords,
            a_alpha: new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1])
        });
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), this.gl.STATIC_DRAW);
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

        this.framebuffers[0].bind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.programs[2].use();
        this.programs[2].setUniforms({
            u_time: time,
            u_color_1: new Float32Array([0.3, 0.3, 0.3]),
            u_color_2: new Float32Array([0.25, 0.25, 0.25]),
            u_color_3: new Float32Array([1, 1, 1]),
            u_color_4: new Float32Array([1, 1, 1]),
            u_division: 0,
            m_mvp: this.m4.array
        });
        this.programs[2].setBuffers({
            a_position: this.positions,
            a_tex_coord: this.texcoords,
            a_alpha: new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1])
        });
        this.programs[2].setTextures({
            u_image: this.framebuffers[1]
        });
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), this.gl.STATIC_DRAW);
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

        this.framebuffers[0].unbind();
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
        this.programs[3].use();
        this.programs[3].setUniforms({
            u_time: 0,
            u_size: 0,
            u_amount: 0,
            m_mvp: this.m4.array
        });
        this.programs[3].setBuffers({
            a_position: this.positions,
            a_tex_coord: this.texcoords,
            a_alpha: new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1])
        });
        this.programs[3].setTextures({
            u_image: this.framebuffers[0]
        });
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexes), this.gl.STATIC_DRAW);
        this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

        var tmp = this.framebuffers[1];
        this.framebuffers[1] = this.framebuffers[2];
        this.framebuffers[2] = tmp;
    }

    handleResize = event => {
        const { width, height } = event || getDimension();
        this.setState({ width, height }, this.updateViewport);
    };

    componentDidMount() {
        listen('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        unlisten('resize', this.handleResize);
    }

    render() {
        const { width, height } = this.state;
        const size = Math.min(width, height);
        const style = {
            width: `${size}px`,
            height: `${size}px`,
            left: `${(width - size) / 2}px`,
            top: `${(height - size) / 2}px`
        };
        return (
            <canvas
                ref={o => { this.canvas = o }}
                width={size * 2}
                height={size * 2}
                style={style}
                className={styles[classNames.fixedCenter]}
            />
        );
    }

}

export default OilCanvas;
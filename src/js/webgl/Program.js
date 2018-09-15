import Texture from './Texture';
import Framebuffer from './Framebuffer';

class Program {

    /**
     * Initialize WebGL program
     * @constructor
     * @param {WebGLRenderingContext} gl 
     * @param {string} vshader
     * @param {string} fshader
     */
    constructor(gl, vshader, fshader) {
        /**
         * @type {WebGLRenderingContext}
         */
        this.gl = gl;

        /**
         * @type {WebGLProgram}
         */
        this.program = null;

        this.vshaderSource = vshader;
        this.fshaderSource = fshader;
        this.buffers = {};
        this.uniforms = {};
        this.textures = {};
        this.init();
    }

    setTextures(textures) {
        for (var k in textures) {
            this.setTexture(k, textures[k]);
        }
    }

    setTexture(name, texture) {
        if (!this.textures[name]) {
            this.textures[name] = this.gl.getUniformLocation(this.program, name);
        }
        if (texture instanceof Texture) {
            texture = texture.get();
        }
        if (texture instanceof Framebuffer) {
            texture = texture.texture.get();
        }
        const unit = this.getTextureUnit(name);
        this.gl.uniform1i(this.textures[name], unit);
        this.gl.activeTexture(this.gl.TEXTURE0 + unit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }

    getTextureUnit(name) {
        var unit = 0;
        for (var k in this.textures) {
            if (k === name) {
                return unit;
            }
            ++unit;
        }
    }

    setUniforms(data) {
        for (var k in data) {
            this.setUniform(k, data[k]);
        }
    }

    setUniform(name, data) {
        if (!this.uniforms[name]) {
            this.uniforms[name] = this.gl.getUniformLocation(this.program, name);
        }
        if (data instanceof Float32Array) {
            switch (data.length) {
                case 1:
                    this.gl.uniform1fv(this.uniforms[name], data);
                    break;
                case 2:
                    this.gl.uniform2fv(this.uniforms[name], data);
                    break;
                case 3:
                    this.gl.uniform3fv(this.uniforms[name], data);
                    break;
                case 4:
                    this.gl.uniform4fv(this.uniforms[name], data);
                    break;
                case 9:
                    this.gl.uniformMatrix3fv(this.uniforms[name], false, data);
                    break;
                case 16:
                    this.gl.uniformMatrix4fv(this.uniforms[name], false, data);
                    break;
            }
        } else {
            this.gl.uniform1f(this.uniforms[name], data);
        }
    }

    setBuffers(data) {
        for (var k in data) {
            this.setBuffer(k, data[k]);
        }
    }

    setBuffer(name, data, size = 2) {
        if (!this.buffers[name]) {
            this.buffers[name] = this.gl.createBuffer();
        }
        const location = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(location);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[name]);
        this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, this.gl.FALSE, 0, 0);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.DYNAMIC_DRAW);
    }

    init() {
        const vshader = this.compileShader(this.gl.VERTEX_SHADER, this.vshaderSource);
        const fshader = this.compileShader(this.gl.FRAGMENT_SHADER, this.fshaderSource);
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vshader);
        this.gl.attachShader(this.program, fshader);
        this.gl.bindAttribLocation(this.program, 0, "a_position");

        this.gl.linkProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.log('Error linking program.', this.gl.getProgramInfoLog(this.program));
            this.gl.deleteProgram(this.program);
            this.gl.deleteShader(vshader);
            this.gl.deleteShader(fshader);
            return null;
        }

        this.gl.validateProgram(this.program);
        if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
            console.log('Error linking program.', this.gl.getProgramInfoLog(this.program));
            this.gl.deleteProgram(this.program);
            this.gl.deleteShader(vshader);
            this.gl.deleteShader(fshader);
            return null;
        }
    }

    compileShader(type, source) {
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log('Error compiling vertex shader.', this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    use() {
        this.gl.useProgram(this.program);
    }

}

export default Program;
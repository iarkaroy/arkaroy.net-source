class Texture {

    /**
     * 
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {(HTMLImageElement|HTMLCanvasElement|Uint8Array|Uint8ClampedArray|null)} data 
     * @param {number} wrap 
     * @param {number} filter 
     * @param {number} type 
     */
    constructor(gl, width, height, data, wrap = gl.CLAMP_TO_EDGE, filter = gl.LINEAR, type = gl.UNSIGNED_BYTE) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.data = data;
        this.wrap = wrap;
        this.filter = filter;
        this.type = type;
        this.texture = null;
        this.init();
    }

    get() {
        return this.texture;
    }

    init() {
        this.texture = this.gl.createTexture();
        var t = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        if (this.isArrayBufferView(this.data) || this.data === null)
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.width, this.height, 0, this.gl.RGBA, this.type, this.data);
        else
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.type, this.data);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.filter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.filter);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.wrap);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.wrap);
        this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
        this.gl.bindTexture(this.gl.TEXTURE_2D, t);
        return this;
    }

    isArrayBufferView(value) {
        return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined;
    }

}

export default Texture;
import Texture from './Texture';

class Framebuffer {

    /**
     * 
     * @constructor
     * @param {WebGLRenderingContext} gl 
     * @param {number} width 
     * @param {number} height 
     * @param {number} wrap 
     * @param {number} filter 
     * @param {number} type 
     */
    constructor(gl, width, height, wrap = gl.CLAMP_TO_EDGE, filter = gl.LINEAR, type = gl.FLOAT) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.wrap = wrap;
        this.filter = filter;
        this.type = type;
        this.framebuffer = null;
        this.renderbuffer = null;
        this.texture = null;
        this.init();
    }

    init() {
        this.texture = new Texture(this.gl, this.width, this.height, null, this.wrap, this.filter, this.type);
        var t = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);

        this.framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
        this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture.get(), 0);

        this.renderbuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.renderbuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, this.width, this.height);
        this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.renderbuffer);
        if (this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) !== this.gl.FRAMEBUFFER_COMPLETE)
            throw new Error("not able to create framebuffer");
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, t);
        return this;
    }

    get() {
        return this.framebuffer;
    }

    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.get());
        return this;
    }

    unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        return this;
    }

}

export default Framebuffer;
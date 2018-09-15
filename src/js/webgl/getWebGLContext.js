
/**
 * Get WebGL context
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {WebGLRenderingContext}
 */
export const getWebGLContext = canvas => {
    var param = {
        alpha: true,
        antialias: true
    };
    var gl = canvas.getContext("webgl", param) || canvas.getContext("experimental-webgl", param);
    if (!gl) {
        throw new Error("WebGL not supported");
    }
    ["OES_texture_float", "OES_texture_float_linear"].forEach(ext => {
        try {
            gl.getExtension(ext);
        } catch (exc) {
            throw Error(exc);
        }
    });
    return gl;
};
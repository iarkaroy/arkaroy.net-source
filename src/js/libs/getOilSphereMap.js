/**
 * Generate the sphere map for oil
 * 
 * @param {number} size
 * @returns {HTMLCanvasElement} 
 */
export const getOilSphereMap = (size) => {
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    var grad = ctx.createRadialGradient(size / 2, size / 2, size / 2, size / 2, size / 2, 0);
    grad.addColorStop(0, "rgba(255, 255, 255, 0)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.75)");
    grad.addColorStop(1, "rgba(255, 255, 255, 1)");
    ctx.fillStyle = grad;
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fill();
    return ctx.canvas;
};
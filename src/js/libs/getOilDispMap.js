/**
 * Generate displacement map for oil
 * 
 * @returns {HTMLCanvasElement}
 */
export const getOilDispMap = () => {
    const size = 512;
    var ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = size;
    ctx.canvas.height = size;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, size, size);
    for (var j = 0; j < 32; j++) {
        var i = Math.random() * size;
        var o = Math.random() * size;
        var s = Math.random() * size / 8 + size / 12;
        var grad = ctx.createRadialGradient(i, o, s, i, o, 0);
        var a = Math.random() > .5 ? 255 : 0;
        grad.addColorStop(0, "rgba(128, 128, 128, 0)");
        grad.addColorStop(1, "rgba(" + a + ", " + a + ", " + a + ", 0.5)");
        ctx.fillStyle = grad;
        [[0, 0], [-size, 0], [size, 0], [0, -size], [0, size]].forEach(function (t) {
            ctx.save();
            ctx.translate(t[0], t[1]);
            ctx.beginPath();
            ctx.arc(i, o, s, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        });
    }
    return ctx.canvas;
};
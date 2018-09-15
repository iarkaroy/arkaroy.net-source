import { loadImage } from './loadImage';

export const displacementCanvas = async (width, height) => {
    const dispImage = require('../../images/displacement/04.jpg');
    const img = await loadImage(dispImage);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = ctx.createPattern(img, "repeat");
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas;
}

import dispImage from '../../images/disp.jpg';
import { loadImage } from './load-image';

export const displacementCanvas = async () => {
    const img = await loadImage(dispImage);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.fillStyle = ctx.createPattern(img, "repeat");
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas;
}

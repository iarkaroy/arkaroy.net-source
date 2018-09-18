import { loadImage } from "./loadImage";
import { cover } from "./canvas-background-size";


export async function imgToCanvas(src, owidth, oheight, isGrey = false) {
    return new Promise((resolve, reject) => {

        loadImage(src).then(img => {

            const ctx = document.createElement('canvas').getContext('2d');
            ctx.canvas.width = owidth;
            ctx.canvas.height = oheight;
            const { width, height, offsetX, offsetY } = cover(ctx.canvas.width, ctx.canvas.height, img.width, img.height);
            ctx.drawImage(img, offsetX, offsetY, width, height);

            if (isGrey) {
                const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                const { data } = imageData;
                for (var i = 0; i < data.length; i += 4) {
                    // var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                    var brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
                    // red
                    data[i] = brightness;
                    // green
                    data[i + 1] = brightness;
                    // blue
                    data[i + 2] = brightness;
                    // alpha
                    // data[i + 3] = data[i + 3] > 120 ? data[i + 3] - 120 : 0;
                }

                ctx.putImageData(imageData, 0, 0);
            }

            resolve(ctx.canvas);
        }, reject);
    });
};

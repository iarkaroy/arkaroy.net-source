import { loadImage } from './load-image';

export const displacementCanvas = async (name = null, width, height) => {
    var dispImage = require('../../images/displacement/01.jpg');
    switch (name) {
        case '01':
        case 1:
            dispImage = require('../../images/displacement/01.jpg');
            break;
        case '02':
        case 2:
            dispImage = require('../../images/displacement/02.jpg');
            break;
        case '03':
        case 3:
            dispImage = require('../../images/displacement/03.jpg');
            break;
        case '04':
        case 4:
            dispImage = require('../../images/displacement/04.jpg');
            break;
        case '05':
        case 5:
            dispImage = require('../../images/displacement/05.jpg');
            break;
        case '06':
        case 6:
            dispImage = require('../../images/displacement/06.png');
            break;
        case '07':
        case 7:
            dispImage = require('../../images/displacement/07.jpg');
            break;
        case '08':
        case 8:
            dispImage = require('../../images/displacement/08.jpg');
            break;
        case '09':
        case 9:
            dispImage = require('../../images/displacement/09.png');
            break;
    }
    const img = await loadImage(dispImage);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = ctx.createPattern(img, "repeat");
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas;
}

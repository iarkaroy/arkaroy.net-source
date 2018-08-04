/**
 * Load an image
 * @param {string} src 
 * @returns {Promise}
 */
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}
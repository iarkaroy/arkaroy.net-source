/**
 * Load an image
 * @param {string} src 
 * @returns {Promise}
 */
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(img);
        img.crossOrigin = 'anonymous';
        img.src = src;
    });
}
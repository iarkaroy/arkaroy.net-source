/**
 * Get viewport dimension
 * 
 * @returns {object}
 */
export const getDimension = () => {
    return {
        width: window.document.documentElement.clientWidth || window.innerWidth,
        height: window.document.documentElement.clientHeight || window.innerHeight
    };
};
/**
 * Check whether it is prerendering
 */
export const isPrerender = () => {
    return navigator.userAgent === 'ReactSnap';
};
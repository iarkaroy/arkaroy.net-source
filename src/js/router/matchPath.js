import pathToRegexp from 'path-to-regexp';

/**
 * Get match against path
 * @param {string} pathname 
 * @param {object} options 
 */
export const matchPath = (pathname, options) => {
    const { exact = false, path } = options
    if (!path) {
        return {
            path: null,
            url: pathname,
            isExact: true,
        }
    }

    const keys = [];
    const re = pathToRegexp(path, keys, { end: exact });
    const match = re.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact)
        return null;

    return {
        path,
        url,
        isExact,
        params: keys.reduce((memo, key, index) => {
            memo[key.name] = values[index];
            return memo;
        }, {})
    }
};
import json from '../../data/data.json';

/**
 * Get all projects
 * @returns {Array}
 */
export const projects = () => {
    return json.projects || [];
};

export const articles = () => {
    return json.articles || [];
};

/**
 * Get specific project
 * @param {string} slug 
 * @returns {object}
 */
export const project = slug => {
    return projects().find(obj => {
        return obj.data.slug == slug;
    });
};

export const article = slug => {
    return articles().find(obj => {
        return obj.data.slug == slug;
    });
};

/**
 * Get index of specific project
 * @param {string} slug 
 * @returns {number}
 */
export const index = slug => {
    return projects().findIndex(obj => {
        return obj.data.slug == slug;
    });
};

/**
 * Get the next project
 * @param {string} slug
 * @returns {object} 
 */
export const next = slug => {
    let i = index(slug);
    i++;
    if (i >= projects().length) {
        i = 1;
    }
    return projects()[i];
};

/**
 * Get the previous project
 * @param {string} slug 
 * @returns {object}
 */
export const prev = slug => {
    let i = index(slug);
    i--;
    if (i <= 0) {
        i = projects().length - 1;
    }
    return projects()[i];
};


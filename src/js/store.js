import json from '../../data/data.json';

/**
 * Get all projects
 * @returns {Array}
 */
export const projects = () => {
    return json.projects || [];
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
}
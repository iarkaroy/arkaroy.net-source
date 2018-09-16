
var queue = {};

/**
 * Broadcast an event
 * 
 * @param {string} event
 * @param {(string|object|array|null)} object
 */
export const broadcast = (event, data) => {
    if(queue[event] && queue[event].length) {
        queue[event].forEach(callback => callback(data));
    }
}

/**
 * Register a callback
 * 
 * @param {string} event 
 * @param {function} callback 
 */
export const listen = (event, callback) => {
    if(!queue[event]) {
        queue[event] = [];
    }
    queue[event].push(callback);
}

/**
 * Unregister a callback
 * 
 * @param {string} event 
 * @param {function} callback 
 */
export const unlisten = (event, callback) => {
    if(queue[event] && queue[event].indexOf(callback) > -1) {
        const index = queue[event].indexOf(callback);
        queue[event].splice(index, 1);
    }
}
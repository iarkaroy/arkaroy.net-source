var queue = {};

class EventSystem {

    static publish(event, data) {
        
        var q = queue[event];

        if (typeof q === 'undefined') {
            return false;
        }

        for(let i=0; i<q.length;++i){
            q[i](data);
        }
        
        return true;
    }

    static subscribe(event, callback) {
        if (typeof queue[event] === 'undefined') {
            queue[event] = [];
        }

        queue[event].push(callback);
    }

}

export default EventSystem;
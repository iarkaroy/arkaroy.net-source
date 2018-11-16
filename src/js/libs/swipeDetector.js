import { broadcast } from "./broadcast";

export const swipeDetector = {
    callbacks: [],
    touches: {
        "touchstart": { "x": -1, "y": -1 },
        "touchmove": { "x": -1, "y": -1 },
        "touchend": false,
        "direction": null
    },
    touchHandler: function (event) {
        var touch;
        if (typeof event !== 'undefined') {
            // event.preventDefault();
            if (typeof event.touches !== 'undefined') {
                touch = event.touches[0];
                switch (event.type) {
                    case 'touchstart':
                    case 'touchmove':
                        swipeDetector.touches[event.type].x = touch.pageX;
                        swipeDetector.touches[event.type].y = touch.pageY;
                        swipeDetector.touches.direction = null;
                        break;
                    case 'touchend':
                        swipeDetector.touches[event.type] = true;
                        if (swipeDetector.touches.touchstart.y > -1 && swipeDetector.touches.touchmove.y > -1) {
                            const diffY = swipeDetector.touches.touchmove.y - swipeDetector.touches.touchstart.y;
                            if (diffY > 0) {
                                swipeDetector.touches.direction = 'up';
                            } else if (diffY < 0) {
                                swipeDetector.touches.direction = 'dn';
                            }
                            swipeDetector.touches.touchstart = { x: -1, y: -1 };
                            swipeDetector.touches.touchmove = { x: -1, y: -1 };
                            broadcast('swipe', swipeDetector.touches.direction);
                            // swipeDetector.callbacks.forEach(callback => callback(swipeDetector.touches.direction));
                        }
                    default:
                        break;
                }
            }
        }
    },
    onSwipe: callback => {
        swipeDetector.callbacks.push(callback);
    },
    bind: () => {
        document.addEventListener('touchstart', swipeDetector.touchHandler, false);
        document.addEventListener('touchmove', swipeDetector.touchHandler, false);
        document.addEventListener('touchend', swipeDetector.touchHandler, false);
    },
    unbind: () => {
        document.removeEventListener('touchstart', swipeDetector.touchHandler, false);
        document.removeEventListener('touchmove', swipeDetector.touchHandler, false);
        document.removeEventListener('touchend', swipeDetector.touchHandler, false);
    },
};
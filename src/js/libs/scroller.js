import { broadcast } from "./broadcast";

var scroll = 0,
    pos = 0,
    scrolling = false,
    pressed = false,
    lastY = 0,
    diffY = 0;

var SPEED = 40, SMOOTH = 40;

var min = 0,
    max = 99999;

var pendingCallback = null;

const clamp = (val) => {
    return Math.max(min, Math.min(max, val));
};

export function bind() {
    document.addEventListener('wheel', wheel);
    if (typeof window.ontouchstart !== "undefined") {
        document.addEventListener("touchstart", tap);
        document.addEventListener("touchmove", drag);
        document.addEventListener("touchend", release);
    }
}

export function unbind() {
    document.removeEventListener('wheel', wheel);
    if (typeof window.ontouchstart !== "undefined") {
        document.removeEventListener("touchstart", tap);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("touchend", release);
    }
}

export function scrollTo(y, callback, smooth = false) {
    pos = clamp(y);
    pendingCallback = callback;
    SMOOTH = smooth ? 20 : 10;
    if (!scrolling) {
        updateScroll();
    }
}

export function setMaxScroll(m) {
    const progress = scroll / max;
    max = m || 99999;
    scroll = progress * max;
    broadcastScroll();
}

function wheel(event) {
    var delta = -event.deltaY || event.delta || event.wheelDelta || -event.detail;
    delta = Math.max(-1, Math.min(1, delta));
    pos += -delta * SPEED;
    pos = clamp(pos);
    if (!scrolling) {
        updateScroll();
    }
}

function tap(event) {
    const e = event || window.event;
    pressed = true;
    lastY = ypos(e);
    diffY = 0;
    e.stopPropagation();
    return false;
}

function drag(e) {
    var y;
    if (pressed) {
        y = ypos(e);
        diffY = lastY - y;
        lastY = y;
        if (diffY > 2 || diffY < -2) {
            scroll += diffY;
            scroll = clamp(scroll);
            broadcastScroll();
        }
    }
    e.stopPropagation();
    return false;
}

function release(event) {
    const e = event || window.event;
    pressed = false;
    var start = 1;
    const animate = function () {
        var step = Math.sin(start);
        if (step <= 0) {
            diffY = 0;
            window.cancelAnimationFrame(animate);
        } else {
            scroll += diffY * step;
            scroll = clamp(scroll);
            start -= 0.02;
            window.requestAnimationFrame(animate);
            broadcastScroll();
        }
    };
    animate();
    e.stopPropagation();
    return false;
}

function updateScroll() {
    var delta = (pos - scroll) / SMOOTH;
    scroll += delta;
    scroll = clamp(scroll);
    broadcastScroll();
    if (Math.abs(delta) > 0.01) {
        requestAnimationFrame(updateScroll);
    } else {
        scrolling = false;
        if (pendingCallback) {
            pendingCallback();
            pendingCallback = null;
            SMOOTH = 40;
        }
    }
}

function broadcastScroll() {
    broadcast('scroller:scroll', scroll);
}

function ypos(e) {
    // touch event
    if (e.targetTouches && e.targetTouches.length >= 1) {
        return e.targetTouches[0].clientY;
    }

    // mouse event
    return e.clientY;
}

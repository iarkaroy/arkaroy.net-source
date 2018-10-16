import { broadcast } from "./broadcast";

var scroll = 0,
    pos = 0,
    scrolling = false,
    pressed = false,
    lastY = 0,
    diffY = 0;

const SPEED = 20, SMOOTH = 40;

var min = 0,
    max = 99999;

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

}

export function setMaxScroll(m) {
    max = m || 99999;
}

function wheel(event) {
    var delta = event.delta || event.wheelDelta || -event.detail;
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

import { broadcast } from "./broadcast";

var scroll = 0,
    pos = 0,
    scrolling = false,
    pressed = false,
    lastY = 0,
    diffY = 0;

const SPEED = 20, SMOOTH = 40;

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

function wheel(event) {
    var delta = event.delta || event.wheelDelta || -event.detail;
    delta = Math.max(-1, Math.min(1, delta));
    pos += -delta * SPEED;
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
    broadcastScroll();
    if (Math.abs(delta) > 0.01) {
        requestAnimationFrame(updateScroll);
    } else {
        scrolling = false;
    }
}

function broadcastScroll() {
    const min = 0;
    const max = 9999;
    scroll = Math.max(min, Math.min(max, scroll));
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

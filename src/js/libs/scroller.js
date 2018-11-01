import { broadcast } from "./broadcast";

var scroll = 0,
    pos = 0,
    scrolling = false,
    pressed = false,
    lastY = 0,
    diffY = 0;

var SPEED = 60, SMOOTH = 30;

var min = 0,
    max = 99999;

var pendingCallback = null;

var trackingPoints = [];

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
    trackingPoints = [];
    addTrackingPoint(lastY);
    e.stopPropagation();
    return false;
}

function drag(e) {
    var y;
    if (pressed) {
        y = ypos(e);
        diffY = lastY - y;
        lastY = y;
        addTrackingPoint(lastY);
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
    const firstPoint = trackingPoints[0];
    const lastPoint = trackingPoints[trackingPoints.length - 1];
    const yOffset = lastPoint.y - firstPoint.y;
    const timeOffset = lastPoint.time - firstPoint.time;
    var velocity = (yOffset / timeOffset * 15) || 0;
    const animate = function () {
        velocity *= 0.95;
        scroll -= velocity;
        scroll = clamp(scroll);
        broadcastScroll();
        if (Math.abs(velocity) > 0.3) {
            requestAnimationFrame(animate);
        }
    };
    requestAnimationFrame(animate);
    e.stopPropagation();
    return false;
}

function addTrackingPoint(y) {
    const time = Date.now();
    while (trackingPoints.length > 0) {
        if (time - trackingPoints[0].time <= 100) {
            break;
        }
        trackingPoints.shift();
    }
    trackingPoints.push({ y, time });
}

function updateScroll() {
    scrolling = true;
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
            SMOOTH = 30;
        }
    }
}

function broadcastScroll() {
    broadcast('scroller:scroll', parseInt(scroll));
}

function ypos(e) {
    // touch event
    if (e.targetTouches && e.targetTouches.length >= 1) {
        return e.targetTouches[0].clientY;
    }

    // mouse event
    return e.clientY;
}

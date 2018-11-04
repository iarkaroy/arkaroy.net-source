import React, { Component } from 'react';
import { listen, unlisten } from '../libs/broadcast';
import { getDimension } from '../libs/getDimension';
import styles from '../../sass/index.sass';

class NoiseCanvas extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            width: 0,
            height: 0
        };
        this.ctx = null;
        this.grain = null;
        this.pattern = null;
        this.frameId = null;
        this.frame = 0;
    }

    componentDidMount() {
        listen('resize', this.handleResize);
        this.handleResize();
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.grain = document.createElement('canvas').getContext('2d');
            this.grain.canvas.width = 64;
            this.grain.canvas.height = 64;
            this.pattern = this.grain.createImageData(64, 64);
            this.frameId = requestAnimationFrame(this.loop);
        }
    }

    componentWillUnmount() {
        unlisten('resize', this.handleResize);
        cancelAnimationFrame(this.frameId);
    }

    updateNoise = () => {
        for (let i = 0; i < 64 * 64 * 4; i += 4) {
            const v = Math.random() * 255;
            this.pattern.data[i] = v;
            this.pattern.data[i + 1] = v;
            this.pattern.data[i + 2] = v;
            this.pattern.data[i + 3] = 10//v * .04;
        }
        this.grain.putImageData(this.pattern, 0, 0);
    };

    drawNoise = () => {
        const { width, height } = this.state;
        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = this.ctx.createPattern(this.grain.canvas, 'repeat');
        this.ctx.fillRect(0, 0, width, height);
    }

    loop = () => {
        this.frameId = requestAnimationFrame(this.loop);
        this.frame++;
        if (this.frame % 6 !== 0) {
            return false;
        }
        this.updateNoise();
        this.drawNoise();
    };

    handleResize = () => {
        this.setState(getDimension());
    };

    render() {
        const { width, height } = this.state;
        return (
            <canvas
                ref={o => { this.canvas = o; }}
                width={width}
                height={height}
                className={styles['noise-canvas']}
            />
        );
    }

}

export default NoiseCanvas;
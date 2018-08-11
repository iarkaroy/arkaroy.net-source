import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { cover, contain } from './libs/canvas-background-size';
import { loadImage } from './libs/load-image';
import { displacementCanvas } from './libs/displacement-canvas';
import SlideTransition from './libs/webgl-slide-transition';

import HeaderComponent from './components/shared/header.component';
import HomePage from './pages/home.page';


class App extends Component {

    /*
    constructor(props) {
        super(props);
        this.state = {
            canvases: []
        };
        this._displacementCanvas = null;
        this._data = null;
    }

    async componentDidMount() {
        var apiEndpoint = "https://iarkaroy.cdn.prismic.io/api/v2";

        Prismic.getApi(apiEndpoint).then(api => {
            return api.query(""); // An empty query will return all the documents
        }).then(response => {
            this._data = response.results;
            this.prepareCanvases();
        }, err => {
            console.log("Something went wrong: ", err);
        });
        this._displacementCanvas = await displacementCanvas(9);
        this.transition = new SlideTransition(this.canvas, window.innerWidth, window.innerHeight);
    }

    draw = () => {
        const { canvases } = this.state;
        setTimeout(() => {
            this.transition.transit(canvases[0], canvases[1], this._displacementCanvas, 1200);
        }, 3000);
        this.transition.render(canvases[0]);
    };

    prepareCanvases = async () => {
        const projects = this.getProjects();
        var canvases = [];
        for (let i = 0; i < projects.length; ++i) {
            let canvas = await this.getCanvas(projects[i]);
            canvases.push(canvas);
        }
        this.setState({ canvases }, this.draw);
    };

    getProjects = () => {
        if (!this._data) {
            return [];
        }
        var projects = this._data.filter(d => {
            return d.type === 'project';
        });
        return projects;
    };

    getCanvas = async (project) => {
        const img = await loadImage(project.data.image.url);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        const { width, height, offsetX, offsetY } = cover(ctx.canvas.width, ctx.canvas.height, img.width, img.height);
        ctx.drawImage(img, offsetX, offsetY, width, height);


        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const { data } = imageData;
        for (var i = 0; i < data.length; i += 4) {
            // var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            var brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
            // alpha
            data[i + 3] = data[i + 3] > 120 ? data[i + 3] - 120 : 0;
        }

        ctx.putImageData(imageData, 0, 0);

        return ctx.canvas;
    };

    render() {
        return (
            <canvas ref={o => { this.canvas = o }} width={window.innerWidth} height={window.innerHeight} />
        );
    }
    */

    render() {
        return (
            <div>
                <HeaderComponent />
                <HomePage />
            </div>
        );
    }

}

export default App;
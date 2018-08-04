import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import { cover, contain } from './libs/canvas-background-size';
import { loadImage } from './libs/load-image';
import {displacementCanvas} from './libs/displacement-canvas';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    async componentDidMount() {
        var apiEndpoint = "https://iarkaroy.cdn.prismic.io/api/v2";

        Prismic.getApi(apiEndpoint).then(api => {
            return api.query(""); // An empty query will return all the documents
        }).then(response => {
            this.setState({
                data: response.results
            })
        }, err => {
            console.log("Something went wrong: ", err);
        });
        const disp = await displacementCanvas();
        document.body.appendChild(disp);
    }

    getProjects = () => {
        const { data } = this.state;
        if (!data) {
            return [];
        }
        var projects = data.filter(d => {
            return d.type === 'project';
        });
        return projects;
    }

    getCanvas = async (project) => {
        const img = await loadImage(project.data.image.url);
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        const { width, height, offsetX, offsetY } = cover(ctx.canvas.width, ctx.canvas.height, img.width, img.height);
        ctx.drawImage(img, offsetX, offsetY, width, height);

        /*
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const { data } = imagedata;
        for (var i = 0; i < data.length; i += 4) {
            var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
        }

        // overwrite original image
        ctx.putImageData(imageData, x, y);
        */
        document.body.appendChild(ctx.canvas);
        return ctx.canvas;
    };

    render() {
        const projects = this.getProjects();
        const canvases = [];
        for (let i = 0; i < projects.length; ++i) {
            this.getCanvas(projects[i]);
        }
        return (
            <div>
            </div>
        );
    }

}

export default App;
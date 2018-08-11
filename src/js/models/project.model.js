import { loadImage } from '../libs/load-image';
import { cover, contain } from '../libs/canvas-background-size';
import { imgToCanvas } from '../libs/img-to-canvas';

class Project {

    constructor() {
        this.id = null;
        this.uid = null;
        this.title = null;
        this.image = null;
        this.description = null;
        this.canvas = null;
    }

    prepCanvas() {
        imgToCanvas(this.image, window.innerWidth, window.innerHeight, true).then(canvas => {
            this.canvas = canvas;
        }, console.log);
    }

    static fromJson(json) {
        var project = new Project;
        project.id = json.id;
        project.uid = json.uid;
        project.title = json.data.title[0].text;
        project.image = json.data.image.url;
        project.prepCanvas();
        return project;
    }

}

export default Project;
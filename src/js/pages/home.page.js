import React, { Component } from 'react';
import Prismic from 'prismic-javascript';
import Project from '../models/project.model';
import { displacementCanvas } from '../libs/displacement-canvas';
import SlideTransition from '../libs/webgl-slide-transition';
import { imgToCanvas } from '../libs/img-to-canvas';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
        this._projects = [];
        this._selectedProject = -1;
        this._displacementCanvas = null;
        this._transition = null;
        this._homeCanvas = null;
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeyDown);
        this.handleResize();
        this.prepareProjects();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    gotoNext = () => {
        if(this._selectedProject < this._projects.length - 1) {
            const nextProject = this._selectedProject + 1;
            const from = this._selectedProject < 0 ? this._homeCanvas : this._projects[this._selectedProject].canvas;
            const to = this._projects[nextProject].canvas;
            this._transition.transit(from, to, this._displacementCanvas, 1200);
            this._selectedProject = nextProject;
        }
    };

    gotoPrev = () => {
        if(this._selectedProject > -1) {
            const nextProject = this._selectedProject - 1;
            const from = this._projects[this._selectedProject].canvas;
            const to = nextProject < 0 ? this._homeCanvas : this._projects[nextProject].canvas;
            this._transition.transit(from, to, this._displacementCanvas, 1200);
            this._selectedProject = nextProject;
        }
    };

    renderCurrSlide = () => {
        if(this._selectedProject < 0) {
            // Home
            if(this._homeCanvas) {
                this._transition.render(this._homeCanvas);
            }
        } else {
            // Project

        }
    }

    handleResize = (event) => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        }, () => {
            const { width, height } = this.state;
            
            displacementCanvas(9, width, height).then(canvas => {
                this._displacementCanvas = canvas;
            }, console.log);

            if(this._transition) {
                this._transition.width = width;
                this._transition.height = height;
            } else {
                this._transition = new SlideTransition(this.canvas, width, height);
            }

            this.prepareHomeCanvas();
            this.renderCurrSlide();
        });
    };

    handleKeyDown = (event) => {
        switch (event.keyCode) {
            case 38:
                this.gotoPrev();
                break;
            case 40:
                this.gotoNext();
                break;
        }
    };

    getProjects = () => {
        return new Promise((resolve, reject) => {
            var apiEndpoint = "https://iarkaroy.cdn.prismic.io/api/v2";
            Prismic.getApi(apiEndpoint).then(api => {
                return api.query(""); // An empty query will return all the documents
            }).then(response => {
                resolve(response.results);
            }, reject);
        });
    };

    prepareProjects = () => {
        this.getProjects().then(data => {
            var projectsData = data.filter(d => {
                return d.type === 'project';
            });
            var projects = [];
            for (let i = 0; i < projectsData.length; ++i) {
                var project = Project.fromJson(projectsData[i]);
                projects.push(project);
            }
            this._projects = projects;
        });
    };

    prepareHomeCanvas = () => {
        const { width, height } = this.state;
        imgToCanvas(require('../../images/bg.jpg'), width, height).then(canvas => {
            this._homeCanvas = canvas;
            this.renderCurrSlide();
        }, console.log);
    };

    render() {
        const { width, height } = this.state;
        return (
            <main>
                <canvas ref={o => { this.canvas = o }} width={width} height={height} />
                <div className="home-info">
                    Hello
                </div>
            </main>
        );
    }

}

export default HomePage;
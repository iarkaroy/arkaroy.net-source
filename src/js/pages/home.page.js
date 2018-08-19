import React, { Component } from 'react';
import { displacementCanvas } from '../libs/displacement-canvas';
import SlideTransition from '../libs/webgl-slide-transition';
import { imgToCanvas } from '../libs/img-to-canvas';
import ProjectPreviewComponent from '../components/project/preview.component';
import jsonData from '../../../data/data.json';

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            projects: [],
            selected: 0
        };

        this._displacementCanvas = null;
        this._transition = null;
        this._canvases = [];
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeyDown);
        this.handleResize();
        // this.prepareProjects();
        this.setState({
            projects: jsonData.projects
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    gotoNext = () => {
        var { selected, projects } = this.state;
        var next = selected + 1;
        if (next >= projects.length) {
            next = 0;
        }
        this._transition.transit(this._canvases[selected], this._canvases[next], this._displacementCanvas, 1000);
        this.setState({ selected: next });
        /*
        if (this._selectedProject < this._projects.length - 1) {
            const nextProject = this._selectedProject + 1;
            const from = this._selectedProject < 0 ? this._homeCanvas : this._projects[this._selectedProject].canvas;
            const to = this._projects[nextProject].canvas;
            this._transition.transit(from, to, this._displacementCanvas, 1200);
            const nextTitle = this._projects[nextProject].title;
            const nextSubtitle = this._projects[nextProject].title + ' sub';
            this.updateInfo(nextTitle, nextSubtitle);
            this._selectedProject = nextProject;
        }
        */
    };

    gotoPrev = () => {
        /*
        if (this._selectedProject > -1) {
            const nextProject = this._selectedProject - 1;
            const from = this._projects[this._selectedProject].canvas;
            const to = nextProject < 0 ? this._homeCanvas : this._projects[nextProject].canvas;
            this._transition.transit(from, to, this._displacementCanvas, 1200);
            const nextTitle = nextProject < 0 ? introAbout : this._projects[nextProject].title;
            const nextSubtitle = nextProject < 0 ? introGreet : this._projects[nextProject].title + ' sub';
            this.updateInfo(nextTitle, nextSubtitle);
            this._selectedProject = nextProject;
        }
        */
    };

    renderCurrSlide = () => {
        const { selected } = this.state;
        if (this._canvases[selected]) {
            this._transition.render(this._canvases[selected]);
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

            if (this._transition) {
                this._transition.width = width;
                this._transition.height = height;
            } else {
                this._transition = new SlideTransition(this.canvas, width, height);
            }
            this.prepareCanvases();
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

    prepareCanvases = () => {
        const { projects } = this.state;
        for (let i = 0; i < projects.length; ++i) {
            const src = `/images/${projects[i].data.thumb}`;
            this.prepareCanvas(src, i);
        }
    };

    prepareCanvas = (src, index) => {
        const { width, height } = this.state;
        imgToCanvas(src, width, height, true).then(canvas => {
            this._canvases[index] = canvas;
            this.renderCurrSlide();
        });
    };

    render() {
        const { width, height, projects, selected } = this.state;
        return (
            <main>
                <canvas ref={o => { this.canvas = o }} width={width} height={height} />
                
                    {projects.map((project, index) => {
                        return <ProjectPreviewComponent
                            key={index}
                            title={project.data.title}
                            slug={project.data.slug}
                            image={project.data.thumb}
                            category={project.data.categories.join(', ')}
                            front={index === 0}
                            selected={index === selected}
                        />;
                    })}
                
            </main>
        );
    }

}

export default HomePage;
import React, { Component } from 'react';
import { displacementCanvas } from '../libs/displacementCanvas';
import SlideTransition from '../libs/webgl-slide-transition';
import { imgToCanvas } from '../libs/imgToCanvas';
import ProjectPreviewComponent from '../components/project/preview.component';
import jsonData from '../../../data/data.json';
import EventSystem from '../libs/event-system';

const TRANSITION_DURATION = 1000;

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

    componentWillLeave(callback) {
        EventSystem.publish('overlay:open');
        setTimeout(callback, 1200);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeyDown);
        this.handleResize();
        this.setState({
            projects: jsonData.projects
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    gotoNext = (event) => {
        if (event) {
            event.preventDefault();
        }
        var { selected, projects } = this.state;
        var next = selected + 1;
        if (next >= projects.length) {
            next = 0;
        }
        this._transition.transit(this._canvases[selected], this._canvases[next], this._displacementCanvas, TRANSITION_DURATION);
        this.setState({ selected: next });
    };

    gotoPrev = (event) => {
        if (event) {
            event.preventDefault();
        }
        var { selected, projects } = this.state;
        var prev = selected - 1;
        if (prev < 0) {
            prev = projects.length - 1;
        }
        this._transition.transit(this._canvases[selected], this._canvases[prev], this._displacementCanvas, TRANSITION_DURATION);
        this.setState({ selected: prev });
    };

    renderCurrSlide = () => {
        const { selected } = this.state;
        if (this._canvases[selected]) {
            this._transition.render(this._canvases[selected]);
        }
    }

    handleResize = (event) => {
        this.setState({
            width: 0,
            height: 0
        }, this.updateDimension);
    };

    updateDimension = () => {
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
                this._transition = this.canvas ? new SlideTransition(this.canvas, width, height) : null;
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

                <div className="project-nav">
                    <a href="#" className="prev" onClick={this.gotoPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" /></svg>
                    </a>
                    <a href="#" className="next" onClick={this.gotoNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" /></svg>
                    </a>
                </div>

            </main>
        );
    }

}

export default HomePage;
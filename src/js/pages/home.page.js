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
        this._preparing = false;
        this._prepareQueue = 0;
    }

    componentWillLeave(callback) {
        EventSystem.publish('overlay:open');
        setTimeout(callback, 850);
    }

    componentDidMount() {
        EventSystem.publish('overlay:block');

        window.addEventListener('resize', this.handleResize);
        document.addEventListener('keydown', this.handleKeyDown);
        this.setState({
            projects: jsonData.projects
        });
        this.handleResize();
        if (navigator.userAgent !== 'ReactSnap') {
            setTimeout(() => {
                EventSystem.publish('overlay:close');
            }, 200);
        }
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

            displacementCanvas(4, width, height).then(canvas => {
                this._displacementCanvas = canvas;
            }, console.log);

            if (this._transition) {
                this._transition.width = width;
                this._transition.height = height;
            } else {
                this._transition = this.canvas ? new SlideTransition(this.canvas, width, height) : null;
            }

            this._prepareQueue++;
            if (!this._preparing) {
                this.prepareCanvases();
            }
        });
    };

    handleKeyDown = (event) => {
        switch (event.keyCode) {

            // Up arrow
            case 38:
                this.gotoPrev();
                break;

            // Down arrow
            case 40:
                this.gotoNext();
                break;
        }
    };

    prepareCanvases = async () => {

        // If no pending queue, exit
        if (this._prepareQueue < 1) {
            return false;
        }

        // Set flag to prevent being called before finishing
        this._preparing = true;
        this._prepareQueue--;

        const { projects, width, height, selected } = this.state;
        this._canvases = [];

        for (let i = 0; i < projects.length; ++i) {
            const src = `/images/${projects[i].data.thumb}`;
            const canvas = await imgToCanvas(src, width, height, true);
            this._canvases[i] = canvas;
        }

        // Render currently selected one
        this._transition.render(this._canvases[selected]);

        // Set flag to be available to be called
        this._preparing = false;

        // Recursive call to handle pending queue
        this.prepareCanvases();
    };

    render() {
        const { width, height, projects, selected } = this.state;
        return (
            <main>
                <canvas ref={o => { this.canvas = o }} width={width} height={height} />

                <div className="project-nav">
                    <a href="#" className="prev" onClick={this.gotoPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" /></svg>
                    </a>
                    <a href="#" className="next" onClick={this.gotoNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" /></svg>
                    </a>
                </div>

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
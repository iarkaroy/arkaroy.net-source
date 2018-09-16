import React, { Component } from 'react';
import { displacementCanvas } from '../libs/displacementCanvas';
import SlideTransition from '../libs/webgl-slide-transition';
import { imgToCanvas } from '../libs/imgToCanvas';
import ProjectPreviewComponent from '../components/project/preview.component';
import * as store from '../store';
import { OVERLAY_TOGGLE, OVERLAY_OPEN, OVERLAY_CLOSE, OVERLAY_BLOCK } from '../libs/shape-overlays';
import { isPrerender } from '../libs/isPrerender';
import { swipeDetector } from '../libs/swipeDetector';
import { Helmet } from 'react-helmet';
import styles from '../../scss/index.scss';
import StructuredData from 'react-google-structured-data';
import { broadcast, listen, unlisten } from '../libs/broadcast';
import { getDimension } from '../libs/getDimension';

const TRANSITION_DURATION = 1000;

const classNames = {
    nav: 'project-list--navigation',
    indiWrapper: 'project-list--indicator-wrapper',
    indiBullet: 'project-list--indicator-bullet',
    indicator: 'project-list--indicator-selected'
};

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
        this._isReady = false;
        this._prepareQueue = 0;
        this._inTransition = false;
    }

    componentWillLeave(callback) {
        broadcast(OVERLAY_OPEN);
        setTimeout(callback, 850);
    }

    componentDidMount() {
        broadcast(OVERLAY_BLOCK);
        listen('resize', this.handleResize);
        listen('wheel', this.handleWheel);
        listen('keydown', this.handleKeyDown);
        if ('ontouchmove' in document) {
            swipeDetector.bind();
            swipeDetector.onSwipe(direction => {
                switch (direction) {
                    case 'up':
                        this.gotoPrev();
                        break;
                    case 'dn':
                        this.gotoNext();
                        break;
                }
            })
        }
        this.setState({
            projects: store.projects()
        });

        this.handleResize();

        if (!isPrerender()) {
            setTimeout(() => {
                broadcast(OVERLAY_CLOSE);
            }, 200);
        }
    }

    componentWillUnmount() {
        unlisten('resize', this.handleResize);
        unlisten('wheel', this.handleWheel);
        unlisten('keydown', this.handleKeyDown);
        if ('ontouchmove' in document) {
            swipeDetector.unbind();
        }
    }

    handleWheel = event => {
        const { deltaY } = event;
        if (deltaY > 0) {
            this.gotoNext();
        }
        if (deltaY < 0) {
            this.gotoPrev();
        }
    };

    gotoNext = (event) => {
        if (event) {
            event.preventDefault();
        }

        // Do nothing if in the middle of a transition
        if (this._inTransition || !this._isReady) {
            return false;
        }

        // Set transition flag so that another transition cannot be triggered
        this._inTransition = true;

        var { selected, projects } = this.state;
        var next = selected + 1;
        if (next >= projects.length) {
            next = 0;
        }

        // Transition
        const from = this._canvases[selected];
        const to = this._canvases[next];
        const callback = () => {
            this._inTransition = false;
        };
        this._transition.transit(from, to, this._displacementCanvas, TRANSITION_DURATION, callback);

        this.setState({ selected: next });

    };

    gotoPrev = (event) => {
        if (event) {
            event.preventDefault();
        }

        // Do nothing if in the middle of a transition
        if (this._inTransition || !this._isReady) {
            return false;
        }

        // Set transition flag so that another transition cannot be triggered
        this._inTransition = true;

        var { selected, projects } = this.state;
        var prev = selected - 1;
        if (prev < 0) {
            prev = projects.length - 1;
        }

        // Transition
        const from = this._canvases[selected];
        const to = this._canvases[prev];
        const callback = () => {
            this._inTransition = false;
        };
        this._transition.transit(from, to, this._displacementCanvas, TRANSITION_DURATION, callback);

        this.setState({ selected: prev });
    };

    handleResize = event => {
        const { width, height } = event || getDimension();
        this.setState({
            width,
            height
        }, () => {
            const { width, height } = this.state;

            displacementCanvas(width, height).then(canvas => {
                this._displacementCanvas = canvas;
            }, console.log);

            if (this._transition) {
                this._transition.resize(width, height);
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

        if (!this._isReady) {
            this._isReady = true;
            // Notify analytics the time taken for getting things ready :)
        }

        // Recursive call to handle pending queue
        this.prepareCanvases();
    };

    render() {
        const { width, height, projects, selected } = this.state;
        return (
            <main>

                <Helmet>
                    <title>Arka Roy &#8211; Web Developer</title>
                </Helmet>

                <StructuredData
                    type="WebSite"
                    data={{
                        name: 'Arka Roy',
                        url: 'https://www.arkaroy.net/'
                    }}
                />

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

                <div className={styles[classNames.nav]}>
                    <a href="#" className={styles.prev} onClick={this.gotoPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" /></svg>
                    </a>
                    <a href="#" className={styles.next} onClick={this.gotoNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" /></svg>
                    </a>
                </div>

                <ul className={selected > 0 ? [styles[classNames.indiWrapper], styles.active].join(' ') : styles[classNames.indiWrapper]}>
                    {projects.map((project, index) => {
                        return index > 0 ? <li key={index} className={styles[classNames.indiBullet]}><a href="#"></a></li> : null;
                    })}
                    <li className={styles[classNames.indicator]} style={{ top: `${(selected - 1) * 1.8 + 0.6}rem` }}></li>
                </ul>

            </main>
        );
    }

}

export default HomePage;
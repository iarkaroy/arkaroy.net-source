import React, { Component } from 'react';
import Title from '../components/Title';
import styles from '../../scss/index.scss';
import * as store from '../store';
import { listen, unlisten, broadcast } from '../libs/broadcast';
import ProjectSlider from '../components/project/ProjectSlider';
import NoiseCanvas from '../components/NoiseCanvas';
import { Link } from '../router';
import { swipeDetector } from '../libs/swipeDetector';
import { getDimension } from '../libs/getDimension';
import animate from '../libs/animate';

class HomePage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            ready: false,
            projects: [],
            selected: -1,
            liquify: 0
        };
        this.lastTransition = 0;
        this.values = {
            liquify: 0
        };
    }

    componentDidMount() {
        this.setState({
            projects: store.projects()
        });
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
        document.fonts.load(`900 8rem 'Inter UI'`, 'BESbswy')
            .then(fonts => {
                if (fonts.length) {
                    this.setState({
                        ready: true
                    });
                }
            });
    }

    componentWillUnmount() {
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

    gotoNext = event => {
        if (event) {
            event.preventDefault();
        }

        const now = Date.now();
        if (now - this.lastTransition < 1200) {
            return false;
        }

        this.lastTransition = now;

        var { selected, projects } = this.state;
        var next = selected + 1;
        if (next < projects.length) {
            if (selected === -1) {
                animate({
                    targets: this.values,
                    liquify: 400,
                    duration: 600,
                    update: () => {
                        this.setState({
                            liquify: this.values.liquify
                        })
                    }
                });
            }
            broadcast('project-slider:change', next);
            this.setState({ selected: next });
        }
    };

    gotoPrev = event => {
        if (event) {
            event.preventDefault();
        }

        const now = Date.now();
        if (now - this.lastTransition < 1200) {
            return false;
        }

        this.lastTransition = now;

        var { selected, projects } = this.state;
        var prev = selected - 1;
        if (prev >= -1) {
            if (prev === -1) {
                animate({
                    targets: this.values,
                    liquify: 0,
                    duration: 600,
                    delay: 500,
                    update: () => {
                        this.setState({
                            liquify: this.values.liquify
                        })
                    }
                });
            }
            broadcast('project-slider:change', prev);
            this.setState({ selected: prev });
        }
    };

    render() {
        const { projects, ready, selected, liquify } = this.state;
        const titleOpacity = 1 - liquify / 400;
        return (
            <main className={styles['main']}>
                <div className={styles['home-intro']} style={{ filter: `url(#liquify)`, opacity: titleOpacity, display: titleOpacity === 0 ? 'none' : 'block' }}>
                    <Title title="ARKA ROY|WEB DEVELOPER" h1={true} split={false} reveal={ready} />
                </div>

                <svg style={{ display: 'none' }}>
                    <defs>
                        <filter id="liquify">
                            <feTurbulence baseFrequency="0.015" numOctaves="3" result="warp" type="fractalNoise" />
                            <feDisplacementMap in="SourceGraphic" in2="warp" scale={liquify} xChannelSelector="R" yChannelSelector="R" />
                        </filter>
                    </defs>
                </svg>


                <div className={styles['project-slider-info']}>
                    {projects.map((project, index) => {
                        return (
                            <Link to={`/projects/${project.data.slug}`} key={index} style={{display: selected === index ? 'block' : 'none'}}>
                                <h2>{project.data.title}</h2>
                            </Link>
                        );
                    })}
                </div>

            </main>
        );
    }

}

export default HomePage;
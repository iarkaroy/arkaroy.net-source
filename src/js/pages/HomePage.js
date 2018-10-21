import React, { Component } from 'react';
import styles from '../../scss/index.scss';
import * as store from '../store';
import { listen, unlisten, broadcast } from '../libs/broadcast';
import { Link } from '../router';
import { swipeDetector } from '../libs/swipeDetector';

class HomePage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            projects: store.projects(),
            selected: store.getSelectedProject(),
            navVisible: false
        };
        this.lastTransition = 0;
    }

    componentDidMount() {
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
        listen('projectchange', this.onProjectChange);
        document.fonts.load(`900 8rem 'Inter UI'`, 'BESbswy')
            .then(fonts => {
                if (fonts.length) {
                    // Font loader
                }
            });

        setTimeout(() => {
            this.setState({
                navVisible: true
            });
        }, 200);
    }

    componentWillUnmount() {
        unlisten('wheel', this.handleWheel);
        unlisten('keydown', this.handleKeyDown);
        if ('ontouchmove' in document) {
            swipeDetector.unbind();
        }
        unlisten('projectchange', this.onProjectChange);
    }

    componentWillLeave(callback) {
        this.setState({
            navVisible: false
        });
        setTimeout(callback, 600);
    }

    onProjectChange = index => {
        this.setState({ selected: index });
    };

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

            // Left / Up arrow
            case 37:
            case 38:
                this.gotoPrev();
                break;

            // Right / Down arrow
            case 39:
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
            store.setSelectedProject(next);
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
        if (prev >= 0) {
            store.setSelectedProject(prev);
        }
    };

    render() {
        const { projects, selected, navVisible } = this.state;
        // const titleOpacity = 1 - liquify / 400;
        var projectIndexes = [];
        for (let i = 0; i < projects.length; ++i) {
            var className = styles['num'];
            var style = {
                transform: `translate3d(0, ${(i - selected) * 14}px, 0)`,
                opacity: i === selected ? 1 : 0
            };
            var t = i + 1;
            projectIndexes.push(<div className={className} style={style} key={i}>{t < 10 ? '0' + t : t}</div>);
        }
        return (
            <main className={styles['main']}>

                <div className={styles['project-index']} style={{ opacity: navVisible ? 1 : 0 }}>
                    <div className={styles['index']}>{projectIndexes}</div>
                    <div className={styles['sep']}></div>
                    <div className={styles['total']}>{projects.length < 10 ? '0' + projects.length : projects.length}</div>
                </div>

                <div className={styles['project-slider-info']}>
                    {projects.map((project, index) => {
                        var linkClasses = [styles['project-slider-link']];
                        if (index === selected) {
                            linkClasses.push(styles['curr']);
                        } else if (index === selected - 1) {
                            linkClasses.push(styles['prev']);
                        } else if (index === selected + 1) {
                            linkClasses.push(styles['next']);
                        } else {
                            linkClasses.push(styles['hidden']);
                        }
                        return (
                            <Link to={`/projects/${project.data.slug}`}
                                key={index}
                                className={linkClasses.join(' ')}
                            >
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
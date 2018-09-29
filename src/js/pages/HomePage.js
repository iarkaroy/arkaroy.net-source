import React, { Component } from 'react';
import Title from '../components/Title';
import styles from '../../scss/index.scss';
import animate from '../libs/animate';
import * as store from '../store';
import ProjectCard from '../components/project/ProjectCard';
import { listen, unlisten } from '../libs/broadcast';
import { swipeDetector } from '../libs/swipeDetector';

class HomePage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            liquifyScale: 0,
            liquifyOpacity: 1,
            titleReveal: false,
            projects: [],
            selected: -1,
            rotateX: 0,
            rotateY: 0
        };
        this.liquifyOptions = {
            scale: 0,
            opacity: 1
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                titleReveal: true
            });
        }, 2000);

        this.setState({
            projects: store.projects()
        });
        listen('mousemove', this.onMouseMove);
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
    }

    componentWillUnmount() {
        unlisten('mousemove', this.onMouseMove);
    }

    onMouseMove = event => {
        const { pageX, pageY } = event;
        var x = pageX / window.innerWidth;
        var y = pageY / window.innerHeight;
        x = x * 2 - 1;
        y = y * 2 - 1;
        x *= -1;
        this.setState({
            rotateY: x * 5,
            rotateX: y * 5
        });
    };

    gotoNext = event => {
        if (event) {
            event.preventDefault();
        }
        const { projects, selected } = this.state;
        if (selected < 0) {
            this.liquifyOptions = {
                scale: 0,
                opacity: 1
            };
            animate({
                targets: this.liquifyOptions,
                scale: 400,
                opacity: 0,
                duration: 1200,
                easing: 'quintOut',
                update: () => {
                    this.setState({
                        liquifyScale: this.liquifyOptions.scale,
                        liquifyOpacity: this.liquifyOptions.opacity
                    });
                },
                complete: () => {
                    this.setState({ selected: 0 })
                }
            });
        } else {
            var next = selected + 1;
            if (next >= projects.length) {
                next = projects.length - 1;
            }
            this.setState({
                selected: next
            });
        }
    };

    gotoPrev = event => {
        if (event) {
            event.preventDefault();
        }
        const { projects, selected } = this.state;
        var prev = selected - 1;
        if (prev < -1) {
            prev = -1;
        }
        if (prev === -1) {
            setTimeout(() => {
                this.liquifyOptions = {
                    scale: 400,
                    opacity: 0
                };
                animate({
                    targets: this.liquifyOptions,
                    scale: 0,
                    opacity: 1,
                    duration: 1200,
                    easing: 'quintOut',
                    update: () => {
                        this.setState({
                            liquifyScale: this.liquifyOptions.scale,
                            liquifyOpacity: this.liquifyOptions.opacity
                        });
                    }
                });
            }, 800);
        }
        this.setState({ selected: prev });
    };

    render() {
        const { liquifyScale, liquifyOpacity, titleReveal, projects, selected, rotateX, rotateY } = this.state;
        return (
            <div>
                <div className={styles['home-intro']} style={{ filter: `url(#liquify)`, opacity: liquifyOpacity }}>
                    <Title title="Arka Roy|Web Developer" h1={true} split={false} reveal={titleReveal} />
                </div>

                <svg>
                    <defs>
                        <filter id="liquify">
                            <feTurbulence baseFrequency="0.015" numOctaves="3" result="warp" type="fractalNoise" />
                            <feDisplacementMap in="SourceGraphic" in2="warp" scale={liquifyScale} xChannelSelector="R" yChannelSelector="R" />
                        </filter>
                    </defs>
                </svg>


                {projects.map((project, index) => {
                    return <ProjectCard
                        key={index}
                        title={project.data.title}
                        slug={project.data.slug}
                        image={project.data.thumb}
                        category={project.data.categories.join(', ')}
                        index={index}
                        selected={index === selected}
                        rotateX={rotateX}
                        rotateY={rotateY}
                    />;
                })}

                <div className={styles['project-navigation']}>
                    <a href="#" className={styles.prev} onClick={this.gotoPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 16.67l2.829 2.83 9.175-9.339 9.167 9.339 2.829-2.83-11.996-12.17z" /></svg>
                    </a>
                    <a href="#" className={styles.next} onClick={this.gotoNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z" /></svg>
                    </a>
                </div>

            </div>
        );
    }

}

export default HomePage;
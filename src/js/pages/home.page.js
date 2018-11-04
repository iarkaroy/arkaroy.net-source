import React, { Component } from 'react';
import ProjectPreviewComponent from '../components/project/preview.component';
import * as store from '../store';
import { OVERLAY_OPEN, OVERLAY_CLOSE, OVERLAY_BLOCK } from '../libs/shape-overlays';
import { isPrerender } from '../libs/isPrerender';
import { swipeDetector } from '../libs/swipeDetector';
import { Helmet } from 'react-helmet';
import styles from '../../sass/index.sass';
import StructuredData from 'react-google-structured-data';
import { broadcast, listen, unlisten } from '../libs/broadcast';
import { getDimension } from '../libs/getDimension';

const classNames = {
    nav: 'project-list--navigation'
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

        var { selected, projects } = this.state;
        var next = selected + 1;
        if (next >= projects.length) {
            next = 0;
        }

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

        this.setState({ selected: prev });
    };

    handleResize = event => {
        const { width, height } = event || getDimension();
        this.setState({
            width,
            height
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

            </main>
        );
    }

}

export default HomePage;
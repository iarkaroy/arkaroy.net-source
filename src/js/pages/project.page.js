import React, { Component } from 'react';
import EventSystem from '../libs/event-system';
import { isPrerender } from '../libs/isPrerender';
import * as store from '../store';
import { Helmet } from 'react-helmet';
import styles from '../../scss/index.scss';

class ProjectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: null,
            next: null,
            prev: null,
            width: 0,
            height: 0
        };
    }

    componentDidMount() {
        EventSystem.publish('overlay:block');
        if (!isPrerender()) {
            setTimeout(() => {
                EventSystem.publish('overlay:close');
            }, 200);
        }
        const slug = this.props.params.id
        this.setState({
            project: store.project(slug),
            next: store.next(slug),
            prev: store.prev(slug)
        });
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentWillLeave(callback) {
        EventSystem.publish('overlay:open');
        setTimeout(callback, 850);
    }

    handleResize = event => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        this.setState({
            width: clientWidth,
            height: clientHeight
        });
    }

    render() {
        const { project, next, prev, width, height } = this.state;
        if (!project) {
            return null;
        }
        const { data } = project;
        const thumb = `/images/${data.thumb}`;
        return (
            <main className={styles.projectSingle}>
                <Helmet>
                    <title>{data.title} - Arka Roy - Web Developer</title>
                </Helmet>
                <div className={styles.background} style={{ backgroundImage: `url('${thumb}')`, height: height }}></div>
                <div className={styles.header} style={{ height: height }}>
                    <div className={styles.content}>
                        <h1>{data.title}</h1>
                        {data.overview && <h4>{data.overview}</h4>}
                    </div>
                </div>
                <div className={styles.body}>
                    {data.summary && <div className={styles.summary}>{data.summary}</div>}
                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: project.html }}></div>
                </div>

            </main>
        );
    }

}

export default ProjectPage;
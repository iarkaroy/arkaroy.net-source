import React, { Component } from 'react';
import EventSystem from '../libs/event-system';
import { isPrerender } from '../libs/isPrerender';
import * as store from '../store';
import { Helmet } from 'react-helmet';
import styles from '../../scss/index.scss';
import { Link } from '../router';

const classNames = {
    metaWrapper: 'project-meta--wrapper',
    metaInfo: 'project-meta--info',
    nextWrapper: 'next-project--wrapper',
    nextInfoWrapper: 'next-project--info-wrapper',
    nextInfo: 'next-project--info'
};

class ProjectPage extends Component {

    constructor(props, context) {
        super(props, context);
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
        const slug = this.props.params.id
        this.loadProject(slug);
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

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevSlug = prevProps.params.id;
        const slug = this.props.params.id
        if(slug !== prevSlug) {
            this.loadProject(slug);
        }
    }

    loadProject = slug => {
        this.setState({
            project: store.project(slug),
            next: store.next(slug),
            prev: store.prev(slug)
        });
        window.scrollTo(0, 0);
        if (!isPrerender()) {
            setTimeout(() => {
                EventSystem.publish('overlay:close');
            }, 200);
        }
    };

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
                    <title>{data.title} &#8211; Arka Roy &#8211; Web Developer</title>
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
                    <div className={styles[classNames.metaWrapper]}>
                        <div className={styles[classNames.metaInfo]}>
                            <h5>Services</h5>
                            <h4>{data.categories.join(', ')}</h4>
                        </div>
                        <div className={styles[classNames.metaInfo]}>
                            <h5>Year</h5>
                            <h4>{(new Date(data.date)).getFullYear()}</h4>
                        </div>
                    </div>
                    <div className={styles.content} dangerouslySetInnerHTML={{ __html: project.html }}></div>
                    {
                        next &&
                        <div className={styles[classNames.nextWrapper]}>
                            <div className={styles[classNames.nextInfoWrapper]} style={{ backgroundImage: `url('/images/${next.data.thumb}')` }}>
                                <Link to={`/projects/${next.data.slug}`} className={styles[classNames.nextInfo]}>
                                    <strong>Next</strong>
                                    <h3>{next.data.title}</h3>
                                    <h4>{next.data.categories.join(', ')}</h4>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/></svg>
                                </Link>
                            </div>
                        </div>
                    }
                </div>

            </main>
        );
    }

}

export default ProjectPage;
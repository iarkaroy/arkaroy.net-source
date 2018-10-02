import React, { Component } from 'react';
import { isPrerender } from '../libs/isPrerender';
import * as store from '../store';
import { Helmet } from 'react-helmet';
import styles from '../../scss/index.scss';
import { OVERLAY_TOGGLE, OVERLAY_OPEN, OVERLAY_CLOSE, OVERLAY_BLOCK } from '../libs/shape-overlays';
import { Link } from '../router';
import { broadcast, listen, unlisten } from '../libs/broadcast';

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
            height: 0,
            bgOpacity: 1,
            bgTop: 0,
            liquifyScale: 0
        };
        this.timeoutId = 0;
    }

    componentDidMount() {
        broadcast(OVERLAY_BLOCK);
        const slug = this.props.params.id
        this.loadProject(slug);
        window.addEventListener('resize', this.handleResize);
        listen('scroll', this.handleScroll);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        unlisten('scroll', this.handleScroll);
    }

    handleScroll = event => {
        const { scrollY } = window;
        var opacity = 1 - scrollY * .003;
        if (opacity < 0) {
            opacity = 0;
        }
        this.setState({
            bgOpacity: opacity,
            bgTop: -scrollY * .2,
            // liquifyScale: scrollY
        });
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        setTimeout(() => {

        }, 80);

    };

    componentWillLeave(callback) {
        broadcast(OVERLAY_OPEN);
        setTimeout(callback, 850);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevSlug = prevProps.params.id;
        const slug = this.props.params.id
        if (slug !== prevSlug) {
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
                broadcast(OVERLAY_CLOSE);
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
        const { project, next, prev, width, height, bgOpacity, bgTop, liquifyScale } = this.state;
        if (!project) {
            return null;
        }
        const { data } = project;
        const thumb = `/images/${data.thumb}`;
        return (
            <main>

                <Helmet>
                    <title>{data.title} &#8211; Arka Roy &#8211; Web Developer</title>
                </Helmet>

                <div className={styles['project-background']} style={{ backgroundImage: `url('${thumb}')`, height: height * 1.5, opacity: bgOpacity, transform: `translateY(${bgTop}px)` }}></div>

                <div className={styles['project-single']}>

                    <div className={styles['project-content']}>
                        <h1 style={{ filter: `url(#liquify)` }}>{data.title}</h1>

                        <svg style={{ display: 'none' }}>
                            <defs>
                                <filter id="liquify">
                                    <feTurbulence baseFrequency="0.015" numOctaves="3" result="warp" type="fractalNoise" />
                                    <feDisplacementMap in="SourceGraphic" in2="warp" scale={liquifyScale} xChannelSelector="R" yChannelSelector="R" />
                                </filter>
                            </defs>
                        </svg>

                        <div className={styles['project-intro']}>
                            <div className={styles['project-overview']}>
                                {data.overview && <h4>{data.overview}</h4>}
                                {data.summary && <p>{data.summary}</p>}
                            </div>
                            <div className={styles['project-meta']}>
                                <h5>Services</h5>
                                <h4>{data.categories.join(', ')}</h4>
                                <h5>Year</h5>
                                <h4>{(new Date(data.date)).getFullYear()}</h4>
                            </div>
                        </div>

                        <div className={styles['project-body']} dangerouslySetInnerHTML={{ __html: project.html }}></div>
                    </div>

                </div>



                <div className={styles.body}>


                    {
                        next &&
                        <div className={styles[classNames.nextWrapper]}>
                            <div className={styles[classNames.nextInfoWrapper]} style={{ backgroundImage: `url('/images/${next.data.thumb}')` }}>
                                <Link to={`/projects/${next.data.slug}`} className={styles[classNames.nextInfo]}>
                                    <strong>Next</strong>
                                    <h3>{next.data.title}</h3>
                                    <h4>{next.data.categories.join(', ')}</h4>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z" /></svg>
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
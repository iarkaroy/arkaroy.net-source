import React, { Component } from 'react';
import { isPrerender } from '../libs/isPrerender';
import * as store from '../store';
import { Helmet } from 'react-helmet';
import styles from '../../scss/index.scss';
import { OVERLAY_TOGGLE, OVERLAY_OPEN, OVERLAY_CLOSE, OVERLAY_BLOCK } from '../libs/shape-overlays';
import { Link } from '../router';
import { broadcast, listen, unlisten } from '../libs/broadcast';
import { getDimension } from '../libs/getDimension';
import * as scroller from '../libs/scroller';

class ProjectPage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            project: null,
            next: null,
            prev: null,
            width: 0,
            height: 0,
            scroll: 0,
            contentHeight: 0
        };
        this.frameId = 0;
    }

    componentDidMount() {
        const slug = this.props.params.id
        this.loadProject(slug);
        this.frameId = requestAnimationFrame(this.handleResize);
        scroller.bind();
        listen('scroller:scroll', this.updateScroll);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        scroller.unbind();
        unlisten('scroller:scroll', this.updateScroll);
    }

    componentWillLeave(callback) {
        scroller.scrollTo(0, callback);
    }

    updateScroll = scroll => {
        this.setState({
            scroll
        });
    };

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
    };

    handleResize = () => {
        this.frameId = requestAnimationFrame(this.handleResize);
        const { width, height } = getDimension();
        const contentHeight = this.content ? this.content.clientHeight : 0;
        if (contentHeight) {
            scroller.setMaxScroll(contentHeight);
        }
        if (width !== this.state.width || height !== this.state.height || contentHeight !== this.state.contentHeight) {
            this.setState({
                width,
                height,
                contentHeight
            });
        }
    }

    render() {
        const { project, next, prev, width, height, scroll, contentHeight } = this.state;
        if (!project) {
            return null;
        }
        const { data } = project;
        const thumb = `/images/${data.thumb}`;
        return (
            <main className={styles['main']}>

                <Helmet>
                    <title>{data.title} &#8211; Arka Roy &#8211; Web Developer</title>
                </Helmet>

                <div className={styles['scroll-down']}>
                    <div className={styles['arrow-down']}></div>
                </div>

                <div className={styles['project-single']} ref={o => this.content = o} style={{ transform: `translate3d(0, ${height - scroll}px, 0)` }} onLoad={console.log}>

                    <div className={styles['project-content']}>

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

                <div className={styles['scrollbar']} style={{ transform: `translate3d(0, ${(height * scroll / contentHeight).toFixed(2) - height}px, 0)` }}></div>


                {/*

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
*/}
            </main>
        );
    }

}

export default ProjectPage;
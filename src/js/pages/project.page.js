import React, { Component } from 'react';
import * as store from '../store';
import { Helmet } from 'react-helmet';
import styles from '../../scss/index.scss';
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
            contentHeight: 0,
            subtitle: false
        };
        this.frameId = 0;
    }

    componentDidMount() {
        const slug = this.props.params.id
        this.loadProject(slug);
        this.frameId = requestAnimationFrame(this.handleResize);
        scroller.bind();
        listen('scroller:scroll', this.updateScroll);
        setTimeout(() => {
            this.setState({ subtitle: true });
        }, 400);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        scroller.unbind();
        unlisten('scroller:scroll', this.updateScroll);
    }

    componentWillLeave(callback, to) {
        if (to === 'HomePage') {
            scroller.scrollTo(0, () => {
                this.setState({ subtitle: false });
                setTimeout(callback, 500);
            });
        } else {
            scroller.reset();
            callback();
        }
    }

    updateScroll = scroll => {
        if (scroll !== this.state.scroll) {
            this.setState({
                scroll
            });
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const prevSlug = prevProps.params.id;
        const slug = this.props.params.id
        if (slug !== prevSlug) {
            this.loadProject(slug);
        }
    }

    loadProject = slug => {
        const project = store.project(slug);
        this.setState({
            project,
            next: store.next(slug),
            prev: store.prev(slug)
        }, () => {
            var html = project.html;
            html = html.replace(/\"row\"/g, `"${styles['row']}"`);
            html = html.replace(/\"col\"/g, `"${styles['col']}"`);
            this.contentBody.innerHTML = html;
        });
    };

    handleResize = () => {
        this.frameId = requestAnimationFrame(this.handleResize);
        const { width, height } = getDimension();
        const contentHeight = this.content ? this.content.clientHeight : 0;
        if (contentHeight && contentHeight !== this.state.contentHeight) {
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

    onScrollDownClicked = event => {
        if (event) {
            event.preventDefault();
        }
        const { height } = this.state;
        scroller.scrollTo(height, null, true);
    };

    render() {
        const { project, next, prev, width, height, scroll, contentHeight, subtitle } = this.state;
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

                <div className={styles['project-slider-info']} style={{ transform: `translate3d(0, ${-scroll}px, 0)` }}>
                    <div className={[styles['project-slider-link'], styles['curr']].join(' ')}>
                        <div className={styles['project-title']}>
                            <h2>{project.data.title}</h2>
                            {data.overview && <h4 className={subtitle ? styles['active'] : ''}>{data.overview}</h4>}
                        </div>
                    </div>
                    <div className={subtitle ? [styles['scroll-indicator-wrapper'], styles['active']].join(' ') : styles['scroll-indicator-wrapper']}>
                        <a href="#" className={styles['scroll-indicator']} onClick={this.onScrollDownClicked}>
                            <svg viewBox="0 0 30 45" enableBackground="new 0 0 30 45">
                                <path fill="none" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" d="M15,1.118c12.352,0,13.967,12.88,13.967,12.88v18.76  c0,0-1.514,11.204-13.967,11.204S0.931,32.966,0.931,32.966V14.05C0.931,14.05,2.648,1.118,15,1.118z" />
                            </svg>
                        </a>
                    </div>
                </div>

                <div className={styles['project-single']} ref={o => this.content = o} style={{ transform: `translate3d(0, ${height - scroll}px, 0)` }}>

                    <div className={styles['project-content']}>

                        <div className={styles['project-intro']}>
                            <div className={styles['project-overview']}>
                                {data.summary && <p>{data.summary}</p>}
                            </div>
                            <div className={styles['project-meta']}>
                                <h5>Services</h5>
                                <h4>{data.categories.join(', ')}</h4>
                                <h5>Year</h5>
                                <h4>{(new Date(data.date)).getFullYear()}</h4>
                            </div>
                        </div>

                        <div className={styles['project-body']} ref={o => this.contentBody = o}></div>
                    </div>

                </div>

                <div className={styles['scrollbar']} style={{ transform: `translate3d(0, ${parseInt((height * scroll / contentHeight) - height)}px, 0)` }}></div>

            </main>
        );
    }

}

export default ProjectPage;
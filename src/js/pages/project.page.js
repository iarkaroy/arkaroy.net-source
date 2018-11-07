import React, { Component } from 'react';
import * as store from '../store';
import { Helmet } from 'react-helmet';
import styles from '../../sass/index.sass';
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
            subtitle: false,
            contentLoaded: false
        };
    }

    componentDidMount() {
        const slug = this.props.params.id
        this.loadProject(slug);
        listen('resize', this.handleResize);
        listen('scroller:scroll', this.updateScroll);
        setTimeout(() => {
            this.setState({ subtitle: true });
        }, 600);
        this.handleResize();
    }

    componentWillUnmount() {
        scroller.unbind();
        unlisten('resize', this.handleResize);
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
            var images = this.contentBody.querySelectorAll('img');
            var loaded = 0;
            const onLoad = () => {
                loaded++;
                if (loaded === images.length) {
                    const contentHeight = this.content.clientHeight;
                    this.setState({ contentHeight, contentLoaded: true });
                    scroller.bind();
                    scroller.setMaxScroll(contentHeight);
                }
            };
            for (let i = 0; i < images.length; ++i) {
                if (images[i].complete) {
                    onLoad();
                } else {
                    images[i].onload = onLoad;
                }
            }
        });
    };

    handleResize = () => {
        const { width, height } = getDimension();
        const contentHeight = this.content ? this.content.clientHeight : 0;
        this.setState({
            width,
            height,
            contentHeight
        });
        scroller.setMaxScroll(contentHeight);
    }

    onScrollDownClicked = event => {
        if (event) {
            event.preventDefault();
        }
        const { height } = this.state;
        scroller.scrollTo(height + 1, null, true);
    };

    render() {
        const { project, next, prev, width, height, scroll, contentHeight, subtitle, contentLoaded } = this.state;
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


                <div className={[styles['slider-overlay'], styles['curr']].join(' ')} style={{ transform: `translate3d(0, ${-scroll}px, 0)` }}>

                    <div className={styles['title-container']}>
                        <h2 className={styles['title']}>{project.data.title}</h2>
                        {
                            data.overview &&
                            <h4 className={styles['subtitle']} style={{
                                opacity: subtitle ? 1 : 0,
                                transform: `translate3d(-50%, ${subtitle ? 0 : 20}px, 0)`
                            }}>
                                {data.overview}
                            </h4>
                        }
                    </div>

                    <div className={styles['scroll-indicator']} style={{
                        opacity: contentLoaded && subtitle ? 1 : 0,
                        transform: `translate3d(-50%, ${contentLoaded && subtitle ? 0 : 10}px, 0) scale(0.8)`
                    }}>
                        <a href="#" className={styles['indicator']} onClick={this.onScrollDownClicked}>
                            <svg viewBox="0 0 30 45" enableBackground="new 0 0 30 45">
                                <path fill="none" stroke="#ffffff" strokeWidth="2" strokeMiterlimit="10" d="M15,1.118c12.352,0,13.967,12.88,13.967,12.88v18.76  c0,0-1.514,11.204-13.967,11.204S0.931,32.966,0.931,32.966V14.05C0.931,14.05,2.648,1.118,15,1.118z" />
                            </svg>
                        </a>
                    </div>

                    <span className={styles['loading-indicator']} style={{
                        opacity: contentLoaded ? 0 : 1,
                        visibility: contentLoaded ? 'hidden' : 'visible'
                    }}>
                        <svg height={60} width={60}>
                            <circle cx={30} cy={30} r={20} strokeWidth="2" fill="none" />
                        </svg>
                    </span>

                </div>



                <div className={styles['project']} ref={o => this.content = o} style={{ transform: `translate3d(0, ${height - scroll}px, 0)` }}>

                    <div className={styles['content']}>

                        <div className={styles['intro']}>
                            <div className={styles['overview']}>
                                {data.summary && <p>{data.summary}</p>}
                            </div>
                            <div className={styles['meta']}>
                                <h5 className={styles['label']}>Services</h5>
                                <h4 className={styles['value']}>{data.categories.join(', ')}</h4>
                                <h5 className={styles['label']}>Year</h5>
                                <h4 className={styles['value']}>{(new Date(data.date)).getFullYear()}</h4>
                            </div>
                        </div>

                        <div className={styles['body']} ref={o => this.contentBody = o}></div>

                    </div>

                </div>

                <div className={styles['scrollbar']} style={{ transform: `translate3d(0, ${contentLoaded ? parseInt((height * scroll / contentHeight) - height) : -height}px, 0)` }}></div>

            </main>
        );
    }

}

export default ProjectPage;
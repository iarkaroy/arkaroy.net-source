import React, { Component } from 'react';
import styles from '../../sass/index.sass';
import Skill from '../components/Skill';
import { unlisten, listen } from '../libs/broadcast';
import * as scroller from '../libs/scroller';
import { getDimension } from '../libs/getDimension';
import Head from '../components/shared/Head';

class AboutPage extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            width: 0,
            height: 0,
            scroll: 0,
            contentHeight: 0
        };
        this.frameId = 0;
    }

    componentDidMount() {
        this.frameId = requestAnimationFrame(this.handleResize);
        scroller.bind();
        listen('scroller:scroll', this.updateScroll);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId);
        scroller.unbind();
        unlisten('scroller:scroll', this.updateScroll);
    }

    componentWillLeave(callback, to) {
        scroller.reset();
        callback();
    }

    updateScroll = scroll => {
        if (scroll !== this.state.scroll) {
            this.setState({
                scroll
            });
        }
    };

    handleResize = () => {
        this.frameId = requestAnimationFrame(this.handleResize);
        const { width, height } = getDimension();
        const contentHeight = this.content ? this.content.clientHeight - height : 0;
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
    };

    render() {
        const { width, height, scroll, contentHeight } = this.state;
        return (
            <main className={styles['main']}>

                <Head title="About" />

                <div className={styles['about-container']} ref={o => this.content = o} style={{ transform: `translate3d(0, ${-scroll}px, 0)` }}>

                    <div className={styles['about-page']}>

                        <div className={styles['about']}>
                            <h4>Hi, there!</h4>
                            <h2>I'm a full stack web developer having 8+ years of experience on building highly sophisticated web applications.</h2>
                            <p>Hello! I'm Arka Roy. I am a passionate self-taught web developer proficient in building scalable, easy-to-navigate web applications and pixel-perfect front-end interfaces. My expertise ranges over a vast space from HTML, CSS to modern JavaScript single page applications with server programming with PHP, MySQL etc.</p>
                            <p>I love to explore new technologies and concepts in web presence. I am always keen to hear about new interseting projects, so feel free to reach me for your next project.</p>
                        </div>

                        <div className={styles['skills']}>
                            <h4 className={styles['margin-left']}>Skills</h4>
                            <Skill strength={97}>PHP</Skill>
                            <Skill strength={95}>MySQL</Skill>
                            <Skill strength={90}>JavaScript</Skill>
                            <Skill strength={90}>jQuery</Skill>
                            <Skill strength={85}>Laravel</Skill>
                            <Skill strength={90}>CodeIgniter</Skill>
                            <Skill strength={98}>HTML5</Skill>
                            <Skill strength={95}>CSS3</Skill>
                            <Skill strength={92}>AJAX</Skill>
                            <Skill strength={85}>PDO</Skill>
                            <Skill strength={90}>MVC</Skill>
                            <Skill strength={96}>JSON</Skill>
                            <Skill strength={75}>NodeJS</Skill>
                            <Skill strength={90}>ReactJS</Skill>
                            <Skill strength={65}>ExpressJS</Skill>
                            <Skill strength={60}>MongoDB</Skill>
                            <Skill strength={85}>REST</Skill>
                            <Skill strength={95}>OOP</Skill>
                            <Skill strength={80}>Git</Skill>
                            <Skill strength={60}>ElectronJS</Skill>
                        </div>

                    </div>

                </div>

                <div className={styles['scrollbar']} style={{ transform: `translate3d(0, ${parseInt((height * scroll / contentHeight) - height)}px, 0)` }}></div>

            </main>
        );
    }

}

export default AboutPage;
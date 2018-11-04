import React, { Component } from 'react';
import styles from '../../sass/index.sass';
import Skill from '../components/Skill';
import { unlisten, listen } from '../libs/broadcast';
import * as scroller from '../libs/scroller';
import { getDimension } from '../libs/getDimension';

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
                <div className={styles['about-container']} ref={o => this.content = o} style={{ transform: `translate3d(0, ${-scroll}px, 0)` }}>

                    <div className={styles['about-page']}>

                        <div className={styles['about']}>
                            <h4>Hi, there!</h4>
                            <h2>I'm a full stack web developer having 8+ years of experience on building highly sophisticated web applications.</h2>
                        </div>

                        <div className={styles['skills']}>
                            <h4 className={styles['margin-left']}>Skills</h4>
                            <Skill strength={60}>PHP</Skill>
                            <Skill>MySQL</Skill>
                            <Skill>JavaScript</Skill>
                            <Skill>jQuery</Skill>
                            <Skill>HTML5</Skill>
                            <Skill>CSS3</Skill>
                            <Skill>PHP</Skill>
                            <Skill>PHP</Skill>
                        </div>

                    </div>

                </div>

                <div className={styles['scrollbar']} style={{ transform: `translate3d(0, ${parseInt((height * scroll / contentHeight) - height)}px, 0)` }}></div>

            </main>
        );
    }

}

export default AboutPage;
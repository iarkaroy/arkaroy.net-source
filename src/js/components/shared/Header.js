import React, { Component } from 'react';
import { Link } from '../../router';
import ShapeOverlays from '../../libs/shape-overlays';
import EventSystem from '../../libs/event-system';
import styles from '../../../scss/index.scss';
import Logo from './Logo';

class Header extends Component {

    componentDidMount() {
        this.overlay = new ShapeOverlays(this.overlays);
        EventSystem.subscribe('overlay:toggle', this.toggleOverlay);
        EventSystem.subscribe('overlay:open', this.openOverlay);
        EventSystem.subscribe('overlay:close', this.closeOverlay);
        EventSystem.subscribe('overlay:block', this.blockOverlay);
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = event => {
        const { scrollY } = window;
        const rect = this.logoBack.getBoundingClientRect();
        const { top, height } = rect;
        const winHeight = window.document.documentElement.clientHeight;
        const edge = winHeight - (top + height);
        const diff = scrollY - edge;
        if (diff >= 0) {
            const newHeight = height - diff;
            this.logoFront.style.height = newHeight >= 0 ? `${newHeight}px` : 0;
        } else {
            this.logoFront.style.height = `100%`;
        }
    };

    toggleOverlay = () => {
        if (this.overlay.isAnimating) {
            return false;
        }
        this.overlay.toggle();
    };

    openOverlay = () => {
        if (this.overlay.isAnimating) {
            return false;
        }
        this.overlay.open();
    };

    closeOverlay = () => {
        if (this.overlay.isAnimating) {
            return false;
        }
        this.overlay.close();
    };

    blockOverlay = () => {
        this.overlay.block();
    };

    render() {
        return (
            <header className={styles.siteHeader}>
                <Link to="/" className={styles.homeLink}>
                    <span className={styles.back} ref={o => { this.logoBack = o; }}>
                        <i className={styles.logo} />
                    </span>
                    <span className={styles.front} ref={o => { this.logoFront = o; }}>
                        <i className={styles.logo} />
                    </span>
                </Link>
                <svg className={styles.shapeOverlays} viewBox="0 0 100 100" preserveAspectRatio="none" ref={o => { this.overlays = o; }}>
                    <path></path>
                    <path></path>
                </svg>

            </header>
        );
    }

}

export default Header;
import React, { Component } from 'react';
import { Link } from '../../router';
import ShapeOverlays, { OVERLAY_TOGGLE, OVERLAY_OPEN, OVERLAY_CLOSE, OVERLAY_BLOCK } from '../../libs/shape-overlays';
import styles from '../../../scss/index.scss';
import { broadcast, listen, unlisten } from '../../libs/broadcast';

class Header extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            active: false
        };
    }

    componentDidMount() {
        this.overlay = new ShapeOverlays(this.overlays);
        listen(OVERLAY_TOGGLE, this.toggleOverlay);
        listen(OVERLAY_OPEN, this.openOverlay);
        listen(OVERLAY_CLOSE, this.closeOverlay);
        listen(OVERLAY_BLOCK, this.blockOverlay);
        // listen('scroll', this.handleScroll);

        setTimeout(() => {
            this.setState({ active: true });
        }, 1500);
    }

    componentWillUnmount() {
        unlisten(OVERLAY_TOGGLE, this.toggleOverlay);
        unlisten(OVERLAY_OPEN, this.openOverlay);
        unlisten(OVERLAY_CLOSE, this.closeOverlay);
        unlisten(OVERLAY_BLOCK, this.blockOverlay);
        // unlisten('scroll', this.handleScroll);
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
        const headerClass = this.state.active ? [styles['site-header'], styles['active']].join(' ') : styles['site-header'];
        return (
            <header className={headerClass}>

                <Link to="/" className={styles['home-link']}>
                    <i className={styles.logo} />
                </Link>
                <svg className={styles['shape-overlays']} viewBox="0 0 100 100" preserveAspectRatio="none" ref={o => { this.overlays = o; }}>
                    <path></path>
                    <path></path>
                </svg>

            </header>
        );
    }

}

export default Header;
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
    }

    componentWillUnmount() {
        unlisten(OVERLAY_TOGGLE, this.toggleOverlay);
        unlisten(OVERLAY_OPEN, this.openOverlay);
        unlisten(OVERLAY_CLOSE, this.closeOverlay);
        unlisten(OVERLAY_BLOCK, this.blockOverlay);
    }

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
            <div>
                <header className={styles['site-header']}>

                    <Link to="/" className={styles['home-link']}>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400.00001" height="12" width="12">
                            <path d="M 167.48331,5e-4 20.41,400 86.033198,400 197.5616,79.29619 l 4.68481,0 45.47287,130.1334 61.84552,0 L 232.52164,5e-4 Z m 15.71651,250.80764 -18.2678,52.31472 115.24345,0 L 313.76886,400 379.589,400 324.75579,250.8678 Z" fill="white" />
                        </svg>
                        rka Roy
                    </Link>
                    <svg className={styles['shape-overlays']} viewBox="0 0 100 100" preserveAspectRatio="none" ref={o => { this.overlays = o; }}>
                        <path></path>
                        <path></path>
                    </svg>

                </header>
                
            </div>
        );
    }

}

export default Header;
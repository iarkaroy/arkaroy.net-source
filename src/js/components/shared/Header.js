import React, { Component } from 'react';
import { Link } from '../../router';
import ShapeOverlays from '../../libs/shape-overlays';
import styles from '../../../sass/index.sass';
import { broadcast, listen, unlisten } from '../../libs/broadcast';
import { isPrerender } from '../../libs/isPrerender';


class Header extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loaded: false
        };
    }

    componentDidMount() {
        this.overlay = new ShapeOverlays(this.overlays);
        this.blockOverlay();
        listen('assetsloaded', this.assetsLoaded);
    }

    componentWillUnmount() {
        unlisten('assetsloaded', this.assetsLoaded);
    }

    assetsLoaded = () => {
        if(isPrerender()) {
            return false;
        }
        setTimeout(()=>{
            this.setState({ loaded: true });
        }, 1000);
        setTimeout(() => {
            this.closeOverlay();
        }, 1100);
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
        const { loaded } = this.state;
        return (
            <div>
                <header className={styles['site-header']}>

                    <Link to="/" className={styles['home-link']}>
                        {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400.00001" height="12" width="12">
                            <path d="M 167.48331,5e-4 20.41,400 86.033198,400 197.5616,79.29619 l 4.68481,0 45.47287,130.1334 61.84552,0 L 232.52164,5e-4 Z m 15.71651,250.80764 -18.2678,52.31472 115.24345,0 L 313.76886,400 379.589,400 324.75579,250.8678 Z" fill="white" />
        </svg>*/}
                        Arka Roy
                    </Link>
                    <Link to="/about" className={styles['about-link']}>About</Link>
                    <svg className={styles['shape-overlays']} viewBox="0 0 100 100" preserveAspectRatio="none" ref={o => { this.overlays = o; }}>
                        <path></path>
                    </svg>
                    <div className={styles['loading']} style={{ opacity: loaded ? 0 : 1 }}>
                        <span>l</span>
                        <span>o</span>
                        <span>a</span>
                        <span>d</span>
                        <span>i</span>
                        <span>n</span>
                        <span>g</span>
                    </div>

                </header>

            </div>
        );
    }

}

export default Header;
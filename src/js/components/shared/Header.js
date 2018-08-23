import React, { Component } from 'react';
import { Link } from '../../router';
import ShapeOverlays from '../../libs/shape-overlays';
import EventSystem from '../../libs/event-system';

class Header extends Component {

    componentDidMount() {
        this.overlay = new ShapeOverlays(this.overlays);
        EventSystem.subscribe('overlay:toggle', this.toggleOverlay);
        EventSystem.subscribe('overlay:open', this.openOverlay);
        EventSystem.subscribe('overlay:close', this.closeOverlay);
        EventSystem.subscribe('overlay:block', this.blockOverlay);
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
            <header className="header">
                <Link to="/"><strong>Arka Roy</strong></Link>
                <svg className="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none" ref={o => { this.overlays = o; }}>
                    <path className="shape-overlays__path"></path>
                    <path className="shape-overlays__path"></path>
                </svg>
            </header>
        );
    }

}

export default Header;
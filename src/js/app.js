import React, { Component } from 'react';

import { Header } from './components/shared';
import { Router, Outlet } from './router';

import { broadcast, listen, unlisten } from './libs/broadcast';
import { getDimension } from './libs/getDimension';

import routes from './router/routes';

class App extends Component {

    componentDidMount() {
        // Register event handlers
        window.addEventListener('scroll', this.handleEvent);
        window.addEventListener('resize', this.handleEvent);
        document.addEventListener('wheel', this.handleEvent);
        document.addEventListener('keydown', this.handleEvent);
        document.addEventListener('touchstart', this.handleEvent);
        document.addEventListener('touchmove', this.handleEvent);
        document.addEventListener('touchend', this.handleEvent);

        console.log('%cSite', 'color:white;background:black');
    }

    componentWillUnmount() {
        // Unregister event handlers
        window.removeEventListener('scroll', this.handleEvent);
        window.removeEventListener('resize', this.handleEvent);
        document.removeEventListener('wheel', this.handleEvent);
        document.removeEventListener('keydown', this.handleEvent);
        document.removeEventListener('touchstart', this.handleEvent);
        document.removeEventListener('touchmove', this.handleEvent);
        document.removeEventListener('touchend', this.handleEvent);
    }

    handleEvent = event => {
        var { type } = event;
        var data = event;
        if (type === 'resize') {
            data = getDimension();
        }
        broadcast(type, data);
    };

    render() {
        return (
            <Router>
                <Header />
                <Outlet routes={routes} />
            </Router>
        );
    }

}

export default App;
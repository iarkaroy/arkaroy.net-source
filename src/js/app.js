import React, { Component } from 'react';

import {Header} from './components/shared';
import { Router, Outlet } from './router';

import routes from './router/routes';

class App extends Component {

    componentDidMount() {
        console.log('%cSite', 'color:white;background:black');
    }

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
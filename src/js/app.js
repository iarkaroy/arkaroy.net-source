import React, { Component } from 'react';

import HeaderComponent from './components/shared/header.component';
import { Router, Outlet } from './router';

import routes from './router/routes';

class App extends Component {

    componentDidMount() {
        console.log('%cSite', 'color:white;background:black');
    }

    render() {
        return (
            <Router>
                <HeaderComponent />
                <Outlet routes={routes} />
            </Router>
        );
    }

}

export default App;
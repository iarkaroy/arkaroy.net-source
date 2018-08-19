import React, { Component } from 'react';

import HeaderComponent from './components/shared/header.component';
import HomePage from './pages/home.page';


class App extends Component {

    componentDidMount() {
        console.log('%cSite', 'color:white;background:black');
    }

    render() {
        return (
            <div>
                <HeaderComponent />
                <HomePage />
            </div>
        );
    }

}

export default App;
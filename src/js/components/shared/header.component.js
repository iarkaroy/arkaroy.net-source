import React, { Component } from 'react';
import { Link } from '../../router';

class HeaderComponent extends Component {

    render() {
        return (
            <header className="header">
                <Link to="/"><strong>Arka Roy</strong></Link>
            </header>
        );
    }

}

export default HeaderComponent;
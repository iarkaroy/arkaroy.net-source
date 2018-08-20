import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Link extends Component {

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    handleClick = (event) => {
        event.preventDefault();
        
        const { to, replace } = this.props;
        const { router } = this.context;
        const { history } = router;

        if(history.location.pathname === to) {
            return false;
        }
        
        if (replace) {
            history.replace(to);
        } else {
            history.push(to);
        }
    };

    render() {
        const { to, children } = this.props;
        return (
            <a href={to} onClick={this.handleClick}>
                {children}
            </a>
        );
    }
}

export default Link;
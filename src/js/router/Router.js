import React, {Component} from 'react';
import { createBrowserHistory as createHistory } from 'history';
import PropTypes from 'prop-types';

class Router extends Component {

    history = createHistory();

    static childContextTypes = {
        router: PropTypes.object.isRequired
    }

    getChildContext() {
        return {
            router: {
                history: this.history
            }
        }
    }

    render() {
        return (
            <div>{this.props.children}</div>
        );
    }

}

export default Router;
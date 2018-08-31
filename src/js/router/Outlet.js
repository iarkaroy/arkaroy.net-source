import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {matchPath} from './matchPath';

class Outlet extends Component {

    static propTypes = {
        routes: PropTypes.arrayOf(PropTypes.shape({
            path: PropTypes.string.isRequired,
            component: PropTypes.func.isRequired,
            exact: PropTypes.bool
        })).isRequired
    };

    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    componentWillMount() {
        const { router } = this.context;
        const { history } = router;
        this.history = history;
        this.unlisten = this.history.listen((location, action) => {
            if (this.child && this.child.componentWillLeave) {
                this.child.componentWillLeave(() => {
                    this.forceUpdate();
                });
            } else {
                this.forceUpdate();
            }
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        var MatchedComponent = null;
        var params = {};
        const { routes } = this.props;
        const len = routes.length;
        for (let i = 0; i < len; ++i) {
            const route = routes[i];
            const { path, exact = false, component } = route;
            const match = matchPath(this.history.location.pathname, { path, exact });

            if (match) {
                MatchedComponent = component;
                params = match.params;
                break;
            }
        }

        if (MatchedComponent) {
            return (
                <MatchedComponent ref={instance => { this.child = instance; }} params={params} />
            )
        }

        return null;
    }

}

export default Outlet;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { matchRoutes } from './matchRoutes';
import ReactGA from 'react-ga';

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

    componentDidMount() {
        ReactGA.initialize('UA-61692534-1');
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    componentWillMount() {
        const { router } = this.context;
        const { history } = router;
        this.history = history;
        this.unlisten = this.history.listen((location, action) => {
            ReactGA.set({ page: location.pathname });
            ReactGA.pageview(location.pathname);
            if (this.child && this.child.componentWillLeave) {
                const match = matchRoutes(location.pathname, this.props.routes);
                this.child.componentWillLeave(() => {
                    this.forceUpdate();
                }, match.component ? match.component.name : null, location);
            } else {
                this.forceUpdate();
            }
        });
    }

    componentWillUnmount() {
        this.unlisten();
    }

    render() {
        const match = matchRoutes(this.history.location.pathname, this.props.routes);

        if (match.component) {
            return (
                <match.component ref={instance => { this.child = instance; }} params={match.params} />
            )
        }

        return null;
    }

}

export default Outlet;
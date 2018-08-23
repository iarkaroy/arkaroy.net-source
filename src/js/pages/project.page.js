import React, { Component } from 'react';
import EventSystem from '../libs/event-system';

class ProjectPage extends Component {

    componentDidMount() {
        EventSystem.publish('overlay:block');
        if (navigator.userAgent !== 'ReactSnap') {
            setTimeout(() => {
                EventSystem.publish('overlay:close');
            }, 200);
        }
    }

    render() {
        return (
            <h1>Project {this.props.params.id}</h1>
        );
    }

}

export default ProjectPage;
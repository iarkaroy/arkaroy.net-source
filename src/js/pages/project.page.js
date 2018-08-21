import React, {Component} from 'react';
import EventSystem from '../libs/event-system';

class ProjectPage extends Component {

    componentDidMount() {
        EventSystem.publish('overlay:close');
        console.log(11);
    }

    render() {
        return (
            <h1>Project {this.props.params.id}</h1>
        );
    }

}

export default ProjectPage;
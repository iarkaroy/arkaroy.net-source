import React, {Component} from 'react';

class ProjectPage extends Component {

    render() {
        return (
            <h1>Project {this.props.params.id}</h1>
        );
    }

}

export default ProjectPage;
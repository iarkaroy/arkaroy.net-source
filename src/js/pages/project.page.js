import React, { Component } from 'react';
import EventSystem from '../libs/event-system';
import { isPrerender } from '../libs/isPrerender';
import * as store from '../store';

class ProjectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: null
        };
    }

    componentDidMount() {
        EventSystem.publish('overlay:block');
        if (!isPrerender()) {
            setTimeout(() => {
                EventSystem.publish('overlay:close');
            }, 200);
        }
        const slug = this.props.params.id
        this.setState({
            project: store.project(slug)
        });
        document.body.classList.add('project');
    }

    componentWillUnmount() {
        document.body.classList.remove('project');
    }

    componentWillLeave(callback) {
        EventSystem.publish('overlay:open');
        setTimeout(callback, 850);
    }

    render() {
        const { project } = this.state;
        if (!project) {
            return null;
        }
        console.log(project);
        const { data } = project;
        const thumb = `/images/${data.thumb}`;
        return (
            <main className="project-single">
                <div className="background" style={{ backgroundImage: `url('${thumb}')` }}></div>
                <div className="header">
                    <div className="content">
                        <h1>{data.title}</h1>
                        <h4>{data.overview}</h4>
                    </div>
                </div>
                <div className="body" dangerouslySetInnerHTML={{ __html: project.html }}></div>
                <div className="body" dangerouslySetInnerHTML={{ __html: project.html }}></div>
                <div className="body" dangerouslySetInnerHTML={{ __html: project.html }}></div>
            </main>
        );
    }

}

export default ProjectPage;
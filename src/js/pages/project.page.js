import React, { Component } from 'react';
import EventSystem from '../libs/event-system';
import { isPrerender } from '../libs/isPrerender';
import * as store from '../store';

class ProjectPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            project: null,
            next: null,
            prev: null,
            width: 0,
            height: 0
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
            project: store.project(slug),
            next: store.next(slug),
            prev: store.prev(slug)
        });
        window.addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentWillLeave(callback) {
        EventSystem.publish('overlay:open');
        setTimeout(callback, 850);
    }

    handleResize = event => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }

    render() {
        const { project, width, height } = this.state;
        if (!project) {
            return null;
        }
        
        const { data } = project;
        const thumb = `/images/${data.thumb}`;
        return (
            <main className="project-single">
                <div className="background" style={{ backgroundImage: `url('${thumb}')`, height: height }}></div>
                <div className="header" style={{ height: height }}>
                    <div className="content">
                        <h1>{data.title}</h1>
                        {data.overview && <h4>{data.overview}</h4>}
                    </div>
                </div>
                <div className="body">
                    {data.summary && <div className="summary">{data.summary}</div>}
                    <div className="content" dangerouslySetInnerHTML={{ __html: project.html }}></div>
                </div>
                
            </main>
        );
    }

}

export default ProjectPage;
import React, { Component } from 'react';

class ProjectPreviewComponent extends Component {

    render() {
        const { title, slug, category, image, front = false, selected = false } = this.props;
        const classes = selected ? 'project-home' : 'project-home invisible';
        const imageSrc = `/images/${image}`;
        if (front) {
            return (
                <div className={classes}>
                    <img className="hidden" src={imageSrc} />
                    <h2>{category}</h2>
                    <h1 className="front">{title}</h1>
                </div>
            );
        }
        return (
            <div className={classes}>
                <a href={`/projects/${slug}`}>
                    <img className="hidden" src={imageSrc} />
                    <h2>{category}</h2>
                    <h1>{title}</h1>
                </a>
            </div>
        );
    }

}

export default ProjectPreviewComponent;
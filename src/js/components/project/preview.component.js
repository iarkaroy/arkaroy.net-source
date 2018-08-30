import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../router';
import styles from '../../../scss/index.scss';

const classNames = {
    wrapper: 'project-card--wrapper',
    link: 'project-card--link',
    title: 'project-card--title',
    frontTitle: 'project-card--front-title',
    subtitle: 'project-card--subtitle',
};

class ProjectPreviewComponent extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        front: PropTypes.bool,
        selected: PropTypes.bool
    };

    render() {
        const { title, slug, category, image, front = false, selected = false } = this.props;
        const classes = selected ? styles[classNames.wrapper] : [styles[classNames.wrapper], styles.invisible].join(' ');
        const imageSrc = `/images/${image}`;
        if (front) {
            return (
                <div className={classes}>
                    <img className={styles.hidden} src={imageSrc} />
                    <h2 className={styles[classNames.subtitle]}>{category}</h2>
                    <h1 className={[styles[classNames.title], styles[classNames.frontTitle]].join(' ')}>{title}</h1>
                </div>
            );
        }
        return (
            <div className={classes}>
                <Link to={`/projects/${slug}`} className={styles[classNames.link]}>
                    <img className={styles.hidden} src={imageSrc} />
                    <h2 className={styles[classNames.subtitle]}>{category}</h2>
                    <h1 className={styles[classNames.title]}>{title}</h1>
                </Link>
            </div>
        );
    }

}

export default ProjectPreviewComponent;
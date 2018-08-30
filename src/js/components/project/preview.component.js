import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../router';
import styles from '../../../scss/index.scss';

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
        const classes = selected ? styles.projectCard : [styles.projectCard, styles.invisible].join(' ');
        const imageSrc = `/images/${image}`;
        if (front) {
            return (
                <div className={classes}>
                    <img className={styles.hidden} src={imageSrc} />
                    <h2>{category}</h2>
                    <h1 className={styles.front}>{title}</h1>
                </div>
            );
        }
        return (
            <div className={classes}>
                <Link to={`/projects/${slug}`}>
                    <img className={styles.hidden} src={imageSrc} />
                    <h2>{category}</h2>
                    <h1>{title}</h1>
                </Link>
            </div>
        );
    }

}

export default ProjectPreviewComponent;
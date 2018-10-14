import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../router';
import styles from '../../../scss/index.scss';
import RevealText from '../RevealText';
import Title from '../Title';

class ProjectCard extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
    };

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { title, slug, category, image, index, width, height, scrollTop } = this.props;
        const offset = 0;// height * 2 * (index + 1) + scrollTop;
        const imageSrc = `/images/${image}`;
        const titleParts = title.split(' ');
        return (
            <div className={styles['project-wrapper']}>
                <Link
                    to={`/projects/${slug}`}
                    className={styles['project-card']}
                    style={{
                        backgroundImage: `url(${imageSrc})`,
                    }}
                >
                    <div className={styles['project-info']}>
                        {titleParts.map((t, i) => {
                            return (
                                <div className={styles['project-title-part']}>
                                    <h2 style={{ clipPath: `url(#slicebot)` }}>{t}</h2>
                                    <h2 style={{ clipPath: `url(#slicetop)`, position: `absolute`, top: 0, left: 5 }}>{t}</h2>
                                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
                                        <defs>
                                            <clipPath id="slicetop" clipPathUnits="objectBoundingBox" transform="scale(0.01, 0.01)">
                                                <polygon points="0 0 100 0 100 80 0 40 0 0" />
                                            </clipPath>
                                            <clipPath id="slicebot" clipPathUnits="objectBoundingBox" transform="scale(0.01, 0.01)">
                                                <polygon points="0 40 100 80 100 100 0 100 0 40" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            );
                        })}
                    </div>
                </Link>
            </div>
        );
    }

}

export default ProjectCard;
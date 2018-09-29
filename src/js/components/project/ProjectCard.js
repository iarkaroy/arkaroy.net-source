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
        selected: PropTypes.bool,
        rotateX: PropTypes.number,
        rotateY: PropTypes.number
    };

    static defaultProps = {
        selected: false,
        rotateX: 0,
        rotateY: 0
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            selected: false
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selected !== this.props.selected) {
            const { selected } = this.props;
            if (selected) {
                setTimeout(() => {
                    this.setState({ selected });
                }, 1000);
            } else {
                this.setState({ selected });
            }
        }
    }

    render() {
        const { title, slug, category, image, index, rotateX, rotateY } = this.props;
        const { selected } = this.state;
        const imageSrc = `/images/${image}`;
        const thumbClasses = [styles['project-thumb'], styles['reveal']];
        if (selected) {
            thumbClasses.push(styles['active']);
        }
        const titleParts = title.trim().split(' ');
        var currIndex = index + 1;
        currIndex = currIndex < 10 ? `0${currIndex}` : currIndex;
        return (
            <div className={styles['project-card']} style={{ transform: `translate(-50%, -50%) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)` }}>
                <Link to={`/projects/${slug}`}>
                    <div className={thumbClasses.join(' ')} style={{ backgroundImage: `url(${imageSrc})`, display: 'block' }}></div>
                    <Title title={`${currIndex}|${titleParts.join('|')}|${category}`} split={false} reveal={selected} className={styles['project-title']} />
                </Link>
            </div>
        );
    }

}

export default ProjectCard;
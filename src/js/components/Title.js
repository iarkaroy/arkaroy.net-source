import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from '../../scss/index.scss';
import RevealText from './RevealText';

class Title extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        h1: PropTypes.bool,
        split: PropTypes.bool,
        reveal: PropTypes.bool
    };

    static defaultProps = {
        h1: false,
        split: true,
        reveal: false
    };

    render() {
        const { title, h1, split, reveal, ...props } = this.props;
        const parts = split ? title.trim().split(' ') : title.trim().split('|');
        return (
            <div {...props}>
                {parts.map((part, index) => {
                    return h1 && !index
                        ? <RevealText text={part} h1={true} order={index} reveal={reveal} key={index} />
                        : <RevealText text={part} h1={false} order={index} reveal={reveal} key={index} />;
                })}
            </div>
        );
    }

}

export default Title;
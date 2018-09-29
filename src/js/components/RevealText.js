import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from '../../scss/index.scss';

class RevealText extends Component {

    static propTypes = {
        text: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        h1: PropTypes.bool,
        reveal: PropTypes.bool
    };

    static defaultProps = {
        h1: false,
        reveal: false
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            reveal: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.reveal !== prevProps.reveal) {
            setTimeout(()=>{
                this.setState({
                    reveal: this.props.reveal
                });
            }, this.props.order * 200);
        }
    }

    render() {
        const { text, h1, order, ...props } = this.props;
        const classes = this.state.reveal ? [styles['reveal'], styles['active']].join(' ') : styles['reveal'];
        if(h1) {
            return <h1><span className={classes}>{text}</span></h1>;
        } else {
            return <h2><span className={classes}>{text}</span></h2>
        }
    }

}

export default RevealText;
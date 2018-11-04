import React, { Component } from 'react';
import styles from '../../sass/index.sass';

class Skill extends Component {

    static defaultProps = {
        strength: 80
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            strength: 0
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                strength: this.props.strength
            });
        }, 2000);
    }

    render() {
        const { strength } = this.state;
        return (
            <div className={styles['skill']}>
                {this.props.children}
                <div className={styles['bar']}>
                    <div className={styles['bar-fill']} style={{ width: `${strength}%` }}></div>
                </div>
            </div>
        );
    }

}

export default Skill;
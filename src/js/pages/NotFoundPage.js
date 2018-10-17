import React, { Component } from 'react';
import styles from '../../scss/index.scss';

class NotFoundPage extends Component {

    render() {
        return (
            <main className={styles['main']}>
                <div className={styles['not-found']}>
                    <div>
                        <h1>404</h1>
                        <h2>Page Not Found.</h2>
                    </div>
                </div>
            </main>
        );
    }

}

export default NotFoundPage;
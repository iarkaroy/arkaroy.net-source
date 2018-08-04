import React from 'react';
import { render } from 'react-dom';

import './scss/index.scss';

const App = () => {
    return (
        <div>
            <h3>Our Application Is Alive</h3>
            <p>This isn’t reality. This — is fantasy.</p>
            <p>Yes I am quoting Star Trek I cant help it.</p>
        </div>
    );
}

render(<App />, document.getElementById('app'));

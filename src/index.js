import React from 'react';
import { render, hydrate } from 'react-dom';
import "regenerator-runtime/runtime";

import App from './js/app';

const root = document.getElementById('app');
render(<App />, root);

/*
if (root.hasChildNodes()) {
    hydrate(<App />, root);
} else {
    render(<App />, root);
}
*/
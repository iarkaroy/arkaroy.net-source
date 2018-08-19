import React from 'react';
import { render, hydrate } from 'react-dom';
import "regenerator-runtime/runtime";

import './scss/index.scss';

import App from './js/app';

const root = document.getElementById('app');

if (root.hasChildNodes()) {
    hydrate(<App />, root);
} else {
    render(<App />, root);
}
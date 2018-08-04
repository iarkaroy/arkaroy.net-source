import React from 'react';
import { render } from 'react-dom';
import "regenerator-runtime/runtime";

import './scss/index.scss';

import App from './js/app';

render(<App />, document.getElementById('app'));

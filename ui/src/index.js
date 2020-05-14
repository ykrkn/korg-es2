import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import { App } from './components';
import service from './service';

ReactDOM.render(<App service={service} />, document.getElementById('root'));

// 724x640

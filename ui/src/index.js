import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import App from './components';

import unregister from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
unregister();

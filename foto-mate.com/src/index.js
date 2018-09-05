import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Checkin from './components/checkin';



ReactDOM.render(<Checkin />, document.getElementById('App'));
registerServiceWorker();

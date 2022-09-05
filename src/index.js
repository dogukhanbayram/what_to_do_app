import React from 'react';
import './style/index.css';
import App from './components/App';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <Router>
    <App/>
  </Router>
);
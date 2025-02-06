// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Router 추가
import './Styles/index.css';
import App from './App';
import Header from './Components/Header';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <Router>
      <App />
    </Router>
  //</React.StrictMode>
);

reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Self-hosted Kanit, imported before index.css so the @font-face rules are
// emitted ahead of the utilities that reference them.
import './assets/fonts.css';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found in index.html');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

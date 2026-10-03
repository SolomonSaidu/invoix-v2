import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';

// Register service worker for offline functionality and PWA installation
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Invoix: New content available, updating in background.');
  },
  onOfflineReady() {
    console.log('Invoix: App is ready to work offline.');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

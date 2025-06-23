import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Reset } from 'styled-reset';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Reset />
    <App />
  </StrictMode>
)

import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
  (window as unknown as { Buffer: typeof Buffer }).Buffer = (window as unknown as { Buffer: typeof Buffer }).Buffer || Buffer;
  if (typeof (window as unknown as { global: unknown }).global === 'undefined') {
    (window as unknown as { global: unknown }).global = window;
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import '@rainbow-me/rainbowkit/styles.css';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


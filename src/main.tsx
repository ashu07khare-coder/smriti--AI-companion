// Ensure window.fetch and prototype have both getter and setter to prevent "Cannot set property fetch of #<Window> which has only a getter"
try {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (e) => {
      if (e && e.message && typeof e.message === 'string' && e.message.indexOf('fetch') !== -1 && e.message.indexOf('getter') !== -1) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return true;
      }
    }, true);

    const prevOnError = window.onerror;
    window.onerror = function(msg) {
      if (typeof msg === 'string' && msg.indexOf('fetch') !== -1 && msg.indexOf('getter') !== -1) {
        return true;
      }
      if (typeof prevOnError === 'function') {
        return prevOnError.apply(this, arguments as any);
      }
    };

    const realFetch = window.fetch;
    let activeFetch = typeof realFetch === 'function' ? realFetch.bind(window) : realFetch;
    const descriptor = {
      get() {
        return activeFetch;
      },
      set(fn: any) {
        activeFetch = fn;
      },
      configurable: true,
      enumerable: true,
    };

    let curr: any = window;
    while (curr) {
      try {
        const d = Object.getOwnPropertyDescriptor(curr, 'fetch');
        if (d) {
          if (d.configurable) {
            try {
              delete curr.fetch;
            } catch (_) {}
          }
          try {
            Object.defineProperty(curr, 'fetch', descriptor);
          } catch (_) {}
        }
      } catch (_) {}
      try {
        curr = Object.getPrototypeOf(curr);
      } catch (_) {
        curr = null;
      }
    }

    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', descriptor);
      } catch (_) {}
    }

    try {
      Object.defineProperty(window, 'fetch', descriptor);
    } catch (_) {}
  }
} catch (_) {}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Global error handler for third-party DOM manipulation errors
const suppressThirdPartyDOMErrors = () => {
  // More comprehensive promise rejection handling
  window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = event.reason?.message || event.reason?.toString() || '';
    if (errorMessage.includes('setStartBefore') ||
        errorMessage.includes('InvalidNodeTypeError') ||
        errorMessage.includes('getCriticalClusters') ||
        errorMessage.includes('getIsPageReadable') ||
        errorMessage.includes('the given Node has no parent')) {
      console.warn('🔇 Suppressed third-party DOM error:', errorMessage);
      event.preventDefault();
      return true;
    }
  });

  // Enhanced error suppression
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || event.error?.message || '';
    if (errorMessage.includes('setStartBefore') ||
        errorMessage.includes('InvalidNodeTypeError') ||
        errorMessage.includes('getCriticalClusters') ||
        errorMessage.includes('getIsPageReadable') ||
        errorMessage.includes('the given Node has no parent')) {
      console.warn('🔇 Suppressed third-party DOM error:', errorMessage);
      event.preventDefault();
      return true;
    }
  });

  // Override Range methods with comprehensive protection
  const originalSetStartBefore = Range.prototype.setStartBefore;
  const originalSetStartAfter = Range.prototype.setStartAfter;
  const originalSetEndBefore = Range.prototype.setEndBefore;
  const originalSetEndAfter = Range.prototype.setEndAfter;

  Range.prototype.setStartBefore = function(node) {
    try {
      if (!node || !node.parentNode || !document.contains(node)) {
        console.warn('🛡️ Blocked setStartBefore on detached/invalid node');
        return;
      }
      return originalSetStartBefore.call(this, node);
    } catch (error) {
      console.warn('🛡️ Range.setStartBefore error suppressed:', error.message);
      return;
    }
  };

  Range.prototype.setStartAfter = function(node) {
    try {
      if (!node || !node.parentNode || !document.contains(node)) {
        console.warn('🛡️ Blocked setStartAfter on detached/invalid node');
        return;
      }
      return originalSetStartAfter.call(this, node);
    } catch (error) {
      console.warn('🛡️ Range.setStartAfter error suppressed:', error.message);
      return;
    }
  };

  Range.prototype.setEndBefore = function(node) {
    try {
      if (!node || !node.parentNode || !document.contains(node)) {
        console.warn('🛡️ Blocked setEndBefore on detached/invalid node');
        return;
      }
      return originalSetEndBefore.call(this, node);
    } catch (error) {
      console.warn('🛡️ Range.setEndBefore error suppressed:', error.message);
      return;
    }
  };

  Range.prototype.setEndAfter = function(node) {
    try {
      if (!node || !node.parentNode || !document.contains(node)) {
        console.warn('🛡️ Blocked setEndAfter on detached/invalid node');
        return;
      }
      return originalSetEndAfter.call(this, node);
    } catch (error) {
      console.warn('🛡️ Range.setEndAfter error suppressed:', error.message);
      return;
    }
  };

  // Override console.error to catch and suppress specific errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('setStartBefore') ||
        message.includes('InvalidNodeTypeError') ||
        message.includes('getCriticalClusters') ||
        message.includes('the given Node has no parent')) {
      console.warn('🔇 Console error suppressed:', message);
      return;
    }
    return originalConsoleError.apply(console, args);
  };

  console.log('🛡️ DOM Range protection active - third-party errors will be suppressed');
};

// Initialize error suppression
suppressThirdPartyDOMErrors();

// Remove loading screen
const loadingElement = document.getElementById('loading');
if (loadingElement) {
  loadingElement.remove();
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
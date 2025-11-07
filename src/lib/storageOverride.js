// Global storage access prevention and error handling
// This file must be loaded before any other scripts

(function() {
  'use strict';

  // Memory-based storage fallback
  const memoryStorage = new Map();

  // Safe storage proxy that never throws errors
  const createSafeStorageProxy = (storageName) => {
    return new Proxy({}, {
      get(target, prop) {
        if (prop === 'length') {
          return memoryStorage.size;
        }
        
        if (prop === 'getItem') {
          return (key) => {
            try {
              if (typeof window !== 'undefined' && window[storageName]) {
                return window[storageName].getItem(key);
              }
            } catch (e) {
              // Silent fallback to memory
            }
            return memoryStorage.get(key) || null;
          };
        }
        
        if (prop === 'setItem') {
          return (key, value) => {
            try {
              if (typeof window !== 'undefined' && window[storageName]) {
                window[storageName].setItem(key, value);
                return;
              }
            } catch (e) {
              // Silent fallback to memory
            }
            memoryStorage.set(key, value);
          };
        }
        
        if (prop === 'removeItem') {
          return (key) => {
            try {
              if (typeof window !== 'undefined' && window[storageName]) {
                window[storageName].removeItem(key);
              }
            } catch (e) {
              // Silent fallback
            }
            memoryStorage.delete(key);
          };
        }
        
        if (prop === 'clear') {
          return () => {
            try {
              if (typeof window !== 'undefined' && window[storageName]) {
                window[storageName].clear();
              }
            } catch (e) {
              // Silent fallback
            }
            memoryStorage.clear();
          };
        }
        
        if (prop === 'key') {
          return (index) => {
            try {
              if (typeof window !== 'undefined' && window[storageName]) {
                return window[storageName].key(index);
              }
            } catch (e) {
              // Silent fallback
            }
            return Array.from(memoryStorage.keys())[index] || null;
          };
        }
        
        // For any other property access
        return undefined;
      },
      
      set(target, prop, value) {
        // Prevent any direct property setting
        return true;
      }
    });
  };

  // Override global storage objects if they cause issues
  if (typeof window !== 'undefined') {
    try {
      // Test if storage works
      window.localStorage.setItem('__test__', '1');
      window.localStorage.removeItem('__test__');
    } catch (e) {
      // Replace with safe proxy
      Object.defineProperty(window, 'localStorage', {
        get: () => createSafeStorageProxy('localStorage'),
        configurable: true
      });
    }

    try {
      // Test if storage works
      window.sessionStorage.setItem('__test__', '1');
      window.sessionStorage.removeItem('__test__');
    } catch (e) {
      // Replace with safe proxy
      Object.defineProperty(window, 'sessionStorage', {
        get: () => createSafeStorageProxy('sessionStorage'),
        configurable: true
      });
    }
  }

  // Global error handler for any remaining storage errors
  const originalErrorHandler = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    // Suppress storage-related errors completely
    if (message && typeof message === 'string') {
      const storageErrors = [
        'access to storage',
        'storage is not allowed',
        'localstorage',
        'sessionstorage',
        'quota exceeded',
        'storage quota',
        'storage access'
      ];
      
      if (storageErrors.some(errorText => 
        message.toLowerCase().includes(errorText.toLowerCase())
      )) {
        // Completely suppress storage errors
        return true;
      }
    }
    
    // Call original handler for other errors
    if (originalErrorHandler) {
      return originalErrorHandler.call(this, message, source, lineno, colno, error);
    }
    
    return false;
  };

  // Override console methods to catch and filter storage errors
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  
  console.error = function(...args) {
    const message = args.join(' ').toLowerCase();
    if (message.includes('storage') && (
      message.includes('not allowed') || 
      message.includes('access') ||
      message.includes('quota')
    )) {
      // Silently ignore storage errors
      return;
    }
    originalConsoleError.apply(console, args);
  };
  
  console.warn = function(...args) {
    const message = args.join(' ').toLowerCase();
    if (message.includes('storage') && (
      message.includes('not allowed') || 
      message.includes('access') ||
      message.includes('quota')
    )) {
      // Silently ignore storage warnings
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Handle unhandled promise rejections for storage
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message) {
      const message = event.reason.message.toLowerCase();
      if (message.includes('storage') && message.includes('not allowed')) {
        event.preventDefault(); // Prevent the error from showing
        return;
      }
    }
  });

})();
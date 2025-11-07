import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Request storage access early if in iframe context
const requestStorageAccess = async () => {
  if (typeof document !== 'undefined' && 'requestStorageAccess' in document) {
    try {
      await (document as any).requestStorageAccess();
    } catch (error) {
      // Silent failure - storage access not granted or not needed
    }
  }
};

// Initialize storage access request
requestStorageAccess();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
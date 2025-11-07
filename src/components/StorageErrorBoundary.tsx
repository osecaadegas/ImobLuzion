import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class StorageErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if it's a storage-related error
    if (error.message.includes('storage') || 
        error.message.includes('localStorage') || 
        error.message.includes('sessionStorage') ||
        error.message.includes('Access to storage is not allowed')) {
      console.warn('Storage error caught by boundary:', error);
      return { hasError: true, error };
    }
    
    // If it's not a storage error, let it bubble up
    throw error;
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Storage error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI for storage errors
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Storage Restriction Detected
              </h2>
              <p className="text-gray-600 mb-4">
                Your browser is blocking storage access. This typically happens in private/incognito mode or restricted iframe contexts.
              </p>
              <div className="space-y-2 text-sm text-gray-500 text-left">
                <p>• Try using a regular browser window (not incognito)</p>
                <p>• Check if browser extensions are blocking storage</p>
                <p>• The app will work with limited functionality</p>
              </div>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
import React, { useEffect } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Scene Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(255, 0, 0, 0.9)',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '80%',
          zIndex: 9999
        }}>
          <h2>⚠️ 3D Scene Error</h2>
          <p>{this.state.error?.message}</p>
          <pre style={{ 
            fontSize: '12px', 
            overflow: 'auto', 
            maxHeight: '200px',
            background: 'rgba(0,0,0,0.3)',
            padding: '10px',
            borderRadius: '5px'
          }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: 'white',
              color: 'black',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook to detect console errors
export const useErrorLogger = () => {
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      console.warn('🔴 Console Error Detected:', ...args);
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);
};

export default ErrorBoundary;
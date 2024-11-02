import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-burgundy mb-4">Oops, something went wrong</h1>
            <p className="text-gray-600 mb-8">We apologize for the inconvenience. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-burgundy text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
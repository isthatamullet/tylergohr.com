/**
 * Error Boundary for React Three Fiber Components
 * 
 * Purpose: Catch and handle errors in 3D components gracefully,
 * ensuring that WebGL errors don't crash the entire page.
 * 
 * Part of Phase 2.2 progressive enhancement strategy.
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Fallback component displayed when 3D scene errors occur
 */
function DefaultErrorFallback() {
  return (
    <div style={{
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#1a1a1a',
      border: '1px solid #ef4444',
      borderRadius: '8px',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#ef4444', margin: '0 0 8px 0' }}>
        3D Content Unavailable
      </h3>
      <p style={{ margin: '4px 0' }}>
        Unable to render 3D scene
      </p>
      <p style={{ margin: '4px 0', color: '#888', fontSize: '12px' }}>
        Your device may not support WebGL or hardware acceleration
      </p>
    </div>
  );
}

/**
 * React Error Boundary specifically designed for Three.js/React Three Fiber
 */
export class SceneErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging purposes
    console.error('SceneErrorBoundary caught an error:', error, errorInfo);
    
    // You could also log this to an error reporting service
    // errorReportingService.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || <DefaultErrorFallback />;
    }

    return this.props.children;
  }
}

/**
 * Hook to reset error boundary state (useful for retry mechanisms)
 */
export function useErrorBoundaryReset() {
  return React.useCallback(() => {
    // Force a re-render by updating a state value
    window.location.reload();
  }, []);
}

/**
 * Higher-order component to wrap any component with scene error boundary
 */
export function withSceneErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: T) => (
    <SceneErrorBoundary fallback={fallback}>
      <Component {...props} />
    </SceneErrorBoundary>
  );

  WrappedComponent.displayName = `withSceneErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default SceneErrorBoundary;
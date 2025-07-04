'use client';

import { useWebGL } from '../../hooks/useWebGL';
import { ReactNode } from 'react';

interface WebGLDetectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  onCapabilitiesDetected?: (capabilities: ReturnType<typeof useWebGL>) => void;
}

export const WebGLDetection = ({ 
  children, 
  fallback, 
  onCapabilitiesDetected 
}: WebGLDetectionProps) => {
  const capabilities = useWebGL();

  // Notify parent component of capabilities
  if (onCapabilitiesDetected) {
    onCapabilitiesDetected(capabilities);
  }

  // Development mode: log capabilities
  if (process.env.NODE_ENV === 'development') {
    console.log('WebGL Capabilities:', capabilities);
  }

  return (
    <>
      {capabilities.supported ? children : fallback}
    </>
  );
};

// Component to display WebGL status (for debugging)
export const WebGLStatus = () => {
  const capabilities = useWebGL();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 10,
      right: 10,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace',
    }}>
      <div>WebGL: {capabilities.supported ? '✓' : '✗'}</div>
      <div>Performance: {capabilities.performance}</div>
      <div>Mobile: {capabilities.mobile ? '✓' : '✗'}</div>
      <div>Max Texture: {capabilities.maxTextureSize}</div>
    </div>
  );
};
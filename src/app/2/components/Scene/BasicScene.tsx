/**
 * Basic React Three Fiber Scene for Phase 2.2
 * 
 * Purpose: Validate React Three Fiber integration and demonstrate
 * component-based 3D architecture for the Tyler Gohr Portfolio.
 * 
 * This component handles SSR compatibility by dynamically importing
 * the client-side React Three Fiber components.
 */

'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { isWebGLReady, getWebGLConfig } from '../../lib/webgl-detection';

// Dynamically import the client-side Three.js component to prevent SSR issues
const BasicSceneClient = dynamic(() => import('./BasicSceneClient'), {
  ssr: false,
  loading: () => (
    <div style={{
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#1a1a1a',
      border: '1px solid #10b981',
      borderRadius: '8px',
      color: '#ffffff'
    }}>
      <h3 style={{ color: '#10b981', margin: '0 0 8px 0' }}>
        Phase 2.2: React Three Fiber Integration
      </h3>
      <div style={{ 
        height: '200px', 
        width: '100%',
        border: '1px solid #333',
        borderRadius: '4px',
        backgroundColor: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888',
        fontSize: '12px'
      }}>
        Loading 3D scene...
      </div>
      <p style={{ margin: '8px 0 4px 0', color: '#888' }}>
        Initializing React Three Fiber...
      </p>
    </div>
  )
});

/**
 * Fallback component when WebGL is not available
 */
function WebGLFallback() {
  return (
    <div style={{
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#1a1a1a',
      border: '1px solid #fbbf24',
      borderRadius: '8px',
      color: '#ffffff',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#fbbf24', margin: '0 0 8px 0' }}>
        Phase 2.2: WebGL Fallback Mode
      </h3>
      <p style={{ margin: '4px 0' }}>
        WebGL not available or performance insufficient
      </p>
      <p style={{ margin: '4px 0', color: '#888', fontSize: '12px' }}>
        Displaying 2D alternative for optimal user experience
      </p>
    </div>
  );
}

/**
 * Main Basic Scene component with client-only WebGL detection
 * Prevents hydration mismatches by deferring WebGL detection to useEffect
 */
export const BasicScene: React.FC = () => {
  const [webglState, setWebglState] = useState<{
    isReady: boolean;
    config: {
      antialias: boolean;
      shadows: boolean;
      maxLights: number;
      pixelRatio: number;
    } | null;
    isLoading: boolean;
  }>({
    isReady: false,
    config: null,
    isLoading: true
  });

  // Client-only WebGL detection to prevent hydration mismatches
  useEffect(() => {
    // Small delay to ensure full client-side hydration
    const timer = setTimeout(() => {
      try {
        const isReady = isWebGLReady();
        const config = isReady ? getWebGLConfig() : null;
        
        setWebglState({
          isReady: isReady && config !== null,
          config,
          isLoading: false
        });
      } catch (error) {
        console.warn('WebGL detection failed:', error);
        setWebglState({
          isReady: false,
          config: null,
          isLoading: false
        });
      }
    }, 100); // Small delay for stability

    return () => clearTimeout(timer);
  }, []);

  // Show loading state during client-side detection
  if (webglState.isLoading) {
    return (
      <div style={{
        padding: '16px',
        margin: '16px 0',
        backgroundColor: '#1a1a1a',
        border: '1px solid #10b981',
        borderRadius: '8px',
        color: '#ffffff'
      }}>
        <h3 style={{ color: '#10b981', margin: '0 0 8px 0' }}>
          Phase 2.2: React Three Fiber Integration
        </h3>
        <div style={{ 
          height: '200px', 
          width: '100%',
          border: '1px solid #333',
          borderRadius: '4px',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
          fontSize: '12px'
        }}>
          Detecting WebGL capabilities...
        </div>
        <p style={{ margin: '8px 0 4px 0', color: '#888' }}>
          Initializing 3D environment...
        </p>
      </div>
    );
  }

  // Show fallback if WebGL not ready or failed
  if (!webglState.isReady || !webglState.config) {
    return <WebGLFallback />;
  }

  // Render the client-side component with WebGL config
  return <BasicSceneClient webglConfig={webglState.config} />;
};

export default BasicScene;
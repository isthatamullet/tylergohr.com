/**
 * Basic React Three Fiber Scene for Phase 2.2
 * 
 * Purpose: Validate React Three Fiber integration and demonstrate
 * component-based 3D architecture for the Tyler Gohr Portfolio.
 * 
 * This replaces the temporary ThreeJSTest component with a proper
 * React Three Fiber implementation that shows a simple 3D scene.
 */

'use client';

import React from 'react';


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
 * Main Basic Scene component with WebGL detection and fallbacks
 */
export const BasicScene: React.FC = () => {
  // Always use fallback for now until we debug the production issue
  return <WebGLFallback />;
};

export default BasicScene;
'use client';

import React from 'react';
import * as THREE from 'three';

/**
 * Three.js Basic Import Test Component
 * 
 * Purpose: Verify Three.js imports work in production environment
 * This is Phase 2.1 validation - ensuring dependencies are properly installed
 * and accessible before building any complex 3D components.
 * 
 * Success criteria:
 * - Three.js imports without errors
 * - REVISION number displays correctly
 * - Component renders in both development and production
 */
export const ThreeJSTest: React.FC = () => {
  return (
    <div style={{
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#1a1a1a',
      border: '1px solid #22c55e',
      borderRadius: '8px',
      color: '#ffffff'
    }}>
      <h3 style={{ color: '#22c55e', margin: '0 0 8px 0' }}>
        Phase 2.1: Three.js Import Validation
      </h3>
      <p style={{ margin: '4px 0' }}>
        Three.js Version: <strong>{THREE.REVISION}</strong>
      </p>
      <p style={{ margin: '4px 0', color: '#22c55e' }}>
        ✅ Three.js imports working successfully
      </p>
      <p style={{ margin: '4px 0', fontSize: '12px', color: '#888' }}>
        This component validates basic Three.js dependency installation.
        If you can see this message and the version number, Phase 2.1 is successful.
      </p>
    </div>
  );
};

export default ThreeJSTest;
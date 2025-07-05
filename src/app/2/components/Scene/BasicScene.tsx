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

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { isWebGLReady, getWebGLConfig } from '../../lib/webgl-detection';
import type { Mesh } from 'three';

/**
 * Animated cube component to demonstrate React Three Fiber functionality
 */
function RotatingCube() {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Animate the cube rotation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh
      ref={meshRef}
      scale={clicked ? 1.5 : 1}
      onClick={() => setClicked(!clicked)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? '#ff6b6b' : '#4ecdc4'} />
    </mesh>
  );
}

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
 * Error boundary fallback for React Three Fiber components
 */
function SceneErrorFallback() {
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
        Phase 2.2: 3D Scene Error
      </h3>
      <p style={{ margin: '4px 0' }}>
        Unable to render 3D content
      </p>
      <p style={{ margin: '4px 0', color: '#888', fontSize: '12px' }}>
        Falling back to 2D experience
      </p>
    </div>
  );
}

/**
 * Main Basic Scene component with WebGL detection and fallbacks
 */
export const BasicScene: React.FC = () => {
  // Check WebGL availability before rendering Canvas
  if (!isWebGLReady()) {
    return <WebGLFallback />;
  }

  const webglConfig = getWebGLConfig();
  if (!webglConfig) {
    return <WebGLFallback />;
  }

  try {
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
          overflow: 'hidden'
        }}>
          <Canvas
            camera={{ position: [0, 0, 5] }}
            gl={{
              antialias: webglConfig.antialias,
              alpha: false,
              preserveDrawingBuffer: true
            }}
            dpr={Math.min(webglConfig.pixelRatio, 1.5)}
            onCreated={({ gl }) => {
              gl.setClearColor('#1a1a1a');
            }}
            onError={() => {
              console.error('Canvas rendering error, falling back');
            }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            
            {/* Rotating cube */}
            <RotatingCube />
          </Canvas>
        </div>
        
        <p style={{ margin: '8px 0 4px 0', color: '#10b981' }}>
          ✅ React Three Fiber working successfully
        </p>
        <p style={{ margin: '4px 0', fontSize: '12px', color: '#888' }}>
          Interactive 3D cube - click to scale, hover to change color
        </p>
      </div>
    );
  } catch (error) {
    console.error('BasicScene render error:', error);
    return <SceneErrorFallback />;
  }
};

export default BasicScene;
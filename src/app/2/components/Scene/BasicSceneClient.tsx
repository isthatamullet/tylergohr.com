/**
 * Client-side React Three Fiber Scene Component
 * 
 * This component is designed to run only on the client side to avoid SSR issues.
 * It contains all the Three.js and React Three Fiber logic.
 */

'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

/**
 * Animated cube component to demonstrate React Three Fiber functionality
 */
function RotatingCube() {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Animate the cube rotation using React Three Fiber's useFrame
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
 * Client-side React Three Fiber Scene
 */
interface BasicSceneClientProps {
  webglConfig: {
    antialias: boolean;
    shadows: boolean;
    maxLights: number;
    pixelRatio: number;
  };
}

export const BasicSceneClient: React.FC<BasicSceneClientProps> = ({ webglConfig }) => {
  const [renderError, setRenderError] = useState<string | null>(null);

  // Error boundary fallback for Canvas rendering errors
  const handleCanvasError = (error: unknown) => {
    console.error('Canvas rendering error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown WebGL error';
    setRenderError(`Canvas Error: ${errorMessage}`);
  };

  // If we have a render error, show error state
  if (renderError) {
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
          3D Rendering Error
        </h3>
        <p style={{ margin: '4px 0' }}>
          WebGL initialization failed
        </p>
        <p style={{ margin: '4px 0', color: '#888', fontSize: '12px' }}>
          {renderError}
        </p>
        <button 
          onClick={() => setRenderError(null)}
          style={{
            marginTop: '8px',
            padding: '4px 8px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

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
            preserveDrawingBuffer: true,
            powerPreference: 'default', // More compatible than high-performance
            failIfMajorPerformanceCaveat: false // Allow software rendering
          }}
          dpr={Math.min(webglConfig.pixelRatio, 1.5)}
          onCreated={({ gl }) => {
            try {
              gl.setClearColor('#1a1a1a');
              console.log('WebGL context created successfully:', {
                renderer: gl.domElement.width,
                capabilities: gl.capabilities
              });
            } catch (error) {
              console.warn('WebGL context setup warning:', error);
            }
          }}
          onError={handleCanvasError}
          fallback={
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '12px'
            }}>
              Initializing WebGL...
            </div>
          }
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
};

export default BasicSceneClient;
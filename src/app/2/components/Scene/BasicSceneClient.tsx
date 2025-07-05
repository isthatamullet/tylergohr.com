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
          onError={(error) => {
            console.error('Canvas rendering error:', error);
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
};

export default BasicSceneClient;
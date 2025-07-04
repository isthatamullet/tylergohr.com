'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, ReactNode } from 'react';
import { useDeviceCapabilities } from '../../hooks/useWebGL';

interface SceneProps {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
}

export const Scene = ({ children, fallback, className }: SceneProps) => {
  const capabilities = useDeviceCapabilities();

  // If WebGL is not supported, render fallback
  if (!capabilities.supported) {
    return (
      <div className={className}>
        {fallback || <div>3D content not supported on this device</div>}
      </div>
    );
  }

  // Configure camera and scene based on device capabilities
  const cameraProps = {
    position: [0, 0, 5] as [number, number, number],
    fov: capabilities.mobile ? 60 : 45,
  };

  const canvasProps = {
    dpr: capabilities.performance === 'high' ? [1, 2] as [number, number] : [1, 1.5] as [number, number],
    performance: {
      min: capabilities.performance === 'low' ? 0.5 : 0.8,
      max: 1,
    },
    shadows: capabilities.performance === 'high',
    antialias: capabilities.performance !== 'low',
  };

  return (
    <div className={className}>
      <Canvas camera={cameraProps} {...canvasProps}>
        <Suspense fallback={null}>
          {/* Basic scene setup */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          
          {children}
        </Suspense>
      </Canvas>
    </div>
  );
};
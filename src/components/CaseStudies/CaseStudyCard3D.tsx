/**
 * CaseStudyCard3D Component - Phase 2.3 Alternative: 3D Project Cards
 * 
 * Purpose: Transform case study preview cards with interactive 3D effects
 * demonstrating advanced WebGL capabilities while maintaining business focus.
 * 
 * Features:
 * - Mouse-following tilt effects with realistic perspective
 * - Depth layering for visual hierarchy and engagement
 * - Subtle hover animations and micro-interactions
 * - Progressive enhancement with 2D fallback
 * - Mobile-optimized touch interactions
 */

'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, getWebGLConfig, isMobileDevice } from '../../lib/webgl-detection';
import { CaseStudyCard } from './CaseStudyCard'; // 2D fallback
import type { CaseStudyCardProps } from './CaseStudyCard';
import styles from './CaseStudyCard3D.module.css';

/**
 * Mouse interaction state for 3D effects
 */
interface MouseState {
  x: number;
  y: number;
  isHovering: boolean;
}

/**
 * 3D card configuration based on device capabilities
 */
interface Card3DConfig {
  maxTilt: number;        // Maximum tilt angle in radians
  rotationSpeed: number;  // Animation smoothness
  hoverScale: number;     // Scale effect on hover
  perspectiveDepth: number; // Z-axis perspective depth
}

/**
 * Get performance-appropriate 3D configuration
 */
function getCard3DConfig(): Card3DConfig {
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    return {
      maxTilt: 0.1,         // Reduced tilt for mobile
      rotationSpeed: 0.05,  // Slower animations
      hoverScale: 1.02,     // Subtle scale
      perspectiveDepth: 0.5 // Reduced depth
    };
  }
  
  return {
    maxTilt: 0.15,        // Full desktop tilt
    rotationSpeed: 0.08,  // Smooth animations
    hoverScale: 1.05,     // Noticeable but professional scale
    perspectiveDepth: 1.0 // Full depth effect
  };
}

/**
 * Individual 3D Card Mesh Component
 */
interface Card3DMeshProps {
  mouseState: MouseState;
  config: Card3DConfig;
  children: React.ReactNode;
}

function Card3DMesh({ mouseState, config, children }: Card3DMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const targetScale = useRef(1);

  // Calculate target rotation based on mouse position
  useEffect(() => {
    if (mouseState.isHovering) {
      // Convert mouse position (-1 to 1) to rotation angles
      targetRotation.current.x = mouseState.y * config.maxTilt;
      targetRotation.current.y = -mouseState.x * config.maxTilt;
      targetScale.current = config.hoverScale;
    } else {
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
      targetScale.current = 1;
    }
  }, [mouseState, config]);

  // Smooth animation frame loop
  useFrame(() => {
    if (!meshRef.current) return;

    // Smooth rotation interpolation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetRotation.current.x,
      config.rotationSpeed
    );
    
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetRotation.current.y,
      config.rotationSpeed
    );

    // Smooth scale interpolation
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale.current, config.rotationSpeed);
    meshRef.current.scale.setScalar(newScale);
  });

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, config.perspectiveDepth]}>
        <planeGeometry args={[4, 3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {children}
    </group>
  );
}

/**
 * Mouse Tracker for Card Hover Detection
 */
interface CardMouseTrackerProps {
  onMouseUpdate: (mouseState: MouseState) => void;
}

function CardMouseTracker({ onMouseUpdate }: CardMouseTrackerProps) {
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (event: Event) => {
      const mouseEvent = event as MouseEvent;
      const target = mouseEvent.currentTarget as HTMLElement;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      
      // Calculate normalized mouse position within the card (-1 to 1)
      const x = ((mouseEvent.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((mouseEvent.clientY - rect.top) / rect.height) * 2 - 1;

      onMouseUpdate({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, -y)), // Invert Y for correct rotation
        isHovering: true
      });
    };

    const handleMouseLeave = () => {
      onMouseUpdate({
        x: 0,
        y: 0,
        isHovering: false
      });
    };

    // Attach to the canvas parent element
    const canvas = document.querySelector(`canvas`);
    const cardContainer = canvas?.closest(`.${styles.card3DContainer}`);
    
    if (cardContainer) {
      cardContainer.addEventListener('mousemove', handleMouseMove);
      cardContainer.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        cardContainer.removeEventListener('mousemove', handleMouseMove);
        cardContainer.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [camera, onMouseUpdate]);

  return null;
}

/**
 * 3D Scene Component for Case Study Card
 */
interface Card3DSceneProps {
  webglConfig: {
    antialias: boolean;
    shadows: boolean;
    maxLights: number;
    pixelRatio: number;
  };
}

function Card3DScene({ }: Card3DSceneProps) {
  const config = useMemo(() => getCard3DConfig(), []);
  
  // Mouse interaction state
  const [mouseState, setMouseState] = useState<MouseState>({
    x: 0,
    y: 0,
    isHovering: false
  });

  return (
    <>
      {/* Mouse interaction tracking */}
      <CardMouseTracker onMouseUpdate={setMouseState} />
      
      {/* Subtle ambient lighting for depth */}
      <ambientLight intensity={0.6} />
      <pointLight position={[2, 2, 5]} intensity={0.4} />
      
      {/* 3D Card Mesh with tilt effects */}
      <Card3DMesh mouseState={mouseState} config={config}>
        <></>
      </Card3DMesh>
    </>
  );
}

/**
 * Fallback component for loading or errors
 */
function Card3DLoadingFallback() {
  return (
    <div className={styles.fallbackContainer}>
      <div className={styles.loadingIndicator}>
        <div className={styles.loadingDot}></div>
        <div className={styles.loadingDot}></div>
        <div className={styles.loadingDot}></div>
      </div>
    </div>
  );
}

/**
 * Main CaseStudyCard3D Component with Progressive Enhancement
 */
export const CaseStudyCard3D: React.FC<CaseStudyCardProps> = (props) => {
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
  
  const [renderError, setRenderError] = useState<string | null>(null);

  // Client-only WebGL detection to prevent hydration mismatches
  useEffect(() => {
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
        console.warn('WebGL detection failed for 3D cards:', error);
        setWebglState({
          isReady: false,
          config: null,
          isLoading: false
        });
      }
    }, 100); // Small delay for stability

    return () => clearTimeout(timer);
  }, []);

  // Canvas error handler
  const handleCanvasError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown WebGL error';
    setRenderError(`3D Card Error: ${errorMessage}`);
    console.error('CaseStudyCard3D Canvas Error:', error);
  };

  // Show loading state during WebGL detection
  if (webglState.isLoading) {
    return <Card3DLoadingFallback />;
  }

  // Show 2D fallback if WebGL not ready, error occurred, or config invalid
  if (!webglState.isReady || !webglState.config || renderError) {
    return <CaseStudyCard {...props} />;
  }

  return (
    <div className={styles.card3DContainer}>
      {/* 3D Canvas Layer */}
      <div className={styles.canvas3DLayer}>
        <SceneErrorBoundary fallback={<CaseStudyCard {...props} />}>
          <Canvas
            camera={{ 
              position: [0, 0, 5], 
              fov: 50 
            }}
            gl={{
              antialias: webglState.config.antialias,
              alpha: true,
              preserveDrawingBuffer: true,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: false
            }}
            dpr={webglState.config.pixelRatio}
            onCreated={({ gl }) => {
              gl.setClearColor('#000000', 0); // Transparent background
            }}
            fallback={<Card3DLoadingFallback />}
            onError={handleCanvasError}
          >
            <Card3DScene webglConfig={webglState.config} />
          </Canvas>
        </SceneErrorBoundary>
      </div>
      
      {/* HTML Content Layer (rendered above 3D) */}
      <div className={styles.content3DLayer}>
        <CaseStudyCard {...props} className={styles.enhanced3DCard} />
      </div>
    </div>
  );
};

export default CaseStudyCard3D;
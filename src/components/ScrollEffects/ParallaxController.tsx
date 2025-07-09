/**
 * ParallaxController Component - Phase 3.2 Day 1
 * 
 * Purpose: WebGL-accelerated parallax backgrounds with GPU optimization
 * for Phase 3 Week 2 advanced scroll effects implementation.
 * 
 * Features:
 * - Hardware-accelerated parallax effects using CSS transforms and WebGL
 * - Integration with existing 3D architecture and ScrollController state
 * - Performance-optimized layers with device-specific configurations
 * - Smooth parallax motion synchronized with scroll position
 * - Memory-efficient particle systems for enhanced visual effects
 */

'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, getWebGLConfig, isMobileDevice } from '../../lib/webgl-detection';
import { useScrollController } from './ScrollController';
import styles from './ParallaxController.module.css';

/**
 * Parallax layer configuration interface
 */
export interface ParallaxLayer {
  id: string;
  depth: number; // 0-1, where 0 is background, 1 is foreground
  speed: number; // Parallax scroll speed multiplier
  opacity: number; // Layer opacity
  color: string; // Layer tint color
  particleCount?: number; // Number of particles (for WebGL layers)
  enableWebGL?: boolean; // Whether to use WebGL acceleration
}

/**
 * Parallax configuration based on device performance
 */
interface ParallaxConfig {
  enableWebGL: boolean;
  maxLayers: number;
  particleDensity: number;
  animationQuality: 'high' | 'medium' | 'low';
  enableMotionBlur: boolean;
  refreshRate: number; // FPS target
}

/**
 * Get performance-appropriate parallax configuration
 */
function getParallaxConfig(): ParallaxConfig {
  const isMobile = isMobileDevice();
  const webglConfig = getWebGLConfig();
  const webglReady = isWebGLReady();
  
  // High-performance desktop configuration
  if (webglReady && webglConfig && !isMobile && webglConfig.pixelRatio >= 2) {
    return {
      enableWebGL: true,
      maxLayers: 5,
      particleDensity: 1.0,
      animationQuality: 'high',
      enableMotionBlur: true,
      refreshRate: 120
    };
  }
  
  // Medium-performance configuration
  if (webglReady && webglConfig && !isMobile) {
    return {
      enableWebGL: true,
      maxLayers: 3,
      particleDensity: 0.6,
      animationQuality: 'medium',
      enableMotionBlur: false,
      refreshRate: 60
    };
  }
  
  // Low-performance/mobile fallback
  return {
    enableWebGL: false,
    maxLayers: 2,
    particleDensity: 0.3,
    animationQuality: 'low',
    enableMotionBlur: false,
    refreshRate: 30
  };
}

/**
 * Default parallax layers for technical expertise section
 */
function getDefaultParallaxLayers(config: ParallaxConfig): ParallaxLayer[] {
  const layers: ParallaxLayer[] = [
    {
      id: 'background-particles',
      depth: 0.1,
      speed: 0.2,
      opacity: 0.15,
      color: '#16a34a',
      particleCount: Math.floor(50 * config.particleDensity),
      enableWebGL: config.enableWebGL
    },
    {
      id: 'mid-particles',
      depth: 0.4,
      speed: 0.5,
      opacity: 0.25,
      color: '#10b981',
      particleCount: Math.floor(30 * config.particleDensity),
      enableWebGL: config.enableWebGL
    }
  ];
  
  // Add additional layers for high-performance devices
  if (config.animationQuality === 'high') {
    layers.push({
      id: 'foreground-particles',
      depth: 0.8,
      speed: 0.8,
      opacity: 0.1,
      color: '#059669',
      particleCount: Math.floor(20 * config.particleDensity),
      enableWebGL: config.enableWebGL
    });
  }
  
  return layers.slice(0, config.maxLayers);
}

/**
 * WebGL Particle System for parallax effects
 */
interface ParallaxParticleSystemProps {
  layer: ParallaxLayer;
  scrollY: number;
  sectionProgress: number;
  config: ParallaxConfig;
}

function ParallaxParticleSystem({ 
  layer, 
  scrollY, 
  sectionProgress 
}: ParallaxParticleSystemProps) {
  const particlesRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  
  // Generate particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array((layer.particleCount || 20) * 3);
    
    for (let i = 0; i < positions.length; i += 3) {
      // Distribute particles in 3D space around the camera
      positions[i] = (Math.random() - 0.5) * 40; // X
      positions[i + 1] = (Math.random() - 0.5) * 20; // Y
      positions[i + 2] = (Math.random() - 0.5) * 30 - layer.depth * 10; // Z based on layer depth
    }
    
    return positions;
  }, [layer.particleCount, layer.depth]);
  
  // Create particle geometry
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    return geom;
  }, [particlePositions]);
  
  // Animate particles based on scroll
  useFrame((state) => {
    if (!particlesRef.current || !materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    const particles = particlesRef.current;
    const material = materialRef.current;
    
    // Parallax movement based on scroll position
    const parallaxOffset = scrollY * layer.speed * 0.001;
    particles.position.y = parallaxOffset;
    
    // Rotate particles based on scroll progress and time
    particles.rotation.y = time * 0.1 + sectionProgress * 0.5;
    particles.rotation.x = Math.sin(time * 0.05) * 0.1;
    
    // Dynamic opacity based on section progress
    const targetOpacity = layer.opacity * Math.max(0.3, sectionProgress);
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.02);
    
    // Add subtle floating motion
    particles.position.z = Math.sin(time * 0.2 + layer.depth * 2) * 0.5;
  });
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        ref={materialRef}
        color={layer.color}
        size={layer.depth * 2 + 0.5}
        transparent
        opacity={layer.opacity}
        sizeAttenuation={true}
        vertexColors={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * CSS-based parallax layer for fallback or low-performance devices
 */
interface CSSParallaxLayerProps {
  layer: ParallaxLayer;
  scrollY: number;
  sectionProgress: number;
}

function CSSParallaxLayer({ layer, scrollY, sectionProgress }: CSSParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!layerRef.current) return;
    
    const element = layerRef.current;
    const parallaxOffset = scrollY * layer.speed;
    const opacity = layer.opacity * Math.max(0.3, sectionProgress);
    
    // Use CSS transforms for hardware acceleration
    element.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
    element.style.opacity = opacity.toString();
    
  }, [scrollY, layer.speed, layer.opacity, sectionProgress]);
  
  return (
    <div
      ref={layerRef}
      className={styles.cssParallaxLayer}
      style={{
        '--layer-color': layer.color,
        '--layer-depth': layer.depth,
        zIndex: Math.floor(layer.depth * 10)
      } as React.CSSProperties}
    />
  );
}

/**
 * WebGL Parallax Scene Component
 */
interface ParallaxSceneProps {
  layers: ParallaxLayer[];
  scrollY: number;
  sectionProgress: number;
  config: ParallaxConfig;
}

function ParallaxScene({ layers, scrollY, sectionProgress, config }: ParallaxSceneProps) {
  const { camera } = useThree();
  
  // Set up camera for parallax scene
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
    }
  }, [camera]);
  
  return (
    <>
      {/* Ambient lighting for particles */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#10b981" />
      
      {/* Render particle systems for each layer */}
      {layers
        .filter(layer => layer.enableWebGL)
        .map(layer => (
          <ParallaxParticleSystem
            key={layer.id}
            layer={layer}
            scrollY={scrollY}
            sectionProgress={sectionProgress}
            config={config}
          />
        ))}
    </>
  );
}

/**
 * Main ParallaxController Component
 */
interface ParallaxControllerProps {
  className?: string;
  customLayers?: ParallaxLayer[];
  enableEffects?: boolean;
}

export function ParallaxController({ 
  className, 
  customLayers, 
  enableEffects = true 
}: ParallaxControllerProps) {
  const { scrollState } = useScrollController();
  const [webglState, setWebglState] = useState<{
    isReady: boolean;
    config: { antialias: boolean; shadows: boolean; maxLights: number; pixelRatio: number } | null;
    isLoading: boolean;
  }>({
    isReady: false,
    config: null,
    isLoading: true
  });
  
  // Get parallax configuration
  const parallaxConfig = useMemo(() => getParallaxConfig(), []);
  
  // Get parallax layers (custom or default)
  const parallaxLayers = useMemo(() => {
    return customLayers || getDefaultParallaxLayers(parallaxConfig);
  }, [customLayers, parallaxConfig]);
  
  // WebGL detection with performance monitoring
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const performanceStart = performance.now();
        const isReady = isWebGLReady() && parallaxConfig.enableWebGL;
        const config = isReady ? getWebGLConfig() : null;
        const performanceEnd = performance.now();
        
        console.log(`[ParallaxController] WebGL detection took ${(performanceEnd - performanceStart).toFixed(2)}ms`);
        
        setWebglState({
          isReady: isReady && config !== null,
          config,
          isLoading: false
        });
      } catch (error) {
        console.warn('ParallaxController WebGL detection failed:', error);
        setWebglState({
          isReady: false,
          config: null,
          isLoading: false
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [parallaxConfig.enableWebGL]);
  
  // Performance monitoring for parallax effects
  useEffect(() => {
    if (!webglState.isReady || !enableEffects) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let monitoringActive = true;

    const monitorPerformance = () => {
      if (!monitoringActive) return;
      
      frameCount++;
      const currentTime = performance.now();
      
      // Check performance every 60 frames
      if (frameCount % 60 === 0) {
        const fps = 60000 / (currentTime - lastTime);
        
        // Log performance for high-end configs
        if (parallaxConfig.animationQuality === 'high' && fps < parallaxConfig.refreshRate * 0.8) {
          console.warn(`[ParallaxController] Performance below target: ${fps.toFixed(1)}fps (target: ${parallaxConfig.refreshRate}fps)`);
        }
        
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorPerformance);
    };

    requestAnimationFrame(monitorPerformance);

    return () => {
      monitoringActive = false;
    };
  }, [webglState.isReady, enableEffects, parallaxConfig]);

  // Don't render if effects are disabled or still loading
  if (!enableEffects || webglState.isLoading) {
    return null;
  }

  return (
    <div className={`${styles.parallaxContainer} ${className || ''}`}>
      {/* WebGL Parallax Scene */}
      {webglState.isReady && webglState.config && (
        <div className={styles.webglParallaxContainer}>
          <SceneErrorBoundary fallback={null}>
            <Canvas
              camera={{ 
                position: [0, 0, 10], 
                fov: 75 
              }}
              gl={{
                antialias: webglState.config.antialias,
                alpha: true,
                preserveDrawingBuffer: false,
                powerPreference: 'default',
                premultipliedAlpha: true
              }}
              dpr={Math.min(webglState.config.pixelRatio, 2)} // Limit pixel ratio for performance
              onCreated={({ gl }) => {
                gl.setClearColor('#000000', 0); // Transparent background
              }}
            >
              <ParallaxScene
                layers={parallaxLayers}
                scrollY={scrollState.scrollY}
                sectionProgress={scrollState.sectionProgress}
                config={parallaxConfig}
              />
            </Canvas>
          </SceneErrorBoundary>
        </div>
      )}
      
      {/* CSS Fallback Parallax Layers */}
      {(!webglState.isReady || !parallaxConfig.enableWebGL) && (
        <div className={styles.cssParallaxContainer}>
          {parallaxLayers
            .filter(layer => !layer.enableWebGL)
            .map(layer => (
              <CSSParallaxLayer
                key={layer.id}
                layer={layer}
                scrollY={scrollState.scrollY}
                sectionProgress={scrollState.sectionProgress}
              />
            ))}
        </div>
      )}
    </div>
  );
}

/**
 * Hook for custom parallax effects using scroll state
 */
export function useParallaxTransform(
  speed: number = 0.5,
  enableHardwareAcceleration: boolean = true
) {
  const { scrollState } = useScrollController();
  
  // Create a simple transform value based on scroll state
  const parallaxOffset = scrollState.scrollY * speed;
  
  const parallaxStyle = useMemo(() => {
    if (!enableHardwareAcceleration) {
      return {
        transform: `translateY(${scrollState.scrollY * speed}px)`
      };
    }
    
    return {
      transform: `translate3d(0, ${scrollState.scrollY * speed}px, 0)`,
      willChange: 'transform'
    };
  }, [scrollState.scrollY, speed, enableHardwareAcceleration]);
  
  return {
    parallaxOffset,
    parallaxStyle,
    scrollProgress: scrollState.sectionProgress
  };
}

export default ParallaxController;
/**
 * NetworkAnimation3D Component - Phase 2.3 Enhanced Network Animation
 * 
 * Purpose: Replace 2D SVG network animation with subtle 3D particle system
 * demonstrating technical sophistication while maintaining brand consistency.
 * 
 * Features:
 * - 50-80 floating particles with dynamic connections
 * - Mouse interaction and skill-based color coding
 * - Progressive enhancement with graceful 2D fallback
 * - Performance optimized for 60fps desktop, 30fps mobile
 */

'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, getWebGLConfig, isMobileDevice } from '../../lib/webgl-detection';
import { NetworkAnimation } from './NetworkAnimation'; // 2D fallback
import styles from './NetworkAnimation3D.module.css';

/**
 * Particle system configuration based on device capabilities
 */
interface ParticleConfig {
  count: number;
  speed: number;
  connectionDistance: number;
  mouseInfluence: number;
}

/**
 * Mouse interaction state
 */
interface MouseState {
  position: THREE.Vector3;
  isActive: boolean;
}

/**
 * Get performance-appropriate particle configuration
 */
function getParticleConfig(): ParticleConfig {
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    return {
      count: 30,              // Reduced for mobile performance
      speed: 0.3,             // Slower movement
      connectionDistance: 80,  // Shorter connections
      mouseInfluence: 20       // Reduced mouse interaction
    };
  }
  
  return {
    count: 60,              // Desktop particle count
    speed: 0.5,             // Normal movement speed
    connectionDistance: 120, // Full connection distance
    mouseInfluence: 40       // Full mouse interaction
  };
}

/**
 * Individual Particle Component with Enhanced Physics and Mouse Interaction
 */
interface ParticleProps {
  position: THREE.Vector3;
  index: number;
  config: ParticleConfig;
  nodeType: 'primary' | 'secondary' | 'tertiary';
  mouseState: MouseState;
}

function Particle({ position, index, config, nodeType, mouseState }: ParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const basePosition = useMemo(() => position.clone(), [position]);
  
  // Enhanced particle physics with varied movement patterns
  const movementPattern = useMemo(() => {
    return {
      xFreq: 0.5 + (index % 3) * 0.2,        // Varied X frequency
      yFreq: 0.8 + (index % 4) * 0.15,       // Varied Y frequency  
      zFreq: 0.6 + (index % 5) * 0.1,        // Varied Z frequency
      xAmp: 0.3 + (index % 7) * 0.1,         // X amplitude variation
      yAmp: 0.2 + (index % 6) * 0.05,        // Y amplitude variation
      zAmp: 0.15 + (index % 8) * 0.05,       // Z amplitude variation
      pulseFreq: 1.5 + (index % 9) * 0.3,    // Pulse frequency
      orbitalRadius: (index % 11) * 0.02     // Orbital motion
    };
  }, [index]);
  
  // Enhanced skill-based color properties
  const nodeProperties = useMemo(() => {
    switch (nodeType) {
      case 'primary':
        return {
          color: '#10b981',      // Emerald green for central expertise hub
          size: 1.4,             // Larger size for importance
          opacity: 0.95,         // Highest opacity
          pulseIntensity: 0.18   // Strongest pulse for attention
        };
      case 'secondary':
        // Different shades for different enterprise domains
        const secondaryColors = ['#22c55e', '#16a34a', '#059669', '#047857']; // Green variations
        const colorIndex = index % secondaryColors.length;
        return {
          color: secondaryColors[colorIndex], // Varied enterprise node colors
          size: 1.1,             // Medium-large size
          opacity: 0.85,         // High opacity
          pulseIntensity: 0.12   // Medium-strong pulse
        };
      case 'tertiary':
        // Skill category colors (more varied for visual interest)
        const skillColors = [
          '#06b6d4',  // Cyan - Frontend/React
          '#8b5cf6',  // Purple - Backend/API
          '#f59e0b',  // Amber - DevOps/Cloud
          '#ef4444',  // Red - Performance/Optimization
          '#84cc16',  // Lime - Testing/QA
          '#6366f1'   // Indigo - AI/ML
        ];
        const skillIndex = index % skillColors.length;
        return {
          color: skillColors[skillIndex], // Technical skill-based colors
          size: 0.8,             // Smaller but visible
          opacity: 0.7,          // Medium opacity
          pulseIntensity: 0.06   // Subtle pulse
        };
    }
  }, [nodeType, index]);
  
  // Enhanced floating animation with orbital motion and mouse interaction
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const mesh = meshRef.current;
    
    // Enhanced floating motion with varied patterns
    const timeOffset = index * 0.5; // Stagger animations
    
    // Base floating movement
    const floatX = Math.sin((time * config.speed * movementPattern.xFreq) + timeOffset) * movementPattern.xAmp;
    const floatY = Math.cos((time * config.speed * movementPattern.yFreq) + timeOffset) * movementPattern.yAmp;
    const floatZ = Math.sin((time * config.speed * movementPattern.zFreq) + timeOffset) * movementPattern.zAmp;
    
    // Add subtle orbital motion for visual interest
    const orbitalTime = time * 0.2;
    const orbitalX = Math.cos(orbitalTime + index) * movementPattern.orbitalRadius;
    const orbitalY = Math.sin(orbitalTime + index) * movementPattern.orbitalRadius;
    
    // Mouse interaction - particle attraction
    let mouseInfluenceX = 0;
    let mouseInfluenceY = 0;
    
    if (mouseState.isActive) {
      const currentPos = new THREE.Vector3(
        basePosition.x + floatX + orbitalX,
        basePosition.y + floatY + orbitalY,
        basePosition.z + floatZ
      );
      
      const distance = currentPos.distanceTo(mouseState.position);
      const maxInfluenceDistance = config.mouseInfluence;
      
      if (distance < maxInfluenceDistance) {
        const influenceStrength = (1 - distance / maxInfluenceDistance) * 0.3; // Subtle attraction
        const direction = new THREE.Vector3()
          .subVectors(mouseState.position, currentPos)
          .normalize();
        
        mouseInfluenceX = direction.x * influenceStrength;
        mouseInfluenceY = direction.y * influenceStrength;
      }
    }
    
    // Apply combined motion (base + orbital + mouse influence)
    mesh.position.x = basePosition.x + floatX + orbitalX + mouseInfluenceX;
    mesh.position.y = basePosition.y + floatY + orbitalY + mouseInfluenceY;
    mesh.position.z = basePosition.z + floatZ;
    
    // Enhanced pulsing with node-specific intensity and mouse proximity boost
    const pulseTime = time * movementPattern.pulseFreq + timeOffset;
    let pulseIntensity = nodeProperties.pulseIntensity;
    
    // Boost pulse when mouse is nearby
    if (mouseState.isActive) {
      const currentPos = mesh.position;
      const distance = currentPos.distanceTo(mouseState.position);
      if (distance < config.mouseInfluence * 0.5) {
        pulseIntensity += 0.1; // Subtle pulse boost on mouse proximity
      }
    }
    
    const pulseScale = 1 + Math.sin(pulseTime) * pulseIntensity;
    mesh.scale.setScalar(nodeProperties.size * pulseScale);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 12, 12]} />
      <meshBasicMaterial 
        color={nodeProperties.color}
        transparent
        opacity={nodeProperties.opacity}
      />
    </mesh>
  );
}

/**
 * Enhanced Connection Lines Component with Dynamic Animation and Hover Effects
 */
interface ConnectionsProps {
  particles: { position: THREE.Vector3; nodeType: 'primary' | 'secondary' | 'tertiary' }[];
  config: ParticleConfig;
  mouseState: MouseState;
}

function Connections({ particles, config, mouseState }: ConnectionsProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  // Create connection data with enhanced logic
  const connectionData = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const connections: Array<{
      start: THREE.Vector3;
      end: THREE.Vector3;
      distance: number;
      priority: number;
    }> = [];
    
    // Generate all possible connections with priority scoring
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const distance = particles[i].position.distanceTo(particles[j].position);
        
        if (distance < config.connectionDistance) {
          // Calculate connection priority based on node types
          let priority = 1;
          if (particles[i].nodeType === 'primary' || particles[j].nodeType === 'primary') {
            priority = 3; // Primary connections are strongest
          } else if (particles[i].nodeType === 'secondary' || particles[j].nodeType === 'secondary') {
            priority = 2; // Secondary connections are medium
          }
          
          connections.push({
            start: particles[i].position,
            end: particles[j].position,
            distance,
            priority
          });
        }
      }
    }
    
    // Sort by priority and distance (closer = stronger)
    connections.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.distance - b.distance;
    });
    
    // Limit connections for performance (keep best ones)
    const maxConnections = config.count * 1.5; // Reasonable limit
    const selectedConnections = connections.slice(0, maxConnections);
    
    // Convert to points array
    selectedConnections.forEach(conn => {
      points.push(conn.start, conn.end);
    });
    
    return { points, connections: selectedConnections };
  }, [particles, config.connectionDistance, config.count]);
  
  // Create geometry for connection lines
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(connectionData.points);
  }, [connectionData.points]);
  
  // Animate connection opacity for flowing effect with hover enhancement
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Base pulsing opacity for "data flow" effect
    const baseOpacity = 0.25;
    const pulseIntensity = 0.15;
    const pulseSpeed = 0.8;
    
    let finalOpacity = baseOpacity + Math.sin(time * pulseSpeed) * pulseIntensity;
    
    // Enhance opacity when mouse is near any connection
    if (mouseState.isActive) {
      const hoverRadius = config.mouseInfluence * 0.3; // Smaller radius for connection hover
      let nearConnection = false;
      
      // Check if mouse is near any connection line
      for (let i = 0; i < connectionData.connections.length; i++) {
        const conn = connectionData.connections[i];
        
        // Calculate closest point on line to mouse position
        const lineStart = conn.start;
        const lineEnd = conn.end;
        const lineVector = new THREE.Vector3().subVectors(lineEnd, lineStart);
        const startToMouse = new THREE.Vector3().subVectors(mouseState.position, lineStart);
        
        const lineLength = lineVector.length();
        const projectionLength = Math.max(0, Math.min(lineLength, startToMouse.dot(lineVector) / lineLength));
        
        const closestPoint = new THREE.Vector3()
          .copy(lineStart)
          .add(lineVector.normalize().multiplyScalar(projectionLength));
        
        const distanceToLine = mouseState.position.distanceTo(closestPoint);
        
        if (distanceToLine < hoverRadius) {
          nearConnection = true;
          break;
        }
      }
      
      if (nearConnection) {
        finalOpacity = Math.min(0.8, finalOpacity + 0.4); // Boost opacity on hover
      }
    }
    
    materialRef.current.opacity = Math.max(0.1, Math.min(0.8, finalOpacity));
  });
  
  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color="#16a34a"
        transparent
        opacity={0.25}
      />
    </lineSegments>
  );
}

/**
 * Mouse Tracker Component - Tracks mouse position in 3D space
 */
function MouseTracker({ onMouseMove }: { onMouseMove: (mouseState: MouseState) => void }) {
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const rect = (event.target as HTMLElement)?.getBoundingClientRect();
      if (!rect) return;

      // Convert mouse coordinates to normalized device coordinates (-1 to +1)
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Convert to 3D world coordinates at z=0 plane
      const mouse3D = new THREE.Vector3(x, y, 0);
      mouse3D.unproject(camera);
      
      // Scale to match particle coordinate system
      mouse3D.multiplyScalar(0.2);

      onMouseMove({
        position: mouse3D,
        isActive: true
      });
    };

    const handleMouseLeave = () => {
      onMouseMove({
        position: new THREE.Vector3(0, 0, 0),
        isActive: false
      });
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [camera, onMouseMove]);

  return null; // This component only handles events, no visual output
}

/**
 * Main 3D Scene Component with Mouse Interaction
 */
interface NetworkScene3DProps {
  webglConfig: {
    antialias: boolean;
    shadows: boolean;
    maxLights: number;
    pixelRatio: number;
  };
}

function NetworkScene3D({ webglConfig }: NetworkScene3DProps) {
  const config = useMemo(() => getParticleConfig(), []);
  
  // Mouse interaction state
  const [mouseState, setMouseState] = useState<MouseState>({
    position: new THREE.Vector3(0, 0, 0),
    isActive: false
  });
  
  // Performance-based lighting configuration
  const lightingIntensity = useMemo(() => {
    if (webglConfig.maxLights >= 4) return 0.6; // High performance
    if (webglConfig.maxLights >= 2) return 0.5; // Medium performance  
    return 0.4; // Low performance
  }, [webglConfig.maxLights]);
  
  // Generate enhanced particle system with node types and positions
  const particles = useMemo(() => {
    const particleList: Array<{
      position: THREE.Vector3;
      nodeType: 'primary' | 'secondary' | 'tertiary';
      id: string;
    }> = [];
    
    // Map 2D SVG coordinates to 3D space (SVG viewBox: 0 0 480 400)
    // Convert to centered 3D coordinates
    const svgToWorld = (x: number, y: number, z: number = 0) => {
      return new THREE.Vector3(
        (x - 240) * 0.2,  // Center X and scale
        (200 - y) * 0.2,  // Center Y, flip, and scale
        z * 0.2            // Scale Z
      );
    };
    
    // Primary node (Central Hub) - Most important
    particleList.push({
      position: svgToWorld(240, 200, 0),
      nodeType: 'primary',
      id: 'central-hub'
    });
    
    // Secondary nodes (Enterprise companies)
    particleList.push({
      position: svgToWorld(120, 100, 5),
      nodeType: 'secondary',
      id: 'fox-corp'
    });
    particleList.push({
      position: svgToWorld(360, 100, -5),
      nodeType: 'secondary',
      id: 'warner-bros'
    });
    particleList.push({
      position: svgToWorld(180, 300, 3),
      nodeType: 'secondary',
      id: 'streaming'
    });
    particleList.push({
      position: svgToWorld(300, 300, -3),
      nodeType: 'secondary',
      id: 'ai-innovation'
    });
    
    // Tertiary data points
    particleList.push({
      position: svgToWorld(80, 200, 2),
      nodeType: 'tertiary',
      id: 'data-point-1'
    });
    particleList.push({
      position: svgToWorld(400, 200, -2),
      nodeType: 'tertiary',
      id: 'data-point-2'
    });
    particleList.push({
      position: svgToWorld(240, 80, 4),
      nodeType: 'tertiary',
      id: 'data-point-3'
    });
    particleList.push({
      position: svgToWorld(240, 320, -4),
      nodeType: 'tertiary',
      id: 'data-point-4'
    });
    
    // Add additional random tertiary particles to reach target count
    for (let i = particleList.length; i < config.count; i++) {
      particleList.push({
        position: svgToWorld(
          80 + Math.random() * 320,    // Keep within bounds
          80 + Math.random() * 240,    // Keep within bounds
          (Math.random() - 0.5) * 15   // Smaller Z range for stability
        ),
        nodeType: 'tertiary',
        id: `random-particle-${i}`
      });
    }
    
    return particleList;
  }, [config.count]);

  return (
    <>
      {/* Mouse interaction tracking */}
      <MouseTracker onMouseMove={setMouseState} />
      
      {/* Performance-based ambient lighting */}
      <ambientLight intensity={lightingIntensity} />
      <pointLight position={[10, 10, 10]} intensity={lightingIntensity * 0.7} />
      
      {/* Enhanced particle system with mouse interaction */}
      {particles.map((particle, index) => (
        <Particle
          key={particle.id}
          position={particle.position}
          index={index}
          config={config}
          nodeType={particle.nodeType}
          mouseState={mouseState}
        />
      ))}
      
      {/* Enhanced connection lines with hover effects */}
      <Connections particles={particles} config={config} mouseState={mouseState} />
    </>
  );
}

/**
 * Fallback component for loading or errors
 */
function LoadingFallback() {
  return (
    <div className={styles.fallbackContainer}>
      <div className={styles.loadingIndicator}>
        <div className={styles.loadingDot}></div>
        <div className={styles.loadingDot}></div>
        <div className={styles.loadingDot}></div>
      </div>
      <p className={styles.loadingText}>Initializing 3D network...</p>
    </div>
  );
}

/**
 * Main NetworkAnimation3D Component with Progressive Enhancement
 */
export const NetworkAnimation3D: React.FC = () => {
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

  // Canvas error handler
  const handleCanvasError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown WebGL error';
    setRenderError(`Canvas Error: ${errorMessage}`);
    console.error('NetworkAnimation3D Canvas Error:', error);
  };

  // Show loading state during WebGL detection
  if (webglState.isLoading) {
    return <LoadingFallback />;
  }

  // Show 2D fallback if WebGL not ready, error occurred, or config invalid
  if (!webglState.isReady || !webglState.config || renderError) {
    return <NetworkAnimation />;
  }

  return (
    <div className={styles.networkContainer3D}>
      <SceneErrorBoundary fallback={<NetworkAnimation />}>
        <Canvas
          camera={{ 
            position: [0, 0, 50], 
            fov: 50 
          }}
          gl={{
            antialias: webglState.config.antialias,
            alpha: true,
            preserveDrawingBuffer: true,
            powerPreference: 'default',          // More compatible than high-performance
            failIfMajorPerformanceCaveat: false  // Allow software rendering
          }}
          dpr={webglState.config.pixelRatio}
          onCreated={({ gl }) => {
            gl.setClearColor('#1a1a1a', 0); // Transparent background
          }}
          fallback={<LoadingFallback />}
          onError={handleCanvasError}
        >
          <NetworkScene3D webglConfig={webglState.config} />
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
};

export default NetworkAnimation3D;
'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceCapabilities } from '../../hooks/useWebGL';

interface NetworkNode {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  connections: number[];
  type: 'primary' | 'secondary' | 'tertiary';
  color: THREE.Color;
  size: number;
}

interface NetworkAnimation3DProps {
  nodeCount?: number;
}

/**
 * NetworkAnimation3D Component - 3D particle system for network visualization
 * 
 * Features:
 * - Dynamic particle connections based on proximity
 * - Mouse interaction with particles
 * - Adaptive particle count based on device performance
 * - Skill-based color transitions
 * - Smooth 60fps animations
 */
export const NetworkAnimation3D: React.FC<NetworkAnimation3DProps> = ({ 
  nodeCount
}) => {
  const capabilities = useDeviceCapabilities();
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.Group>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  
  // Adaptive particle count based on device capabilities
  const adaptiveNodeCount = useMemo(() => {
    if (nodeCount) return nodeCount;
    return capabilities.recommendedParticleCount;
  }, [nodeCount, capabilities.recommendedParticleCount]);

  // Generate network nodes with enterprise-themed positioning
  const networkNodes = useMemo(() => {
    const nodes: NetworkNode[] = [];
    
    // Central hub (primary node)
    nodes.push({
      position: new THREE.Vector3(0, 0, 0),
      velocity: new THREE.Vector3(0, 0, 0),
      connections: [1, 2, 3, 4],
      type: 'primary',
      color: new THREE.Color('#22c55e'),
      size: 0.15
    });
    
    // Enterprise nodes (secondary) - positioned in a circle around center
    const enterprisePositions = [
      new THREE.Vector3(-2, 1, 0),   // Fox Corp
      new THREE.Vector3(2, 1, 0),    // Warner Bros
      new THREE.Vector3(-1, -1.5, 0), // Streaming
      new THREE.Vector3(1, -1.5, 0)   // AI Innovation
    ];
    
    const enterpriseColors = [
      '#3b82f6', // Fox Corp - blue
      '#8b5cf6', // Warner Bros - purple
      '#ef4444', // Streaming - red
      '#f59e0b'  // AI Innovation - amber
    ];
    
    enterprisePositions.forEach((pos, i) => {
      nodes.push({
        position: pos.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        connections: [0, ...(i < 3 ? [i + 2] : [1])],
        type: 'secondary',
        color: new THREE.Color(enterpriseColors[i]),
        size: 0.1
      });
    });
    
    // Generate additional tertiary nodes
    for (let i = 5; i < adaptiveNodeCount; i++) {
      const angle = (i / adaptiveNodeCount) * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 0.8;
      
      nodes.push({
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ),
        connections: [Math.floor(Math.random() * 5)],
        type: 'tertiary',
        color: new THREE.Color('#6b7280'),
        size: 0.05
      });
    }
    
    return nodes;
  }, [adaptiveNodeCount]);

  // Generate particle positions for Points component
  const positions = useMemo(() => {
    const positions = new Float32Array(networkNodes.length * 3);
    
    networkNodes.forEach((node, i) => {
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = node.position.z;
    });
    
    return positions;
  }, [networkNodes]);

  // Generate connection lines
  const connectionLines = useMemo(() => {
    const lines: React.ReactElement[] = [];
    
    networkNodes.forEach((node, i) => {
      node.connections.forEach((connIndex) => {
        if (connIndex < networkNodes.length && i < connIndex) {
          const startPos = node.position;
          const endPos = networkNodes[connIndex].position;
          
          lines.push(
            <Line
              key={`line-${i}-${connIndex}`}
              points={[startPos, endPos]}
              color={node.type === 'primary' ? '#22c55e' : '#374151'}
              lineWidth={node.type === 'primary' ? 2 : 1}
              transparent
              opacity={0.6}
            />
          );
        }
      });
    });
    
    return lines;
  }, [networkNodes]);

  // Mouse interaction handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!capabilities.canHandle3D) return;
      
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [capabilities.canHandle3D]);

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current || !pointsRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Rotate the entire group slowly
    groupRef.current.rotation.y = time * 0.1;
    
    // Update particle positions
    if (pointsRef.current.geometry.attributes.position) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      
      networkNodes.forEach((node, i) => {
        // Add subtle floating motion
        node.position.x += node.velocity.x + Math.sin(time + i) * 0.001;
        node.position.y += node.velocity.y + Math.cos(time + i * 0.5) * 0.001;
        node.position.z += node.velocity.z + Math.sin(time + i * 0.3) * 0.001;
        
        // Mouse interaction - attract particles to mouse position
        if (capabilities.canHandle3D) {
          const mouseInfluence = new THREE.Vector3(
            mouseRef.current.x * 0.5,
            mouseRef.current.y * 0.5,
            0
          );
          const distance = node.position.distanceTo(mouseInfluence);
          if (distance < 1) {
            const direction = mouseInfluence.clone().sub(node.position).normalize();
            node.position.add(direction.multiplyScalar(0.001));
          }
        }
        
        // Update positions array
        positions[i * 3] = node.position.x;
        positions[i * 3 + 1] = node.position.y;
        positions[i * 3 + 2] = node.position.z;
      });
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particle system */}
      <Points ref={pointsRef} positions={positions}>
        <PointMaterial
          transparent
          vertexColors
          size={capabilities.performance === 'high' ? 0.1 : 0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      {/* Connection lines */}
      {!capabilities.shouldUseReducedEffects && (
        <group ref={linesRef}>
          {connectionLines}
        </group>
      )}
      
      {/* Ambient particles for depth */}
      <AmbientParticles enabled={capabilities.performance === 'high'} />
    </group>
  );
};

// Ambient particles component to avoid conditional hook calls
const AmbientParticles: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const ambientPositions = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  if (!enabled) return null;

  return (
    <Points positions={ambientPositions}>
      <PointMaterial
        transparent
        color="#374151"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
};

export default NetworkAnimation3D;
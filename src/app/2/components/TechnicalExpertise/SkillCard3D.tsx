/**
 * SkillCard3D Component - Phase 3.3 Week 3 Day 1
 * 
 * Purpose: Advanced 3D skill demonstration cards that enhance the existing
 * TechnicalCard with interactive 3D effects and skill visualization.
 * 
 * Features:
 * - 3D hover effects with skill particles
 * - Technology-specific 3D demonstrations
 * - Progressive enhancement from 2D to 3D
 * - Enterprise-grade performance optimization
 * - Mobile-optimized touch interactions
 */

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { TechnicalCard } from '../ui/Card/Card';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, isMobileDevice } from '../../lib/webgl-detection';
import type { SkillCard3D, DeviceCapability3D, Animation3DConfig } from './SkillDemonstrationTypes';
import styles from './SkillCard3D.module.css';

/**
 * 3D Skill particles that orbit around the card
 */
interface SkillParticleProps {
  position: THREE.Vector3;
  color: string;
  size: number;
  speed: number;
  skill: string;
  isHovered: boolean;
}

function SkillParticle({ position, color, size, speed, skill, isHovered }: SkillParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Orbit around the card center
      const time = state.clock.getElapsedTime() * speed;
      const radius = 2 + Math.sin(time * 0.5) * 0.5;
      
      meshRef.current.position.x = Math.cos(time) * radius;
      meshRef.current.position.y = position.y + Math.sin(time * 1.2) * 0.3;
      meshRef.current.position.z = Math.sin(time) * radius * 0.5;
      
      // Scale based on hover state
      const targetScale = isHovered ? 1.5 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Gentle rotation
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
        transparent
        opacity={0.8}
      />
      {hovered && (
        <Text
          position={[0, 1, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="black"
        >
          {skill}
        </Text>
      )}
    </mesh>
  );
}

/**
 * Technology visualization that appears on card hover
 */
interface TechnologyVisualizationProps {
  technologies: string[];
  category: string;
  isVisible: boolean;
}

function TechnologyVisualization({ technologies, category, isVisible }: TechnologyVisualizationProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Color scheme based on technology category
  const getColorScheme = (cat: string) => {
    switch (cat) {
      case 'Modern Frontend': return ['#61dafb', '#00d8ff', '#20232a']; // React colors
      case 'Backend & Cloud': return ['#68a063', '#3c873a', '#215732']; // Node.js colors
      case 'Enterprise Leadership': return ['#ff6b35', '#f7931e', '#ffd23f']; // Leadership colors
      case 'Integration & Automation': return ['#8a2be2', '#9370db', '#ba55d3']; // Automation colors
      default: return ['#00ff88', '#00cc6a', '#009951']; // Default green
    }
  };

  const colors = getColorScheme(category);

  useFrame((state) => {
    if (groupRef.current && isVisible) {
      // Gentle group rotation
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef}>
      {technologies.slice(0, 6).map((tech, index) => {
        const angle = (index / technologies.length) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (index % 2) * 0.5 - 0.25;

        return (
          <Float
            key={tech}
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <mesh position={[x, y, z]}>
              <boxGeometry args={[0.3, 0.1, 0.3]} />
              <meshStandardMaterial
                color={colors[index % colors.length]}
                emissive={colors[index % colors.length]}
                emissiveIntensity={0.3}
              />
            </mesh>
            <Text
              position={[x, y + 0.3, z]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
              outlineWidth={0.05}
              outlineColor="black"
            >
              {tech.length > 12 ? tech.substring(0, 12) + '...' : tech}
            </Text>
          </Float>
        );
      })}
    </group>
  );
}

/**
 * 3D Scene for skill card enhancement
 */
interface SkillCard3DSceneProps {
  skillData: SkillCard3D;
  isHovered: boolean;
  isActive: boolean;
  deviceCapability: DeviceCapability3D;
}

function SkillCard3DScene({ skillData, isHovered, isActive, deviceCapability }: SkillCard3DSceneProps) {
  const sceneRef = useRef<THREE.Group>(null);

  // Create skill particles based on the number of skills
  const particles = useMemo(() => {
    const particleCount = Math.min(skillData.skills.length, deviceCapability.settings.maxParticles);
    return skillData.skills.slice(0, particleCount).map((skill, index) => ({
      id: `particle-${index}`,
      skill,
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      color: skillData.visualization.colors.primary,
      size: 0.1 + (index % 3) * 0.05,
      speed: 0.5 + (index % 2) * 0.3
    }));
  }, [skillData.skills, skillData.visualization.colors.primary, deviceCapability.settings.maxParticles]);

  return (
    <group ref={sceneRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={0.8} />
      
      {/* Skill particles */}
      {deviceCapability.settings.effectsEnabled.particles && particles.map((particle) => (
        <SkillParticle
          key={particle.id}
          position={particle.position}
          color={particle.color}
          size={particle.size}
          speed={particle.speed}
          skill={particle.skill}
          isHovered={isHovered}
        />
      ))}
      
      {/* Technology visualization */}
      <TechnologyVisualization
        technologies={skillData.skills}
        category={skillData.category}
        isVisible={isHovered && isActive}
      />
      
      {/* Central glow effect */}
      {deviceCapability.settings.effectsEnabled.glow && isHovered && (
        <Sphere args={[3, 32, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial
            color={skillData.visualization.colors.accent}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
    </group>
  );
}

/**
 * Enhanced skill card with 3D capabilities
 */
export interface SkillCard3DProps {
  skillData: SkillCard3D;
  isActive?: boolean;
  enableInteractions?: boolean;
  className?: string;
  onSkillHover?: (skillId: string, hovered: boolean) => void;
  onSkillClick?: (skillId: string) => void;
}

export default function SkillCard3DComponent({
  skillData,
  isActive = false,
  enableInteractions = true,
  className,
  onSkillHover,
  onSkillClick
}: SkillCard3DProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [deviceCapability, setDeviceCapability] = useState<DeviceCapability3D>({
    tier: 'medium',
    webglSupport: false,
    estimatedPerformance: 5,
    settings: {
      maxParticles: 6,
      animationQuality: 'medium',
      complexityReduction: 0.3,
      effectsEnabled: {
        particles: true,
        glow: true,
        shadows: false,
        postProcessing: false
      }
    }
  });

  // Initialize 3D capabilities
  useEffect(() => {
    const initializeCapabilities = () => {
      const webglSupported = isWebGLReady();
      const isMobile = isMobileDevice();
      
      let tier: 'high' | 'medium' | 'low' = 'medium';
      let performance = 5;
      
      if (!webglSupported) {
        tier = 'low';
        performance = 2;
      } else if (isMobile) {
        tier = 'medium';
        performance = 4;
      } else {
        tier = 'high';
        performance = 8;
      }

      const capability: DeviceCapability3D = {
        tier,
        webglSupport: webglSupported,
        estimatedPerformance: performance,
        settings: {
          maxParticles: tier === 'high' ? 10 : tier === 'medium' ? 6 : 3,
          animationQuality: tier === 'high' ? 'high' : tier === 'medium' ? 'medium' : 'low',
          complexityReduction: tier === 'high' ? 0 : tier === 'medium' ? 0.3 : 0.6,
          effectsEnabled: {
            particles: webglSupported,
            glow: webglSupported && tier !== 'low',
            shadows: webglSupported && tier === 'high',
            postProcessing: webglSupported && tier === 'high'
          }
        }
      };

      setDeviceCapability(capability);
      setIs3DEnabled(webglSupported && enableInteractions);
    };

    initializeCapabilities();
  }, [enableInteractions]);

  // Handle hover events
  const handleMouseEnter = () => {
    if (!enableInteractions) return;
    setIsHovered(true);
    onSkillHover?.(skillData.id, true);
  };

  const handleMouseLeave = () => {
    if (!enableInteractions) return;
    setIsHovered(false);
    onSkillHover?.(skillData.id, false);
  };

  // Handle click events
  const handleClick = () => {
    if (!enableInteractions) return;
    onSkillClick?.(skillData.id);
  };

  return (
    <div 
      className={`${styles.skillCard3D} ${className || ''} ${isHovered ? styles.hovered : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Base technical card */}
      <TechnicalCard
        category={skillData.category}
        skills={skillData.skills}
        experience={skillData.experience}
        currentExample={skillData.currentExample}
        icon={skillData.icon}
        size="md"
        glassmorphism={true}
        className={styles.baseCard}
      />
      
      {/* 3D Enhancement Layer */}
      {is3DEnabled && (
        <div className={styles.canvas3D}>
          <SceneErrorBoundary fallback={<div className={styles.fallback3D}>3D effects unavailable</div>}>
            <Suspense fallback={<div className={styles.loading3D}>Loading 3D...</div>}>
              <Canvas
                camera={{ 
                  position: [0, 0, 5], 
                  fov: 45,
                  near: 0.1,
                  far: 100
                }}
                dpr={deviceCapability.tier === 'high' ? 2 : 1}
                performance={{ min: 0.5 }}
                gl={{ 
                  antialias: deviceCapability.tier !== 'low',
                  alpha: true,
                  powerPreference: 'high-performance'
                }}
              >
                <SkillCard3DScene
                  skillData={skillData}
                  isHovered={isHovered}
                  isActive={isActive}
                  deviceCapability={deviceCapability}
                />
              </Canvas>
            </Suspense>
          </SceneErrorBoundary>
        </div>
      )}

      {/* Business value overlay on hover */}
      {isHovered && (
        <div className={styles.businessValueOverlay}>
          <h4 className={styles.businessValueTitle}>Business Value</h4>
          <p className={styles.businessValueText}>{skillData.businessValue}</p>
          {skillData.achievements && skillData.achievements.length > 0 && (
            <div className={styles.achievements}>
              <h5>Key Achievements:</h5>
              <ul>
                {skillData.achievements.slice(0, 2).map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Performance indicator (development mode) */}
      {process.env.NODE_ENV === 'development' && (
        <div className={styles.performanceIndicator}>
          <span className={styles.deviceTier}>{deviceCapability.tier}</span>
          <span className={styles.performanceScore}>{deviceCapability.estimatedPerformance}/10</span>
        </div>
      )}
    </div>
  );
}
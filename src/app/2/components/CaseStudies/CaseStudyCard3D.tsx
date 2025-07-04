'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDeviceCapabilities } from '../../hooks/useWebGL';
import type { CaseStudy } from './CaseStudiesPreview';

interface CaseStudyCard3DProps {
  caseStudy: CaseStudy;
  position: [number, number, number];
  cardIndex: number;
  isVisible: boolean;
  animationDelay: number;
}

/**
 * CaseStudyCard3D Component - 3D floating cards for case studies
 * 
 * Features:
 * - 3D floating card geometry with subtle rotation
 * - Mouse-follow interactions and magnetic effects
 * - Metric badge rendered as 3D text
 * - Smooth hover animations and card lifts
 * - Progressive enhancement with device-specific optimizations
 */
export const CaseStudyCard3D: React.FC<CaseStudyCard3DProps> = ({
  caseStudy,
  position,
  cardIndex,
  isVisible,
  animationDelay
}) => {
  const capabilities = useDeviceCapabilities();
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const badgeRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [cardRevealed, setCardRevealed] = useState(false);
  const mousePosition = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  // Delayed reveal animation
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setCardRevealed(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [isVisible, animationDelay]);

  // Mouse tracking for magnetic effects
  useEffect(() => {
    if (!capabilities.canHandle3D) return;

    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [capabilities.canHandle3D]);

  // Color mapping for metric categories
  const getMetricColor = (category: string): string => {
    switch (category) {
      case 'emmy': return '#fbbf24'; // Gold
      case 'savings': return '#10b981'; // Green
      case 'success': return '#3b82f6'; // Blue
      case 'innovation': return '#8b5cf6'; // Purple
      default: return '#6b7280'; // Gray
    }
  };

  // Animation loop
  useFrame((state) => {
    if (!groupRef.current || !cardRef.current) return;

    const time = state.clock.getElapsedTime();

    // Floating animation
    if (cardRevealed) {
      groupRef.current.position.y = position[1] + Math.sin(time + cardIndex) * 0.1;
      
      // Subtle rotation
      groupRef.current.rotation.y = Math.sin(time * 0.5 + cardIndex) * 0.05;
      groupRef.current.rotation.x = Math.cos(time * 0.3 + cardIndex) * 0.02;
    }

    // Mouse magnetic effects
    if (capabilities.canHandle3D && hovered) {
      const mouseInfluence = new THREE.Vector3(
        mousePosition.current.x * 0.3,
        mousePosition.current.y * 0.2,
        0.2
      );
      
      const distance = groupRef.current.position.distanceTo(mouseInfluence);
      if (distance < 2) {
        const direction = mouseInfluence.clone().sub(groupRef.current.position).normalize();
        groupRef.current.position.add(direction.multiplyScalar(0.01));
      }
    }

    // Hover effects
    if (cardRef.current) {
      const targetScale = hovered ? 1.05 : 1;
      cardRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    // Badge floating animation
    if (badgeRef.current && cardRevealed) {
      badgeRef.current.position.y = 0.6 + Math.sin(time * 2 + cardIndex) * 0.05;
      badgeRef.current.rotation.z = Math.sin(time + cardIndex) * 0.1;
    }
  });

  // Initial animation state
  const initialScale = cardRevealed ? 1 : 0;
  const initialOpacity = cardRevealed ? 1 : 0;

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Main card geometry */}
      <RoundedBox
        ref={cardRef}
        args={[2, 2.5, 0.1]}
        radius={0.1}
        smoothness={4}
        scale={initialScale}
      >
        <meshStandardMaterial
          color="#1a1a1a"
          transparent
          opacity={initialOpacity}
          roughness={0.1}
          metalness={0.2}
        />
      </RoundedBox>

      {/* Metric badge as 3D element */}
      <RoundedBox
        ref={badgeRef}
        args={[1.5, 0.3, 0.05]}
        radius={0.05}
        position={[0, 0.6, 0.1]}
        scale={initialScale}
      >
        <meshStandardMaterial
          color={getMetricColor(caseStudy.metricCategory)}
          transparent
          opacity={initialOpacity}
          emissive={getMetricColor(caseStudy.metricCategory)}
          emissiveIntensity={0.2}
        />
      </RoundedBox>

      {/* Metric badge text */}
      {capabilities.performance !== 'low' && cardRevealed && (
        <Text
          position={[0, 0.6, 0.15]}
          fontSize={0.12}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/JetBrainsMono-Bold.woff"
        >
          {caseStudy.metricBadge}
        </Text>
      )}

      {/* Card content as HTML overlay for better text rendering */}
      <Html
        position={[0, -0.2, 0.1]}
        center
        transform
        occlude
        style={{
          width: '180px',
          padding: '16px',
          color: 'white',
          textAlign: 'center',
          pointerEvents: hovered ? 'auto' : 'none',
          opacity: initialOpacity,
          transition: 'opacity 0.5s ease'
        }}
      >
        <div style={{ fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
          {caseStudy.title}
        </div>
        <div style={{ fontSize: '11px', marginBottom: '8px', opacity: 0.8 }}>
          {caseStudy.challengeTeaser.substring(0, 80)}...
        </div>
        <div style={{ fontSize: '12px', marginBottom: '12px', fontWeight: '500' }}>
          {caseStudy.keyImpact}
        </div>
        <a
          href={caseStudy.link}
          style={{
            display: 'inline-block',
            padding: '6px 12px',
            background: getMetricColor(caseStudy.metricCategory),
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '500',
            transition: 'transform 0.2s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
        >
          {caseStudy.ctaText}
        </a>
      </Html>

      {/* Subtle glow effect for high-performance devices */}
      {capabilities.performance === 'high' && cardRevealed && (
        <RoundedBox
          args={[2.2, 2.7, 0.05]}
          radius={0.15}
          position={[0, 0, -0.05]}
          scale={initialScale}
        >
          <meshStandardMaterial
            color={getMetricColor(caseStudy.metricCategory)}
            transparent
            opacity={0.1}
            emissive={getMetricColor(caseStudy.metricCategory)}
            emissiveIntensity={0.05}
          />
        </RoundedBox>
      )}
    </group>
  );
};

export default CaseStudyCard3D;
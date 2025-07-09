/**
 * SkillProgressionTimeline3D Component - Phase 3.3 Week 3 Day 1
 * 
 * Purpose: Interactive 3D timeline showing 16+ years of technical expertise
 * development with major milestones, achievements, and skill progression.
 * 
 * Features:
 * - 3D timeline with floating milestone nodes
 * - Interactive exploration of career progression
 * - Technology adoption timeline visualization
 * - Enterprise achievement highlights
 * - Mobile-optimized touch interactions
 */

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Line, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, isMobileDevice } from '../../lib/webgl-detection';
import type { SkillProgression3D, Milestone3D, TechnologyMastery3D } from './SkillDemonstrationTypes';
import styles from './SkillProgressionTimeline3D.module.css';

/**
 * Timeline milestone data for Tyler Gohr's career progression
 */
const timelineData: SkillProgression3D = {
  id: 'tyler-gohr-progression',
  title: '16+ Years of Technical Excellence',
  timespan: {
    start: 2008,
    end: 2025,
    duration: '16+ years'
  },
  timeline: {
    milestones: [
      {
        id: 'early-career',
        year: 2008,
        title: 'Technical Foundation',
        description: 'Started with web development fundamentals, HTML/CSS/JavaScript',
        significance: 'major',
        position: new THREE.Vector3(-8, 0, 0),
        visualization: {
          nodeSize: 0.3,
          glowIntensity: 0.3,
          connectionStrength: 0.8,
          animationDelay: 0
        },
        achievement: {
          type: 'project',
          impact: 'Built foundation for enterprise development career',
          technologiesLearned: ['HTML', 'CSS', 'JavaScript', 'PHP'],
          businessValue: 'Established technical problem-solving approach'
        }
      },
      {
        id: 'fox-corporation',
        year: 2012,
        title: 'Fox Corporation Leadership',
        description: 'Led content management systems for 50,000+ digital titles',
        significance: 'major',
        position: new THREE.Vector3(-4, 1, 0),
        visualization: {
          nodeSize: 0.5,
          glowIntensity: 0.6,
          connectionStrength: 1.0,
          animationDelay: 0.5
        },
        achievement: {
          type: 'leadership',
          impact: 'Managed teams of 10+ specialists, $2M+ cost savings',
          technologiesLearned: ['Enterprise CMS', 'Team Leadership', 'Process Optimization'],
          businessValue: 'Improved content delivery success rates from 32% to 96%'
        }
      },
      {
        id: 'emmy-award',
        year: 2018,
        title: 'Emmy Award Achievement',
        description: 'Emmy Award for FIFA World Cup streaming interfaces',
        significance: 'major',
        position: new THREE.Vector3(0, 2, 0),
        visualization: {
          nodeSize: 0.7,
          glowIntensity: 1.0,
          connectionStrength: 1.2,
          animationDelay: 1.0
        },
        achievement: {
          type: 'innovation',
          impact: 'Global recognition for technical excellence under pressure',
          technologiesLearned: ['Streaming Technology', 'Global Scale Systems', 'Performance Optimization'],
          businessValue: 'Delivered flawless streaming experience for millions of viewers'
        }
      },
      {
        id: 'ai-pioneer',
        year: 2020,
        title: 'AI Implementation Pioneer',
        description: 'First to implement automated ad break detection systems',
        significance: 'major',
        position: new THREE.Vector3(2, 1.5, 0),
        visualization: {
          nodeSize: 0.4,
          glowIntensity: 0.7,
          connectionStrength: 0.9,
          animationDelay: 1.5
        },
        achievement: {
          type: 'innovation',
          impact: 'Reduced manual review time by 50% through AI automation',
          technologiesLearned: ['AI/ML Integration', 'Process Automation', 'Innovation Leadership'],
          businessValue: 'Pioneered AI adoption ahead of industry standard'
        }
      },
      {
        id: 'modern-stack',
        year: 2022,
        title: 'Modern Development Stack',
        description: 'Advanced React, TypeScript, and cloud-native development',
        significance: 'major',
        position: new THREE.Vector3(4, 0.5, 0),
        visualization: {
          nodeSize: 0.4,
          glowIntensity: 0.5,
          connectionStrength: 0.8,
          animationDelay: 2.0
        },
        achievement: {
          type: 'certification',
          impact: 'Mastered cutting-edge development technologies',
          technologiesLearned: ['React 19', 'TypeScript', 'Next.js 14', 'Google Cloud Platform'],
          businessValue: 'Delivered 90+ Lighthouse scores with modern performance standards'
        }
      },
      {
        id: 'enterprise-solutions',
        year: 2025,
        title: 'Enterprise Solutions Architect',
        description: 'Full-stack leadership with proven business impact',
        significance: 'major',
        position: new THREE.Vector3(8, 0, 0),
        visualization: {
          nodeSize: 0.6,
          glowIntensity: 0.8,
          connectionStrength: 1.0,
          animationDelay: 2.5
        },
        achievement: {
          type: 'leadership',
          impact: 'Complete technical leadership with measurable business results',
          technologiesLearned: ['Enterprise Architecture', 'Business Strategy', 'Technical Leadership'],
          businessValue: 'Invoice Chaser: 25-40% payment time reduction, proven ROI'
        }
      }
    ],
    progressionCurve: [
      new THREE.Vector3(-8, 0, 0),
      new THREE.Vector3(-4, 1, 0),
      new THREE.Vector3(0, 2, 0),
      new THREE.Vector3(2, 1.5, 0),
      new THREE.Vector3(4, 0.5, 0),
      new THREE.Vector3(8, 0, 0)
    ],
    visualization: {
      type: '3d-timeline',
      complexity: 'enterprise'
    }
  },
  currentState: {
    proficiencyLevel: 9,
    activeProjects: ['Invoice Chaser', 'Portfolio Enhancement', 'Enterprise Consulting'],
    recentAchievements: ['Emmy Award', 'AI Implementation Pioneer', 'Enterprise Solutions Architect'],
    technologyMastery: []
  }
};

/**
 * Interactive milestone node component
 */
interface MilestoneNodeProps {
  milestone: Milestone3D;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
}

function MilestoneNode({ milestone, isHovered, isSelected, onHover, onSelect }: MilestoneNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localHovered, setLocalHovered] = useState(false);

  // Color based on achievement type
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'leadership': return '#ff6b35'; // Orange for leadership
      case 'innovation': return '#8a2be2'; // Purple for innovation
      case 'certification': return '#00d8ff'; // Cyan for certifications
      case 'project': return '#00ff88'; // Green for projects
      default: return '#ffffff';
    }
  };

  const nodeColor = getNodeColor(milestone.achievement.type);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle floating animation
      meshRef.current.position.y = milestone.position.y + Math.sin(time + milestone.visualization.animationDelay) * 0.1;
      
      // Scale based on interaction state
      const targetScale = isHovered || isSelected ? 1.3 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Rotation for visual interest
      meshRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group
      position={milestone.position}
      onPointerOver={() => {
        setLocalHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setLocalHovered(false);
        onHover(false);
      }}
      onClick={onSelect}
    >
      {/* Main milestone node */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[milestone.visualization.nodeSize, 16, 16]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={isHovered || isSelected ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Glow effect */}
      {(isHovered || isSelected) && (
        <Sphere args={[milestone.visualization.nodeSize * 2, 16, 16]}>
          <meshBasicMaterial
            color={nodeColor}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Year label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        {milestone.year}
      </Text>
      
      {/* Title on hover */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          outlineWidth={0.05}
          outlineColor="black"
        >
          {milestone.title}
        </Text>
      )}
    </group>
  );
}

/**
 * Timeline connection line
 */
function TimelineConnection({ points }: { points: THREE.Vector3[] }) {
  return (
    <Line
      points={points}
      color="#00ff88"
      lineWidth={3}
      transparent
      opacity={0.6}
    />
  );
}

/**
 * Main 3D timeline scene
 */
interface Timeline3DSceneProps {
  timelineData: SkillProgression3D;
  selectedMilestone: string | null;
  onMilestoneSelect: (milestoneId: string | null) => void;
  isMobile: boolean;
}

function Timeline3DScene({ timelineData, selectedMilestone, onMilestoneSelect, isMobile }: Timeline3DSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredMilestone, setHoveredMilestone] = useState<string | null>(null);

  // Auto-rotate the timeline gently
  useFrame((state) => {
    if (groupRef.current && !hoveredMilestone && !selectedMilestone) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 2, -5]} intensity={0.4} color="#00ff88" />
      
      {/* Timeline connection line */}
      <TimelineConnection points={timelineData.timeline.progressionCurve} />
      
      {/* Milestone nodes */}
      {timelineData.timeline.milestones.map((milestone) => (
        <MilestoneNode
          key={milestone.id}
          milestone={milestone}
          isHovered={hoveredMilestone === milestone.id}
          isSelected={selectedMilestone === milestone.id}
          onHover={(hovered) => {
            setHoveredMilestone(hovered ? milestone.id : null);
          }}
          onSelect={() => {
            onMilestoneSelect(selectedMilestone === milestone.id ? null : milestone.id);
          }}
        />
      ))}
      
      {/* Experience progression indicator */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        {timelineData.timespan.duration}
      </Text>
    </group>
  );
}

/**
 * Milestone detail panel
 */
interface MilestoneDetailProps {
  milestone: Milestone3D | null;
  onClose: () => void;
}

function MilestoneDetail({ milestone, onClose }: MilestoneDetailProps) {
  if (!milestone) return null;

  return (
    <div className={styles.milestoneDetail}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close milestone details">
        ×
      </button>
      
      <div className={styles.milestoneHeader}>
        <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
        <span className={styles.milestoneYear}>{milestone.year}</span>
      </div>
      
      <p className={styles.milestoneDescription}>{milestone.description}</p>
      
      <div className={styles.milestoneAchievement}>
        <h4>Impact & Business Value</h4>
        <p>{milestone.achievement.businessValue}</p>
        
        <h4>Technologies & Skills</h4>
        <div className={styles.technologyTags}>
          {milestone.achievement.technologiesLearned.map((tech, index) => (
            <span key={index} className={styles.technologyTag}>{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Main SkillProgressionTimeline3D component
 */
export interface SkillProgressionTimeline3DProps {
  className?: string;
  enableInteractions?: boolean;
  showControls?: boolean;
}

export default function SkillProgressionTimeline3D({
  className,
  enableInteractions = true,
  showControls = true
}: SkillProgressionTimeline3DProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize 3D capabilities and device detection
  useEffect(() => {
    const mobile = isMobileDevice();
    const webglSupported = isWebGLReady();
    
    setIsMobile(mobile);
    setIs3DEnabled(webglSupported && enableInteractions);
  }, [enableInteractions]);

  // Get selected milestone data
  const selectedMilestoneData = useMemo(() => {
    if (!selectedMilestone) return null;
    return timelineData.timeline.milestones.find(m => m.id === selectedMilestone) || null;
  }, [selectedMilestone]);

  // Handle milestone selection
  const handleMilestoneSelect = (milestoneId: string | null) => {
    setSelectedMilestone(milestoneId);
  };

  return (
    <div className={`${styles.timelineContainer} ${className || ''}`}>
      {/* Header */}
      <div className={styles.timelineHeader}>
        <h2 className={styles.timelineTitle}>{timelineData.title}</h2>
        <p className={styles.timelineSubtitle}>
          Interactive career progression from web developer to Enterprise Solutions Architect
        </p>
      </div>

      {/* 3D Timeline */}
      <div className={styles.timeline3D}>
        {is3DEnabled ? (
          <SceneErrorBoundary 
            fallback={
              <div className={styles.fallback}>
                <h3>Timeline View Unavailable</h3>
                <p>3D timeline requires WebGL support</p>
              </div>
            }
          >
            <Suspense fallback={<div className={styles.loading}>Loading 3D timeline...</div>}>
              <Canvas
                camera={{ 
                  position: isMobile ? [0, 2, 8] : [0, 3, 12], 
                  fov: 45 
                }}
                dpr={isMobile ? 1 : 2}
                performance={{ min: 0.5 }}
              >
                <Timeline3DScene
                  timelineData={timelineData}
                  selectedMilestone={selectedMilestone}
                  onMilestoneSelect={handleMilestoneSelect}
                  isMobile={isMobile}
                />
              </Canvas>
            </Suspense>
          </SceneErrorBoundary>
        ) : (
          <div className={styles.fallback2D}>
            <div className={styles.milestoneList}>
              {timelineData.timeline.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`${styles.milestone2D} ${selectedMilestone === milestone.id ? styles.selected : ''}`}
                  onClick={() => handleMilestoneSelect(milestone.id)}
                >
                  <span className={styles.milestoneYear2D}>{milestone.year}</span>
                  <h4 className={styles.milestoneTitle2D}>{milestone.title}</h4>
                  <p className={styles.milestoneDescription2D}>{milestone.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Milestone detail panel */}
      {selectedMilestoneData && (
        <MilestoneDetail
          milestone={selectedMilestoneData}
          onClose={() => setSelectedMilestone(null)}
        />
      )}

      {/* Controls */}
      {showControls && is3DEnabled && (
        <div className={styles.timelineControls}>
          <button
            className={styles.controlButton}
            onClick={() => setSelectedMilestone(null)}
          >
            Reset View
          </button>
          <span className={styles.controlHint}>
            Click milestones to explore • Drag to rotate
          </span>
        </div>
      )}
    </div>
  );
}
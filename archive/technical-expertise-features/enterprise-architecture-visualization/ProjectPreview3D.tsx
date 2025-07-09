/**
 * ProjectPreview3D Component - Phase 3.3 Week 3 Day 2
 * 
 * Purpose: Interactive 3D previews of Tyler's major portfolio projects with
 * architecture exploration, business impact visualization, and real-world demonstrations.
 * 
 * Features:
 * - 3D project architecture visualization
 * - Interactive business metrics with animated displays
 * - Technology stack exploration
 * - Direct links to live projects and case studies
 * - Mobile-optimized touch interactions
 */

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Line, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, isMobileDevice } from '../../lib/webgl-detection';
import { portfolioProjects3D } from '../../data/portfolioProjects3D';
import type { PortfolioProject3D, ProjectNode3D, BusinessMetric3D } from '../../data/portfolioProjects3D';
import styles from './ProjectPreview3D.module.css';

/**
 * Interactive project node component for architecture visualization
 */
interface ProjectNodeProps {
  node: ProjectNode3D;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
}

function ProjectNode({ node, isHovered, isSelected, onHover, onSelect }: ProjectNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localHovered, setLocalHovered] = useState(false);

  // Node styling based on type
  const getNodeStyle = (type: string) => {
    switch (type) {
      case 'frontend':
        return { color: '#61dafb', emissive: '#61dafb', metalness: 0.3, roughness: 0.7 };
      case 'backend':
        return { color: '#68a063', emissive: '#68a063', metalness: 0.4, roughness: 0.6 };
      case 'database':
        return { color: '#336791', emissive: '#336791', metalness: 0.5, roughness: 0.4 };
      case 'api':
        return { color: '#ff6b35', emissive: '#ff6b35', metalness: 0.4, roughness: 0.6 };
      case 'service':
        return { color: '#8b5cf6', emissive: '#8b5cf6', metalness: 0.3, roughness: 0.7 };
      case 'user':
        return { color: '#22c55e', emissive: '#22c55e', metalness: 0.2, roughness: 0.8 };
      default:
        return { color: '#ffffff', emissive: '#ffffff', metalness: 0.3, roughness: 0.7 };
    }
  };

  const nodeStyle = getNodeStyle(node.type);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle floating animation
      meshRef.current.position.y = node.position.y + Math.sin(time * 0.5 + node.position.x) * 0.05;
      
      // Scale based on interaction
      const targetScale = isHovered || isSelected ? node.size * 1.2 : node.size;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Subtle rotation for services
      if (node.type === 'service' || node.type === 'api') {
        meshRef.current.rotation.y = time * 0.2;
      }
    }
  });

  return (
    <group
      position={node.position}
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
      {/* Main node */}
      <mesh ref={meshRef}>
        <boxGeometry args={[node.size, node.size, node.size]} />
        <meshStandardMaterial
          color={nodeStyle.color}
          emissive={nodeStyle.emissive}
          emissiveIntensity={isHovered || isSelected ? 0.4 : 0.1}
          metalness={nodeStyle.metalness}
          roughness={nodeStyle.roughness}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Glow effect when hovered */}
      {(isHovered || isSelected) && (
        <Sphere args={[node.size * 1.5, 16, 16]}>
          <meshBasicMaterial
            color={nodeStyle.color}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      )}
      
      {/* Node label */}
      <Text
        position={[0, node.size * 0.7, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {node.label}
      </Text>
      
      {/* Detailed info on hover */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, -node.size * 0.8, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
          outlineWidth={0.03}
          outlineColor="black"
        >
          {node.details.technology}
        </Text>
      )}
    </group>
  );
}

/**
 * Business metric visualization component
 */
interface MetricVisualizationProps {
  metric: BusinessMetric3D;
  position: THREE.Vector3;
  isActive: boolean;
}

function MetricVisualization({ metric, position, isActive }: MetricVisualizationProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useFrame((state, delta) => {
    if (meshRef.current && isActive) {
      const time = state.clock.getElapsedTime();
      
      // Animate metric value
      const targetProgress = metric.visualization.targetValue / 100;
      setAnimationProgress(prev => Math.min(prev + delta * 0.5, targetProgress));
      
      // Animation based on type
      switch (metric.visualization.animationType) {
        case 'grow':
          meshRef.current.scale.y = 0.1 + animationProgress * 2;
          break;
        case 'pulse':
          meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
          break;
        case 'rotate':
          meshRef.current.rotation.y = time;
          break;
        case 'flow':
          meshRef.current.position.y = position.y + Math.sin(time) * 0.2;
          break;
      }
    }
  });

  return (
    <group position={position}>
      {/* Metric visualization */}
      <mesh ref={meshRef}>
        {metric.visualization.type === 'gauge' && (
          <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        )}
        {metric.visualization.type === 'counter' && (
          <boxGeometry args={[0.4, 0.4, 0.2]} />
        )}
        {metric.visualization.type === 'chart' && (
          <boxGeometry args={[0.6, 0.3, 0.1]} />
        )}
        {metric.visualization.type === 'graph' && (
          <sphereGeometry args={[0.2, 16, 16]} />
        )}
        <meshStandardMaterial
          color={metric.visualization.color}
          emissive={metric.visualization.color}
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>
      
      {/* Metric label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="black"
      >
        {metric.label}
      </Text>
      
      {/* Metric value */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.2}
        color={metric.visualization.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {metric.value}
      </Text>
    </group>
  );
}

/**
 * Architecture connections component
 */
function ArchitectureConnections({ nodes }: { nodes: ProjectNode3D[] }) {
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const targetNode = nodes.find(n => n.id === connectionId);
        if (targetNode) {
          lines.push({
            start: node.position,
            end: targetNode.position
          });
        }
      });
    });
    
    return lines;
  }, [nodes]);

  return (
    <>
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#00ff88"
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
    </>
  );
}

/**
 * Main project 3D scene
 */
interface Project3DSceneProps {
  project: PortfolioProject3D;
  selectedNode: string | null;
  onNodeSelect: (nodeId: string | null) => void;
  showMetrics: boolean;
}

function Project3DScene({ project, selectedNode, onNodeSelect, showMetrics }: Project3DSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Gentle scene rotation
  useFrame((state) => {
    if (groupRef.current && !hoveredNode && !selectedNode) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, -3]} intensity={0.5} color={project.branding.primaryColor} />
      
      {/* Project nodes */}
      {project.architecture.nodes.map((node) => (
        <ProjectNode
          key={node.id}
          node={node}
          isHovered={hoveredNode === node.id}
          isSelected={selectedNode === node.id}
          onHover={(hovered) => {
            setHoveredNode(hovered ? node.id : null);
          }}
          onSelect={() => {
            onNodeSelect(selectedNode === node.id ? null : node.id);
          }}
        />
      ))}
      
      {/* Architecture connections */}
      <ArchitectureConnections nodes={project.architecture.nodes} />
      
      {/* Business metrics */}
      {showMetrics && project.businessImpact.metrics.map((metric, index) => (
        <MetricVisualization
          key={metric.id}
          metric={metric}
          position={new THREE.Vector3(4, 2 - index * 0.8, 2)}
          isActive={true}
        />
      ))}
      
      {/* Project title */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.4}
        color={project.branding.primaryColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        {project.title}
      </Text>
    </group>
  );
}

/**
 * Node detail panel
 */
interface NodeDetailProps {
  node: ProjectNode3D | null;
  projectColor: string;
  onClose: () => void;
}

function NodeDetail({ node, projectColor, onClose }: NodeDetailProps) {
  if (!node) return null;

  return (
    <div className={styles.nodeDetail}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close node details">
        ×
      </button>
      
      <div className={styles.nodeHeader}>
        <h3 className={styles.nodeTitle}>{node.label}</h3>
        <span className={styles.nodeType} style={{ backgroundColor: projectColor }}>
          {node.type}
        </span>
      </div>
      
      <div className={styles.nodeInfo}>
        <h4>Technology</h4>
        <p>{node.details.technology}</p>
        
        <h4>Description</h4>
        <p>{node.details.description}</p>
        
        <h4>Business Value</h4>
        <p>{node.details.businessValue}</p>
        
        <h4>Implementation</h4>
        <p>{node.details.implementation}</p>
      </div>
    </div>
  );
}

/**
 * Main ProjectPreview3D component
 */
export interface ProjectPreview3DProps {
  projectId?: string;
  className?: string;
  enableInteractions?: boolean;
  showControls?: boolean;
  showMetrics?: boolean;
}

export default function ProjectPreview3D({
  projectId = 'invoice-chaser',
  className,
  enableInteractions = true,
  showControls = true,
  showMetrics = true
}: ProjectPreview3DProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState(projectId);
  const [is3DEnabled, setIs3DEnabled] = useState(false);

  // Get current project data
  const project = useMemo(() => {
    return portfolioProjects3D.find(p => p.id === currentProject) || portfolioProjects3D[0];
  }, [currentProject]);

  // Get selected node data
  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return project.architecture.nodes.find(n => n.id === selectedNode) || null;
  }, [selectedNode, project]);

  // Initialize 3D capabilities
  useEffect(() => {
    const webglSupported = isWebGLReady();
    setIs3DEnabled(webglSupported && enableInteractions);
  }, [enableInteractions]);

  return (
    <div className={`${styles.projectContainer} ${className || ''}`}>
      {/* Project selector */}
      {showControls && (
        <div className={styles.projectSelector}>
          <h3>Portfolio Projects</h3>
          <div className={styles.selectorButtons}>
            {portfolioProjects3D.map((proj) => (
              <button
                key={proj.id}
                className={`${styles.selectorButton} ${currentProject === proj.id ? styles.active : ''}`}
                onClick={() => {
                  setCurrentProject(proj.id);
                  setSelectedNode(null);
                }}
                style={{
                  borderColor: currentProject === proj.id ? proj.branding.primaryColor : undefined
                }}
              >
                {proj.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3D Visualization */}
      <div className={styles.visualization3D}>
        {is3DEnabled ? (
          <SceneErrorBoundary fallback={<div className={styles.fallback}>3D visualization unavailable</div>}>
            <Suspense fallback={<div className={styles.loading}>Loading project visualization...</div>}>
              <Canvas
                camera={{ position: [0, 2, 8], fov: 45 }}
                dpr={isMobileDevice() ? 1 : 2}
                performance={{ min: 0.5 }}
              >
                <Project3DScene
                  project={project}
                  selectedNode={selectedNode}
                  onNodeSelect={setSelectedNode}
                  showMetrics={showMetrics}
                />
                <OrbitControls
                  enablePan={false}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={15}
                  minDistance={5}
                />
              </Canvas>
            </Suspense>
          </SceneErrorBoundary>
        ) : (
          <div className={styles.fallback2D}>
            <h4>{project.title}</h4>
            <p>{project.description}</p>
            <div className={styles.nodeList}>
              {project.architecture.nodes.map((node) => (
                <div
                  key={node.id}
                  className={`${styles.node2D} ${selectedNode === node.id ? styles.selected : ''}`}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <h5>{node.label}</h5>
                  <p>{node.details.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Node detail panel */}
      {selectedNodeData && (
        <NodeDetail
          node={selectedNodeData}
          projectColor={project.branding.primaryColor}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Project info */}
      <div className={styles.projectInfo}>
        <div className={styles.projectHeader}>
          <h4>{project.title}</h4>
          <span className={styles.projectStatus} style={{ backgroundColor: project.branding.primaryColor }}>
            {project.status}
          </span>
        </div>
        
        <p className={styles.projectDescription}>{project.description}</p>
        
        <div className={styles.projectLinks}>
          {project.links.live && (
            <a href={project.links.live} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
              View Live
            </a>
          )}
          {project.links.caseStudy && (
            <a href={project.links.caseStudy} className={styles.projectLink}>
              Case Study
            </a>
          )}
          {project.links.demo && (
            <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
              Demo
            </a>
          )}
        </div>

        {showMetrics && (
          <div className={styles.businessMetrics}>
            <h5>Business Impact</h5>
            <div className={styles.metricsList}>
              {project.businessImpact.metrics.map((metric) => (
                <div key={metric.id} className={styles.metricCard}>
                  <span className={styles.metricValue} style={{ color: metric.visualization.color }}>
                    {metric.value}
                  </span>
                  <span className={styles.metricLabel}>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
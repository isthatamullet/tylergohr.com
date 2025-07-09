/**
 * ProjectArchitecture3D Component - Phase 3.3 Week 3 Day 2
 * 
 * Purpose: Detailed 3D architecture exploration for Tyler's portfolio projects
 * with system integrations, performance insights, and technical deep dives.
 * 
 * Features:
 * - Interactive system architecture diagrams
 * - Data flow visualization with real-time animations
 * - Performance bottleneck identification
 * - Scalability demonstration
 * - Technology integration mapping
 * - Code example integration
 */

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Line, Float, OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, isMobileDevice } from '../../lib/webgl-detection';
import { portfolioProjects3D } from '../../data/portfolioProjects3D';
import type { PortfolioProject3D, ProjectNode3D } from '../../data/portfolioProjects3D';
import styles from './ProjectArchitecture3D.module.css';

/**
 * Enhanced architecture data with performance and scalability insights
 */
interface ArchitectureInsight {
  id: string;
  title: string;
  type: 'performance' | 'scalability' | 'security' | 'integration';
  description: string;
  metrics: {
    current: string;
    target: string;
    improvement: string;
  };
  position: THREE.Vector3;
  connections: string[];
}

interface DataFlow {
  id: string;
  from: string;
  to: string;
  label: string;
  type: 'request' | 'response' | 'data' | 'event';
  volume: 'low' | 'medium' | 'high';
  latency: string;
  animation: {
    speed: number;
    color: string;
    opacity: number;
  };
}

/**
 * Get architecture insights for each project
 */
const getArchitectureInsights = (project: PortfolioProject3D): ArchitectureInsight[] => {
  switch (project.id) {
    case 'invoice-chaser':
      return [
        {
          id: 'api-performance',
          title: 'API Response Time',
          type: 'performance',
          description: 'RESTful API optimized for <300ms response times with intelligent caching',
          metrics: { current: '< 300ms', target: '< 200ms', improvement: '25%' },
          position: new THREE.Vector3(1, 3, 1),
          connections: ['api-gateway']
        },
        {
          id: 'database-scalability',
          title: 'Database Scaling',
          type: 'scalability',
          description: 'PostgreSQL with connection pooling supporting 1000+ concurrent operations',
          metrics: { current: '1000 ops/sec', target: '2500 ops/sec', improvement: '150%' },
          position: new THREE.Vector3(-1, -2, 1),
          connections: ['database']
        },
        {
          id: 'integration-security',
          title: 'API Security',
          type: 'security',
          description: 'OAuth 2.0 integration with QuickBooks and Stripe for financial data protection',
          metrics: { current: '99.9% uptime', target: '99.99% uptime', improvement: '10x' },
          position: new THREE.Vector3(3, -0.5, 1),
          connections: ['quickbooks-api', 'stripe-api']
        }
      ];
    case 'portfolio-website':
      return [
        {
          id: 'rendering-performance',
          title: 'Rendering Performance',
          type: 'performance',
          description: 'Next.js SSR with React 18 features achieving 90+ Lighthouse scores',
          metrics: { current: '90+ score', target: '95+ score', improvement: '15%' },
          position: new THREE.Vector3(0, 3, 1),
          connections: ['nextjs-app']
        },
        {
          id: 'webgl-optimization',
          title: 'WebGL Optimization',
          type: 'performance',
          description: '3D rendering with progressive enhancement and mobile fallbacks',
          metrics: { current: '60 FPS', target: '60 FPS', improvement: 'Optimized' },
          position: new THREE.Vector3(-2, 0, 1),
          connections: ['webgl-graphics']
        }
      ];
    default:
      return [];
  }
};

/**
 * Get data flow patterns for each project
 */
const getDataFlows = (project: PortfolioProject3D): DataFlow[] => {
  const flows: DataFlow[] = [];
  
  project.architecture.nodes.forEach(node => {
    node.connections.forEach(connectionId => {
      flows.push({
        id: `${node.id}-${connectionId}`,
        from: node.id,
        to: connectionId,
        label: `${node.label} → ${connectionId}`,
        type: 'data',
        volume: 'medium',
        latency: '< 100ms',
        animation: {
          speed: 1.0,
          color: '#00ff88',
          opacity: 0.7
        }
      });
    });
  });
  
  return flows;
};

/**
 * Animated data flow component
 */
interface DataFlowVisualizationProps {
  flows: DataFlow[];
  nodes: ProjectNode3D[];
  isActive: boolean;
}

function DataFlowVisualization({ flows, nodes, isActive }: DataFlowVisualizationProps) {
  const flowRefs = useRef<{ [key: string]: THREE.Group }>({});
  
  useFrame((state) => {
    if (!isActive) return;
    
    const time = state.clock.getElapsedTime();
    
    flows.forEach(flow => {
      const flowGroup = flowRefs.current[flow.id];
      if (flowGroup) {
        // Animate data packets along the flow
        const progress = (time * flow.animation.speed) % 1;
        const fromNode = nodes.find(n => n.id === flow.from);
        const toNode = nodes.find(n => n.id === flow.to);
        
        if (fromNode && toNode) {
          const position = new THREE.Vector3().lerpVectors(fromNode.position, toNode.position, progress);
          flowGroup.position.copy(position);
        }
      }
    });
  });

  return (
    <group>
      {flows.map(flow => {
        const fromNode = nodes.find(n => n.id === flow.from);
        const toNode = nodes.find(n => n.id === flow.to);
        
        if (!fromNode || !toNode) return null;
        
        return (
          <group key={flow.id}>
            {/* Flow line */}
            <Line
              points={[fromNode.position, toNode.position]}
              color={flow.animation.color}
              lineWidth={2}
              transparent
              opacity={flow.animation.opacity * 0.5}
            />
            
            {/* Animated data packet */}
            <group
              ref={(ref) => {
                if (ref) flowRefs.current[flow.id] = ref;
              }}
            >
              <Sphere args={[0.05, 8, 8]}>
                <meshBasicMaterial
                  color={flow.animation.color}
                  transparent
                  opacity={flow.animation.opacity}
                />
              </Sphere>
            </group>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Architecture insight visualization
 */
interface InsightNodeProps {
  insight: ArchitectureInsight;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
}

function InsightNode({ insight, isHovered, isSelected, onHover, onSelect }: InsightNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Color based on insight type
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'performance': return '#ff6b35';
      case 'scalability': return '#3b82f6';
      case 'security': return '#ef4444';
      case 'integration': return '#8b5cf6';
      default: return '#ffffff';
    }
  };

  const insightColor = getInsightColor(insight.type);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Floating animation
      meshRef.current.position.y = insight.position.y + Math.sin(time * 2 + insight.position.x) * 0.1;
      
      // Scale on interaction
      const targetScale = isHovered || isSelected ? 1.2 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Pulsing effect
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.2 + Math.sin(time * 3) * 0.1;
    }
  });

  return (
    <group
      position={insight.position}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      onClick={onSelect}
    >
      {/* Insight node */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial
          color={insightColor}
          emissive={insightColor}
          emissiveIntensity={isHovered || isSelected ? 0.5 : 0.2}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="black"
      >
        {insight.title}
      </Text>
      
      {/* Metrics on hover */}
      {(isHovered || isSelected) && (
        <Html position={[0, -0.8, 0]} center>
          <div className={styles.insightTooltip}>
            <div className={styles.insightMetric}>
              Current: <span>{insight.metrics.current}</span>
            </div>
            <div className={styles.insightMetric}>
              Target: <span>{insight.metrics.target}</span>
            </div>
            <div className={styles.insightMetric}>
              Improvement: <span>{insight.metrics.improvement}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * Enhanced project node with performance indicators
 */
interface EnhancedProjectNodeProps {
  node: ProjectNode3D;
  insights: ArchitectureInsight[];
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
}

function EnhancedProjectNode({ node, insights, isHovered, isSelected, onHover, onSelect }: EnhancedProjectNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Check if this node has performance insights
  const hasInsights = insights.some(insight => insight.connections.includes(node.id));
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Floating animation
      meshRef.current.position.y = node.position.y + Math.sin(time * 0.5 + node.position.x) * 0.05;
      
      // Scale based on interaction
      const targetScale = isHovered || isSelected ? node.size * 1.3 : node.size;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Performance indicator glow
      if (hasInsights) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(time * 2) * 0.1;
      }
    }
  });

  return (
    <group
      position={node.position}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
      onClick={onSelect}
    >
      {/* Main node */}
      <mesh ref={meshRef}>
        <boxGeometry args={[node.size, node.size, node.size]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hasInsights ? 0.4 : 0.1}
          metalness={0.4}
          roughness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Performance indicator */}
      {hasInsights && (
        <Sphere args={[node.size * 0.3, 8, 8]} position={[node.size * 0.7, node.size * 0.7, 0]}>
          <meshBasicMaterial
            color="#ff6b35"
            transparent
            opacity={0.8}
          />
        </Sphere>
      )}
      
      {/* Node label */}
      <Text
        position={[0, node.size * 0.8, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {node.label}
      </Text>
    </group>
  );
}

/**
 * Main architecture 3D scene
 */
interface Architecture3DSceneProps {
  project: PortfolioProject3D;
  selectedNode: string | null;
  selectedInsight: string | null;
  showDataFlow: boolean;
  onNodeSelect: (nodeId: string | null) => void;
  onInsightSelect: (insightId: string | null) => void;
}

function Architecture3DScene({ 
  project, 
  selectedNode, 
  selectedInsight, 
  showDataFlow,
  onNodeSelect, 
  onInsightSelect 
}: Architecture3DSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredInsight, setHoveredInsight] = useState<string | null>(null);
  
  const insights = useMemo(() => getArchitectureInsights(project), [project]);
  const dataFlows = useMemo(() => getDataFlows(project), [project]);

  // Gentle scene rotation
  useFrame((state) => {
    if (groupRef.current && !hoveredNode && !selectedNode && !hoveredInsight && !selectedInsight) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Enhanced lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[8, 8, 8]} intensity={1.0} />
      <pointLight position={[-5, 5, -5]} intensity={0.6} color={project.branding.primaryColor} />
      <pointLight position={[0, -5, 5]} intensity={0.4} color="#00ff88" />
      
      {/* Enhanced project nodes */}
      {project.architecture.nodes.map((node) => (
        <EnhancedProjectNode
          key={node.id}
          node={node}
          insights={insights}
          isHovered={hoveredNode === node.id}
          isSelected={selectedNode === node.id}
          onHover={(hovered) => setHoveredNode(hovered ? node.id : null)}
          onSelect={() => onNodeSelect(selectedNode === node.id ? null : node.id)}
        />
      ))}
      
      {/* Architecture insights */}
      {insights.map((insight) => (
        <InsightNode
          key={insight.id}
          insight={insight}
          isHovered={hoveredInsight === insight.id}
          isSelected={selectedInsight === insight.id}
          onHover={(hovered) => setHoveredInsight(hovered ? insight.id : null)}
          onSelect={() => onInsightSelect(selectedInsight === insight.id ? null : insight.id)}
        />
      ))}
      
      {/* Data flow visualization */}
      {showDataFlow && (
        <DataFlowVisualization
          flows={dataFlows}
          nodes={project.architecture.nodes}
          isActive={showDataFlow}
        />
      )}
      
      {/* Architecture title */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color={project.branding.primaryColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        {project.title} Architecture
      </Text>
      
      {/* Complexity indicator */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        Complexity: {project.architecture.complexity.toUpperCase()}
      </Text>
    </group>
  );
}

/**
 * Architecture insight detail panel
 */
interface InsightDetailProps {
  insight: ArchitectureInsight | null;
  onClose: () => void;
}

function InsightDetail({ insight, onClose }: InsightDetailProps) {
  if (!insight) return null;

  return (
    <div className={styles.insightDetail}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close insight details">
        ×
      </button>
      
      <div className={styles.insightHeader}>
        <h3 className={styles.insightTitle}>{insight.title}</h3>
        <span className={`${styles.insightType} ${styles[insight.type]}`}>
          {insight.type}
        </span>
      </div>
      
      <p className={styles.insightDescription}>{insight.description}</p>
      
      <div className={styles.insightMetrics}>
        <h4>Performance Metrics</h4>
        <div className={styles.metricRow}>
          <span>Current:</span>
          <span className={styles.metricValue}>{insight.metrics.current}</span>
        </div>
        <div className={styles.metricRow}>
          <span>Target:</span>
          <span className={styles.metricValue}>{insight.metrics.target}</span>
        </div>
        <div className={styles.metricRow}>
          <span>Improvement:</span>
          <span className={styles.metricValue}>{insight.metrics.improvement}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Main ProjectArchitecture3D component
 */
export interface ProjectArchitecture3DProps {
  projectId?: string;
  className?: string;
  enableInteractions?: boolean;
  showControls?: boolean;
}

export default function ProjectArchitecture3D({
  projectId = 'invoice-chaser',
  className,
  enableInteractions = true,
  showControls = true
}: ProjectArchitecture3DProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState(projectId);
  const [showDataFlow, setShowDataFlow] = useState(false);
  const [is3DEnabled, setIs3DEnabled] = useState(false);

  // Get current project data
  const project = useMemo(() => {
    return portfolioProjects3D.find(p => p.id === currentProject) || portfolioProjects3D[0];
  }, [currentProject]);

  const insights = useMemo(() => getArchitectureInsights(project), [project]);
  
  // Get selected insight data
  const selectedInsightData = useMemo(() => {
    if (!selectedInsight) return null;
    return insights.find(i => i.id === selectedInsight) || null;
  }, [selectedInsight, insights]);

  // Initialize 3D capabilities
  useEffect(() => {
    const webglSupported = isWebGLReady();
    setIs3DEnabled(webglSupported && enableInteractions);
  }, [enableInteractions]);

  return (
    <div className={`${styles.architectureContainer} ${className || ''}`}>
      {/* Architecture controls */}
      {showControls && (
        <div className={styles.architectureControls}>
          <div className={styles.projectSelector}>
            <h3>Project Architecture</h3>
            <div className={styles.selectorButtons}>
              {portfolioProjects3D.map((proj) => (
                <button
                  key={proj.id}
                  className={`${styles.selectorButton} ${currentProject === proj.id ? styles.active : ''}`}
                  onClick={() => {
                    setCurrentProject(proj.id);
                    setSelectedNode(null);
                    setSelectedInsight(null);
                  }}
                >
                  {proj.title}
                </button>
              ))}
            </div>
          </div>
          
          <div className={styles.viewControls}>
            <button
              className={`${styles.controlButton} ${showDataFlow ? styles.active : ''}`}
              onClick={() => setShowDataFlow(!showDataFlow)}
            >
              {showDataFlow ? 'Hide' : 'Show'} Data Flow
            </button>
            <button
              className={styles.controlButton}
              onClick={() => {
                setSelectedNode(null);
                setSelectedInsight(null);
              }}
            >
              Reset View
            </button>
          </div>
        </div>
      )}

      {/* 3D Architecture Visualization */}
      <div className={styles.visualization3D}>
        {is3DEnabled ? (
          <SceneErrorBoundary fallback={<div className={styles.fallback}>Architecture visualization unavailable</div>}>
            <Suspense fallback={<div className={styles.loading}>Loading architecture...</div>}>
              <Canvas
                camera={{ position: [0, 3, 10], fov: 50 }}
                dpr={isMobileDevice() ? 1 : 2}
                performance={{ min: 0.5 }}
              >
                <Architecture3DScene
                  project={project}
                  selectedNode={selectedNode}
                  selectedInsight={selectedInsight}
                  showDataFlow={showDataFlow}
                  onNodeSelect={setSelectedNode}
                  onInsightSelect={setSelectedInsight}
                />
                <OrbitControls
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  maxDistance={20}
                  minDistance={5}
                />
              </Canvas>
            </Suspense>
          </SceneErrorBoundary>
        ) : (
          <div className={styles.fallback2D}>
            <h4>{project.title} Architecture</h4>
            <p>{project.architecture.overview}</p>
            <div className={styles.architectureInfo}>
              <strong>Complexity:</strong> {project.architecture.complexity}
            </div>
          </div>
        )}
      </div>

      {/* Insight detail panel */}
      {selectedInsightData && (
        <InsightDetail
          insight={selectedInsightData}
          onClose={() => setSelectedInsight(null)}
        />
      )}

      {/* Architecture summary */}
      <div className={styles.architectureSummary}>
        <h4>Architecture Overview</h4>
        <p>{project.architecture.overview}</p>
        
        <div className={styles.performanceTargets}>
          <h5>Performance Targets</h5>
          <div className={styles.targetsList}>
            <div className={styles.targetItem}>
              <span>Load Time:</span>
              <span>{project.architecture.performanceTargets.loadTime}</span>
            </div>
            <div className={styles.targetItem}>
              <span>Uptime:</span>
              <span>{project.architecture.performanceTargets.uptime}</span>
            </div>
            <div className={styles.targetItem}>
              <span>Response Time:</span>
              <span>{project.architecture.performanceTargets.responseTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
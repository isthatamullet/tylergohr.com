/**
 * ScrollEnhancedArchitectureDiagram Component - Phase 3.2 Day 2
 * 
 * Purpose: Enhanced version of InteractiveArchitectureDiagram with integrated
 * scroll-triggered animations and camera movements while maintaining full
 * backward compatibility with existing functionality.
 * 
 * Features:
 * - All original InteractiveArchitectureDiagram functionality preserved
 * - Scroll-triggered camera movements and node animations
 * - Smooth transitions between manual and scroll control
 * - Section-based storytelling through architecture layers
 * - Performance-optimized for 60fps with scroll effects
 * - Progressive enhancement based on device capabilities
 */

'use client';

import React, { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, getWebGLConfig, isMobileDevice } from '../../lib/webgl-detection';
import { ScrollTriggered3DProvider, useScrollNodeAnimation } from './ScrollTriggered3D';
import { ScrollOrbitControls } from './ScrollCameraController';
import { ArchitectureScrollSectionsProvider, useArchitectureScrollSections } from './ArchitectureScrollSections';
import styles from './InteractiveArchitectureDiagram.module.css';

/**
 * Architecture Node Data Structure (imported from original)
 */
interface ArchitectureNode {
  id: string;
  label: string;
  type: 'frontend' | 'backend' | 'database' | 'cloud' | 'integration' | 'user';
  position: THREE.Vector3;
  technologies: string[];
  description: string;
  connections: string[]; // IDs of connected nodes
  businessValue: string;
  size: number;
  priority: 'primary' | 'secondary' | 'tertiary';
}

/**
 * Diagram configuration based on device capabilities (from original)
 */
interface DiagramConfig {
  nodeCount: number;
  connectionDistance: number;
  animationSpeed: number;
  interactionRadius: number;
  cameraDistance: number;
}

/**
 * Mouse/interaction state (from original)
 */
interface InteractionState {
  hoveredNode: string | null;
  selectedNode: string | null;
  mousePosition: THREE.Vector3;
  isActive: boolean;
}

/**
 * Get performance-appropriate diagram configuration (from original)
 */
function getDiagramConfig(): DiagramConfig {
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    return {
      nodeCount: 8,
      connectionDistance: 6,
      animationSpeed: 0.3,
      interactionRadius: 2,
      cameraDistance: 15
    };
  }
  
  return {
    nodeCount: 12,
    connectionDistance: 8,
    animationSpeed: 0.5,
    interactionRadius: 1.5,
    cameraDistance: 20
  };
}

/**
 * Enterprise Architecture Data (from original)
 */
function getArchitectureData(): ArchitectureNode[] {
  return [
    // Frontend Layer
    {
      id: 'react-frontend',
      label: 'React Frontend',
      type: 'frontend',
      position: new THREE.Vector3(-6, 4, 0),
      technologies: ['React 19', 'Next.js 14', 'TypeScript', 'Framer Motion'],
      description: 'Modern React application with advanced state management and animations',
      connections: ['api-gateway', 'cdn-assets'],
      businessValue: 'Enhanced user experience and engagement',
      size: 1.2,
      priority: 'primary'
    },
    {
      id: 'mobile-app',
      label: 'Mobile App',
      type: 'frontend',
      position: new THREE.Vector3(-6, 1, -2),
      technologies: ['React Native', 'Expo', 'Native Modules'],
      description: 'Cross-platform mobile application with native performance',
      connections: ['api-gateway'],
      businessValue: 'Cross-platform reach with native performance',
      size: 1.0,
      priority: 'secondary'
    },

    // API Layer
    {
      id: 'api-gateway',
      label: 'API Gateway',
      type: 'backend',
      position: new THREE.Vector3(0, 2, 0),
      technologies: ['Node.js', 'Express', 'JWT', 'Rate Limiting'],
      description: 'Centralized API gateway with authentication and rate limiting',
      connections: ['microservice-auth', 'microservice-data', 'redis-cache'],
      businessValue: 'Secure, scalable API management',
      size: 1.4,
      priority: 'primary'
    },
    {
      id: 'microservice-auth',
      label: 'Auth Service',
      type: 'backend',
      position: new THREE.Vector3(2, 4, 1),
      technologies: ['Node.js', 'OAuth 2.0', 'JWT', 'BCrypt'],
      description: 'Authentication and authorization microservice',
      connections: ['user-database', 'redis-cache'],
      businessValue: 'Secure user authentication and access control',
      size: 1.1,
      priority: 'secondary'
    },
    {
      id: 'microservice-data',
      label: 'Data Service',
      type: 'backend',
      position: new THREE.Vector3(2, 0, 1),
      technologies: ['Node.js', 'Prisma ORM', 'GraphQL', 'Data Validation'],
      description: 'Data processing and business logic microservice',
      connections: ['main-database', 'analytics-db'],
      businessValue: 'Efficient data processing and business logic',
      size: 1.1,
      priority: 'secondary'
    },

    // Database Layer
    {
      id: 'main-database',
      label: 'PostgreSQL',
      type: 'database',
      position: new THREE.Vector3(6, 0, 0),
      technologies: ['PostgreSQL 15', 'Connection Pooling', 'Replication'],
      description: 'Primary relational database with high availability',
      connections: ['backup-storage'],
      businessValue: 'Reliable data persistence and ACID compliance',
      size: 1.3,
      priority: 'primary'
    },
    {
      id: 'user-database',
      label: 'User DB',
      type: 'database',
      position: new THREE.Vector3(6, 3, 1),
      technologies: ['PostgreSQL', 'Encryption', 'GDPR Compliance'],
      description: 'Dedicated user data database with encryption',
      connections: ['backup-storage'],
      businessValue: 'Secure user data management and compliance',
      size: 1.0,
      priority: 'secondary'
    },
    {
      id: 'redis-cache',
      label: 'Redis Cache',
      type: 'database',
      position: new THREE.Vector3(4, 2, -1),
      technologies: ['Redis', 'Session Storage', 'Pub/Sub'],
      description: 'High-performance caching and session management',
      connections: [],
      businessValue: 'Improved performance and session management',
      size: 0.9,
      priority: 'tertiary'
    },

    // Cloud Infrastructure
    {
      id: 'cloud-run',
      label: 'Google Cloud Run',
      type: 'cloud',
      position: new THREE.Vector3(0, -2, 2),
      technologies: ['Docker', 'Auto-scaling', 'Load Balancing'],
      description: 'Serverless container platform with auto-scaling',
      connections: ['cdn-assets', 'monitoring'],
      businessValue: 'Scalable, cost-effective infrastructure',
      size: 1.2,
      priority: 'primary'
    },
    {
      id: 'cdn-assets',
      label: 'CDN',
      type: 'cloud',
      position: new THREE.Vector3(-3, -1, 2),
      technologies: ['Google Cloud CDN', 'Edge Caching', 'Compression'],
      description: 'Content delivery network for global performance',
      connections: [],
      businessValue: 'Fast global content delivery',
      size: 0.8,
      priority: 'tertiary'
    },

    // Monitoring & Analytics
    {
      id: 'monitoring',
      label: 'Monitoring',
      type: 'integration',
      position: new THREE.Vector3(3, -2, -1),
      technologies: ['Prometheus', 'Grafana', 'Error Tracking'],
      description: 'Application performance monitoring and alerting',
      connections: ['analytics-db'],
      businessValue: 'Proactive issue detection and resolution',
      size: 0.9,
      priority: 'tertiary'
    },
    {
      id: 'analytics-db',
      label: 'Analytics',
      type: 'database',
      position: new THREE.Vector3(6, -2, -1),
      technologies: ['BigQuery', 'Data Pipeline', 'Real-time Analytics'],
      description: 'Business intelligence and analytics platform',
      connections: [],
      businessValue: 'Data-driven business insights',
      size: 1.0,
      priority: 'secondary'
    },
    
    // Additional nodes for consistency (these were referenced in connections)
    {
      id: 'backup-storage',
      label: 'Backup Storage',
      type: 'cloud',
      position: new THREE.Vector3(8, 1, -2),
      technologies: ['Cloud Storage', 'Automated Backups', 'Disaster Recovery'],
      description: 'Automated backup and disaster recovery system',
      connections: [],
      businessValue: 'Data protection and business continuity',
      size: 0.7,
      priority: 'tertiary'
    }
  ];
}

/**
 * Enhanced Architecture Node with Scroll Integration
 */
interface ScrollEnhancedNodeProps {
  node: ArchitectureNode;
  index: number;
  config: DiagramConfig;
  interactionState: InteractionState;
  onNodeHover: (nodeId: string | null) => void;
  onNodeClick: (nodeId: string) => void;
  focusNodes: string[];
}

function ScrollEnhancedArchitectureNode({ 
  node, 
  index, 
  config, 
  interactionState, 
  onNodeHover, 
  onNodeClick,
  focusNodes
}: ScrollEnhancedNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outlineRef = useRef<THREE.Mesh>(null);
  const basePosition = useMemo(() => node.position.clone(), [node.position]);
  
  // Integrate scroll animation
  const { shouldAnimate, transform } = useScrollNodeAnimation(node.id, {
    position: basePosition,
    rotation: new THREE.Euler(0, 0, 0),
    scale: node.size,
    opacity: 1.0
  });
  
  // Node visual properties
  const nodeProperties = useMemo(() => {
    const typeColors = {
      frontend: '#22c55e',
      backend: '#3b82f6',
      database: '#f59e0b',
      cloud: '#8b5cf6',
      integration: '#ef4444',
      user: '#10b981'
    };

    const priorityModifiers = {
      primary: { sizeMultiplier: 1.3, opacity: 0.9, pulseIntensity: 0.2 },
      secondary: { sizeMultiplier: 1.1, opacity: 0.8, pulseIntensity: 0.15 },
      tertiary: { sizeMultiplier: 0.9, opacity: 0.7, pulseIntensity: 0.1 }
    };

    const modifier = priorityModifiers[node.priority];
    
    // Check if this node is in focus
    const isFocused = focusNodes.length === 0 || focusNodes.includes(node.id);
    const focusOpacity = isFocused ? 1.0 : 0.3; // Dim non-focused nodes
    
    return {
      color: typeColors[node.type],
      size: node.size * modifier.sizeMultiplier,
      opacity: modifier.opacity * focusOpacity,
      pulseIntensity: modifier.pulseIntensity,
      isHovered: interactionState.hoveredNode === node.id,
      isSelected: interactionState.selectedNode === node.id,
      isFocused
    };
  }, [node.type, node.priority, node.size, interactionState, node.id, focusNodes]);

  // Animation frame with scroll integration
  useFrame((state) => {
    if (!meshRef.current || !outlineRef.current) return;
    
    const time = state.clock.elapsedTime;
    const mesh = meshRef.current;
    const outline = outlineRef.current;
    
    // Use scroll transform if available, otherwise fall back to original animation
    if (shouldAnimate && transform) {
      // Apply scroll-driven transformations
      mesh.position.copy(transform.position);
      mesh.rotation.copy(transform.rotation);
      mesh.scale.setScalar(transform.scale);
      
      // Apply scroll-based opacity
      if (mesh.material && 'opacity' in mesh.material) {
        (mesh.material as THREE.MeshLambertMaterial).opacity = transform.opacity * nodeProperties.opacity;
      }
    } else {
      // Original floating animation
      const timeOffset = index * 0.8;
      const floatY = Math.sin((time * config.animationSpeed) + timeOffset) * 0.1;
      const floatX = Math.cos((time * config.animationSpeed * 0.7) + timeOffset) * 0.05;
      
      mesh.position.x = basePosition.x + floatX;
      mesh.position.y = basePosition.y + floatY;
      mesh.position.z = basePosition.z;
    }
    
    // Sync outline position
    outline.position.copy(mesh.position);
    
    // Enhanced scaling for interaction states
    let targetScale = shouldAnimate && transform ? transform.scale : nodeProperties.size;
    
    if (nodeProperties.isSelected) {
      targetScale *= 1.3;
    } else if (nodeProperties.isHovered) {
      targetScale *= 1.15;
    }
    
    // Add subtle pulse animation
    const pulseScale = 1 + Math.sin(time * 2 + index * 0.8) * nodeProperties.pulseIntensity;
    const finalScale = targetScale * pulseScale;
    
    mesh.scale.setScalar(finalScale);
    outline.scale.setScalar(finalScale * 1.1);
    
    // Enhanced outline visibility based on focus and interaction
    outline.visible = nodeProperties.isHovered || nodeProperties.isSelected || nodeProperties.isFocused;
  });

  // Handle pointer events (same as original)
  const handlePointerOver = () => {
    onNodeHover(node.id);
  };

  const handlePointerOut = () => {
    onNodeHover(null);
  };

  const handleClick = () => {
    onNodeClick(node.id);
  };

  return (
    <group>
      {/* Selection/Hover Outline */}
      <mesh
        ref={outlineRef}
        position={node.position}
        visible={false}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={nodeProperties.isSelected ? "#ffffff" : "#10b981"}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Main Node */}
      <mesh
        ref={meshRef}
        position={node.position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshLambertMaterial
          color={nodeProperties.color}
          transparent
          opacity={nodeProperties.opacity}
        />
      </mesh>

      {/* Enhanced Node Labels */}
      {node.priority === 'primary' && (
        <group position={[node.position.x, node.position.y + 1.8, node.position.z]}>
          <Text
            fontSize={0.3}
            color={nodeProperties.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {node.label}
          </Text>
        </group>
      )}

      {/* Secondary node labels on hover or focus */}
      {node.priority === 'secondary' && (nodeProperties.isHovered || nodeProperties.isFocused) && (
        <group position={[node.position.x, node.position.y + 1.5, node.position.z]}>
          <Text
            fontSize={0.25}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {node.label}
          </Text>
        </group>
      )}
    </group>
  );
}

/**
 * Connection Lines Component (from original, with slight enhancement)
 */
interface ConnectionsProps {
  nodes: ArchitectureNode[];
  interactionState: InteractionState;
  focusNodes: string[];
}

function ArchitectureConnections({ nodes, interactionState, focusNodes }: ConnectionsProps) {
  const linesRef = useRef<THREE.LineSegments>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  
  // Create connection geometry
  const connectionData = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    
    nodes.forEach(node => {
      node.connections.forEach(connectionId => {
        const connectedNode = nodeMap.get(connectionId);
        if (connectedNode) {
          points.push(node.position, connectedNode.position);
        }
      });
    });
    
    return points;
  }, [nodes]);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(connectionData);
  }, [connectionData]);
  
  // Enhanced connection animation with focus highlighting
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    const baseOpacity = 0.3;
    const pulseIntensity = 0.1;
    
    // Highlight connections when nodes are selected or focused
    let finalOpacity = baseOpacity + Math.sin(time * 1.5) * pulseIntensity;
    
    if (interactionState.selectedNode || interactionState.hoveredNode) {
      finalOpacity = Math.min(0.8, finalOpacity + 0.3);
    }
    
    // Enhance opacity when focus nodes are active
    if (focusNodes.length > 0) {
      finalOpacity = Math.min(0.6, finalOpacity + 0.2);
    }
    
    materialRef.current.opacity = finalOpacity;
  });
  
  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color="#16a34a"
        transparent
        opacity={0.3}
      />
    </lineSegments>
  );
}

/**
 * Enhanced Architecture Scene with Scroll Integration
 */
interface ScrollEnhancedArchitectureSceneProps {
  webglConfig: {
    antialias: boolean;
    shadows: boolean;
    maxLights: number;
    pixelRatio: number;
  };
  onNodeSelect?: (node: ArchitectureNode | null) => void;
  onNodeHover?: (nodeId: string | null) => void;
}

function ScrollEnhancedArchitectureScene({ 
  webglConfig, 
  onNodeSelect, 
  onNodeHover 
}: ScrollEnhancedArchitectureSceneProps) {
  const config = useMemo(() => getDiagramConfig(), []);
  const nodes = useMemo(() => getArchitectureData(), []);
  const { getCurrentFocusNodes } = useArchitectureScrollSections();
  
  const [interactionState, setInteractionState] = useState<InteractionState>({
    hoveredNode: null,
    selectedNode: null,
    mousePosition: new THREE.Vector3(0, 0, 0),
    isActive: false
  });

  // Get current focus nodes from scroll sections
  const focusNodes = getCurrentFocusNodes();

  const handleNodeHover = (nodeId: string | null) => {
    setInteractionState(prev => ({ ...prev, hoveredNode: nodeId }));
    
    if (onNodeHover) {
      onNodeHover(nodeId);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    const newSelectedNode = interactionState.selectedNode === nodeId ? null : nodeId;
    setInteractionState(prev => ({ 
      ...prev, 
      selectedNode: newSelectedNode 
    }));
    
    if (onNodeSelect) {
      const selectedNodeData = newSelectedNode ? nodes.find(n => n.id === newSelectedNode) || null : null;
      onNodeSelect(selectedNodeData);
    }
  };

  // Enhanced lighting setup
  const lightingIntensity = useMemo(() => {
    if (webglConfig.maxLights >= 4) return { ambient: 0.4, point: 0.6, secondary: 0.3 };
    if (webglConfig.maxLights >= 2) return { ambient: 0.5, point: 0.5, secondary: 0.2 };
    return { ambient: 0.6, point: 0.4, secondary: 0.1 };
  }, [webglConfig.maxLights]);

  return (
    <>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={lightingIntensity.ambient} />
      <pointLight 
        position={[15, 15, 15]} 
        intensity={lightingIntensity.point}
        color="#ffffff"
      />
      <pointLight 
        position={[-10, -10, -10]} 
        intensity={lightingIntensity.secondary}
        color="#10b981"
      />
      
      {/* Enhanced Camera Controls with Scroll Integration */}
      <ScrollOrbitControls
        enableManualControl={true}
      />
      
      {/* Enhanced Architecture Nodes with Scroll Animation */}
      {nodes.map((node, index) => (
        <ScrollEnhancedArchitectureNode
          key={node.id}
          node={node}
          index={index}
          config={config}
          interactionState={interactionState}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          focusNodes={focusNodes}
        />
      ))}
      
      {/* Enhanced Connection Lines */}
      <ArchitectureConnections 
        nodes={nodes} 
        interactionState={interactionState}
        focusNodes={focusNodes}
      />
      
      {/* Interactive Event Handlers for Camera */}
      <mesh 
        visible={false}
        onPointerDown={() => {/* Camera interaction handled by OrbitControls */}}
        onPointerUp={() => {/* Camera interaction handled by OrbitControls */}}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

/**
 * Node Detail Panel (from original, unchanged)
 */
interface NodeDetailPanelProps {
  node: ArchitectureNode | null;
  onClose: () => void;
}

function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) return null;
  
  const nodeTypeInfo = {
    frontend: { icon: '⚛️', color: '#22c55e', label: 'Frontend Layer' },
    backend: { icon: '⚙️', color: '#3b82f6', label: 'Backend Layer' },
    database: { icon: '🗄️', color: '#f59e0b', label: 'Data Layer' },
    cloud: { icon: '☁️', color: '#8b5cf6', label: 'Cloud Infrastructure' },
    integration: { icon: '🔗', color: '#ef4444', label: 'Integration Layer' },
    user: { icon: '👥', color: '#10b981', label: 'User Layer' }
  };

  const typeInfo = nodeTypeInfo[node.type];
  
  return (
    <div className={styles.nodeDetailPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.nodeHeaderInfo}>
          <span className={styles.nodeIcon} style={{ color: typeInfo.color }}>
            {typeInfo.icon}
          </span>
          <div className={styles.nodeTitleGroup}>
            <h3 className={styles.nodeTitle}>{node.label}</h3>
            <span className={styles.nodeType}>{typeInfo.label}</span>
          </div>
        </div>
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Close details"
        >
          ×
        </button>
      </div>
      
      <div className={styles.panelContent}>
        <div className={styles.nodeDescription}>
          <p>{node.description}</p>
        </div>
        
        <div className={styles.nodeSection}>
          <h4>Technologies</h4>
          <div className={styles.techTags}>
            {node.technologies.map(tech => (
              <span key={tech} className={styles.techTag}>{tech}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.nodeSection}>
          <h4>Business Value</h4>
          <div className={styles.businessValueCard}>
            <p className={styles.businessValue}>{node.businessValue}</p>
          </div>
        </div>
        
        {node.connections.length > 0 && (
          <div className={styles.nodeSection}>
            <h4>Connected Systems ({node.connections.length})</h4>
            <div className={styles.connectionGrid}>
              {node.connections.map(connId => (
                <div key={connId} className={styles.connectionCard}>
                  <span className={styles.connectionIcon}>🔗</span>
                  <span className={styles.connectionName}>
                    {connId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.nodeSection}>
          <h4>System Priority</h4>
          <div className={styles.priorityBadge}>
            <span className={`${styles.priorityDot} ${styles[node.priority]}`}></span>
            <span className={styles.priorityLabel}>
              {node.priority.charAt(0).toUpperCase() + node.priority.slice(1)} Component
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Fallback 2D Architecture Diagram (from original, unchanged)
 */
function ArchitectureFallback() {
  return (
    <div className={styles.fallbackContainer}>
      <div className={styles.fallbackDiagram}>
        <h3 className={styles.fallbackTitle}>Enterprise Architecture</h3>
        <div className={styles.architectureLayers}>
          <div className={styles.layer}>
            <h4>Frontend Layer</h4>
            <p>React 19 • Next.js 14 • TypeScript • Framer Motion</p>
          </div>
          <div className={styles.layer}>
            <h4>API Gateway</h4>
            <p>Node.js • Express • JWT • Rate Limiting</p>
          </div>
          <div className={styles.layer}>
            <h4>Microservices</h4>
            <p>Auth Service • Data Service • Business Logic</p>
          </div>
          <div className={styles.layer}>
            <h4>Data Layer</h4>
            <p>PostgreSQL • Redis Cache • Analytics DB</p>
          </div>
          <div className={styles.layer}>
            <h4>Cloud Infrastructure</h4>
            <p>Google Cloud Run • CDN • Monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Main ScrollEnhancedInteractiveArchitectureDiagram Component
 */
export const ScrollEnhancedInteractiveArchitectureDiagram: React.FC = () => {
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
  
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ArchitectureNode | null>(null);
  const nodes = useMemo(() => getArchitectureData(), []);

  // Handle node selection
  const handleNodeSelect = (node: ArchitectureNode | null) => {
    setSelectedNode(node);
  };

  // Handle node hover
  const handleNodeHover = (nodeId: string | null) => {
    const hoveredNodeData = nodeId ? nodes.find(n => n.id === nodeId) || null : null;
    setHoveredNode(hoveredNodeData);
  };

  // Handle section changes
  const handleSectionChange = useCallback((section: { id: string } | null) => {
    // Optional: Handle section change events
    console.log('[ScrollEnhanced] Architecture section changed:', section?.id);
  }, []);

  // Handle focus node changes
  const handleFocusNodesChange = useCallback((nodeIds: string[]) => {
    // Optional: Handle focus node changes
    console.log('[ScrollEnhanced] Focus nodes changed:', nodeIds);
  }, []);

  // WebGL detection (same as original)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const performanceStart = performance.now();
        const isReady = isWebGLReady();
        const config = isReady ? getWebGLConfig() : null;
        const performanceEnd = performance.now();
        
        console.log(`[ScrollEnhanced Architecture Diagram] WebGL detection took ${(performanceEnd - performanceStart).toFixed(2)}ms`);
        
        setWebglState({
          isReady: isReady && config !== null,
          config,
          isLoading: false
        });
      } catch (error) {
        console.warn('WebGL detection failed for scroll-enhanced architecture diagram:', error);
        setWebglState({
          isReady: false,
          config: null,
          isLoading: false
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Performance monitoring (same as original)
  useEffect(() => {
    if (!webglState.isReady) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let monitoringActive = true;

    const monitorFrameRate = () => {
      if (!monitoringActive) return;
      
      frameCount++;
      const currentTime = performance.now();
      
      if (frameCount % 60 === 0) {
        const fps = 60000 / (currentTime - lastTime);
        
        if (fps < 30) {
          console.warn(`[ScrollEnhanced Architecture Diagram] Low frame rate detected: ${fps.toFixed(1)}fps`);
        }
        
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorFrameRate);
    };

    requestAnimationFrame(monitorFrameRate);

    return () => {
      monitoringActive = false;
    };
  }, [webglState.isReady]);

  // Memory management (same as original)
  useEffect(() => {
    return () => {
      if (webglState.isReady) {
        console.log('[ScrollEnhanced Architecture Diagram] Cleaning up 3D resources');
        setSelectedNode(null);
        setHoveredNode(null);
      }
    };
  }, [webglState.isReady]);

  // Show loading state
  if (webglState.isLoading) {
    return (
      <div className={styles.diagramContainer}>
        <div className={styles.loadingIndicator}>
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
          <div className={styles.loadingDot}></div>
        </div>
        <p className={styles.loadingText}>Loading scroll-enhanced 3D architecture diagram...</p>
      </div>
    );
  }

  // Show 2D fallback if WebGL not ready
  if (!webglState.isReady || !webglState.config) {
    return <ArchitectureFallback />;
  }

  return (
    <ArchitectureScrollSectionsProvider
      onSectionChange={handleSectionChange}
      onFocusNodesChange={handleFocusNodesChange}
    >
      <ScrollTriggered3DProvider
        sectionId="architecture"
        enableScrollAnimations={true}
      >
        <div className={styles.diagramContainer}>
          <div className={styles.canvasContainer}>
            <SceneErrorBoundary fallback={<ArchitectureFallback />}>
              <Canvas
                camera={{ 
                  position: [0, 0, getDiagramConfig().cameraDistance], 
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
                  gl.setClearColor('#1a1a1a', 0);
                }}
              >
                <ScrollEnhancedArchitectureScene 
                  webglConfig={webglState.config} 
                  onNodeSelect={handleNodeSelect}
                  onNodeHover={handleNodeHover}
                />
              </Canvas>
            </SceneErrorBoundary>
          </div>

          {/* Interactive Controls with Accessibility (same as original) */}
          <div className={styles.diagramControls} role="complementary" aria-label="Architecture diagram controls">
            <div className={styles.controlGroup}>
              <h4 className={styles.controlTitle}>Scroll-Enhanced Enterprise Architecture</h4>
              <p className={styles.controlDescription}>
                Scroll to explore • Click nodes for details • Drag to orbit • Scroll wheel to zoom
              </p>
              {hoveredNode && (
                <div className={styles.accessibilityInfo} aria-live="polite">
                  <span className={styles.srOnly}>Currently hovering:</span>
                  <strong>{hoveredNode.label}</strong> - {hoveredNode.type} layer
                </div>
              )}
            </div>
            
            <div className={styles.legendGroup}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.frontend}`}></div>
                <span>Frontend</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.backend}`}></div>
                <span>Backend</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.database}`}></div>
                <span>Database</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.cloud}`}></div>
                <span>Cloud</span>
              </div>
            </div>
          </div>
          
          {/* Node Detail Panel */}
          <NodeDetailPanel 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        </div>
      </ScrollTriggered3DProvider>
    </ArchitectureScrollSectionsProvider>
  );
};

export default ScrollEnhancedInteractiveArchitectureDiagram;
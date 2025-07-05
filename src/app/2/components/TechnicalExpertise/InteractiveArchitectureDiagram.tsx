/**
 * InteractiveArchitectureDiagram Component - Phase 3.1
 * 
 * Purpose: 3D interactive system architecture visualizations demonstrating
 * enterprise technical expertise through interactive node-link diagrams.
 * 
 * Features:
 * - 3D system architecture visualization with clickable nodes
 * - Camera controls for exploration (orbit, zoom, pan)
 * - Technology stack representations with hover details
 * - Enterprise system diagrams with real-world examples
 * - Progressive enhancement with 2D diagram fallback
 * - Performance optimized for 60fps desktop, 30fps mobile
 */

'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, getWebGLConfig, isMobileDevice } from '../../lib/webgl-detection';
import styles from './InteractiveArchitectureDiagram.module.css';

/**
 * Architecture Node Data Structure
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
 * Diagram configuration based on device capabilities
 */
interface DiagramConfig {
  nodeCount: number;
  connectionDistance: number;
  animationSpeed: number;
  interactionRadius: number;
  cameraDistance: number;
}

/**
 * Mouse/interaction state
 */
interface InteractionState {
  hoveredNode: string | null;
  selectedNode: string | null;
  mousePosition: THREE.Vector3;
  isActive: boolean;
}

/**
 * Get performance-appropriate diagram configuration
 */
function getDiagramConfig(): DiagramConfig {
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    return {
      nodeCount: 8,            // Reduced for mobile performance
      connectionDistance: 6,    // Closer connections
      animationSpeed: 0.3,     // Slower animations
      interactionRadius: 2,    // Larger touch targets
      cameraDistance: 15       // Closer camera for mobile
    };
  }
  
  return {
    nodeCount: 12,           // Full desktop node count
    connectionDistance: 8,    // Full connection distance
    animationSpeed: 0.5,     // Normal animation speed
    interactionRadius: 1.5,  // Precise mouse targeting
    cameraDistance: 20       // Optimal desktop viewing distance
  };
}

/**
 * Enterprise Architecture Data - Real-world systems
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
    }
  ];
}

/**
 * Individual Architecture Node Component
 */
interface ArchitectureNodeProps {
  node: ArchitectureNode;
  index: number;
  config: DiagramConfig;
  interactionState: InteractionState;
  onNodeHover: (nodeId: string | null) => void;
  onNodeClick: (nodeId: string) => void;
}

function ArchitectureNodeMesh({ 
  node, 
  index, 
  config, 
  interactionState, 
  onNodeHover, 
  onNodeClick 
}: ArchitectureNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outlineRef = useRef<THREE.Mesh>(null);
  const basePosition = useMemo(() => node.position.clone(), [node.position]);
  
  // Node visual properties based on type and priority
  const nodeProperties = useMemo(() => {
    const typeColors = {
      frontend: '#22c55e',    // Green - User-facing
      backend: '#3b82f6',     // Blue - Logic layer
      database: '#f59e0b',    // Orange - Data persistence
      cloud: '#8b5cf6',       // Purple - Infrastructure
      integration: '#ef4444', // Red - Monitoring/analytics
      user: '#10b981'         // Emerald - User endpoints
    };

    const priorityModifiers = {
      primary: { sizeMultiplier: 1.3, opacity: 0.9, pulseIntensity: 0.2 },
      secondary: { sizeMultiplier: 1.1, opacity: 0.8, pulseIntensity: 0.15 },
      tertiary: { sizeMultiplier: 0.9, opacity: 0.7, pulseIntensity: 0.1 }
    };

    const modifier = priorityModifiers[node.priority];
    
    return {
      color: typeColors[node.type],
      size: node.size * modifier.sizeMultiplier,
      opacity: modifier.opacity,
      pulseIntensity: modifier.pulseIntensity,
      isHovered: interactionState.hoveredNode === node.id,
      isSelected: interactionState.selectedNode === node.id
    };
  }, [node.type, node.priority, node.size, interactionState, node.id]);

  // Floating animation with interaction response
  useFrame((state) => {
    if (!meshRef.current || !outlineRef.current) return;
    
    const time = state.clock.elapsedTime;
    const mesh = meshRef.current;
    const outline = outlineRef.current;
    
    // Base floating motion
    const timeOffset = index * 0.8;
    const floatY = Math.sin((time * config.animationSpeed) + timeOffset) * 0.1;
    const floatX = Math.cos((time * config.animationSpeed * 0.7) + timeOffset) * 0.05;
    
    // Apply floating motion
    mesh.position.x = basePosition.x + floatX;
    mesh.position.y = basePosition.y + floatY;
    mesh.position.z = basePosition.z;
    
    // Sync outline position
    outline.position.copy(mesh.position);
    
    // Pulsing scale based on state
    let targetScale = nodeProperties.size;
    if (nodeProperties.isSelected) {
      targetScale *= 1.3; // Selected nodes are larger
    } else if (nodeProperties.isHovered) {
      targetScale *= 1.15; // Hovered nodes slightly larger
    }
    
    // Add subtle pulse animation
    const pulseScale = 1 + Math.sin(time * 2 + timeOffset) * nodeProperties.pulseIntensity;
    const finalScale = targetScale * pulseScale;
    
    mesh.scale.setScalar(finalScale);
    outline.scale.setScalar(finalScale * 1.1); // Outline slightly larger
    
    // Outline visibility based on interaction
    outline.visible = nodeProperties.isHovered || nodeProperties.isSelected;
  });

  // Handle pointer events
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

      {/* Enhanced Node Label with 3D Text for primary nodes */}
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

      {/* Secondary node labels on hover */}
      {node.priority === 'secondary' && nodeProperties.isHovered && (
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
 * Connection Lines Component
 */
interface ConnectionsProps {
  nodes: ArchitectureNode[];
  interactionState: InteractionState;
}

function ArchitectureConnections({ nodes, interactionState }: ConnectionsProps) {
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
  
  // Animate connection opacity
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const time = state.clock.elapsedTime;
    const baseOpacity = 0.3;
    const pulseIntensity = 0.1;
    
    // Highlight connections when nodes are selected
    let finalOpacity = baseOpacity + Math.sin(time * 1.5) * pulseIntensity;
    
    if (interactionState.selectedNode || interactionState.hoveredNode) {
      finalOpacity = Math.min(0.8, finalOpacity + 0.3);
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
 * Enhanced Camera Controls with OrbitControls
 */
interface CameraControlsProps {
  isAutoRotate?: boolean;
}

function EnhancedCameraControls({ isAutoRotate = true }: CameraControlsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  
  // Configure OrbitControls settings based on device capabilities
  const controlsConfig = useMemo(() => {
    const isMobile = isMobileDevice();
    const cameraDistance = isMobile ? 15 : 20; // Mobile vs desktop distance
    
    return {
      enablePan: !isMobile, // Disable pan on mobile for better UX
      enableZoom: true,
      enableRotate: true,
      autoRotate: isAutoRotate,
      autoRotateSpeed: 0.5, // Slow automatic rotation
      minDistance: cameraDistance * 0.5, // Allow zooming in
      maxDistance: cameraDistance * 2, // Limit zoom out
      maxPolarAngle: Math.PI * 0.8, // Prevent camera from going under the diagram
      minPolarAngle: Math.PI * 0.1, // Prevent camera from going directly above
      dampingFactor: 0.05, // Smooth camera movement
      enableDamping: true,
      zoomSpeed: isMobile ? 0.3 : 0.5, // Slower zoom on mobile
      rotateSpeed: isMobile ? 0.3 : 0.5, // Slower rotation on mobile
      panSpeed: 0.8,
      target: new THREE.Vector3(0, 0, 0) // Look at center of diagram
    };
  }, [isAutoRotate]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={controlsConfig.enablePan}
      enableZoom={controlsConfig.enableZoom}
      enableRotate={controlsConfig.enableRotate}
      autoRotate={controlsConfig.autoRotate}
      autoRotateSpeed={controlsConfig.autoRotateSpeed}
      minDistance={controlsConfig.minDistance}
      maxDistance={controlsConfig.maxDistance}
      maxPolarAngle={controlsConfig.maxPolarAngle}
      minPolarAngle={controlsConfig.minPolarAngle}
      dampingFactor={controlsConfig.dampingFactor}
      enableDamping={controlsConfig.enableDamping}
      zoomSpeed={controlsConfig.zoomSpeed}
      rotateSpeed={controlsConfig.rotateSpeed}
      panSpeed={controlsConfig.panSpeed}
      target={controlsConfig.target}
    />
  );
}

/**
 * Node Detail Panel (rendered outside Canvas)
 */
interface NodeDetailPanelProps {
  node: ArchitectureNode | null;
  onClose: () => void;
}

function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
  if (!node) return null;
  
  // Enhanced node type icons and colors
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
 * Main 3D Architecture Scene
 */
interface ArchitectureSceneProps {
  webglConfig: {
    antialias: boolean;
    shadows: boolean;
    maxLights: number;
    pixelRatio: number;
  };
}

function ArchitectureScene({ webglConfig, onNodeSelect, onNodeHover }: ArchitectureSceneProps & { 
  onNodeSelect?: (node: ArchitectureNode | null) => void;
  onNodeHover?: (nodeId: string | null) => void;
}) {
  const config = useMemo(() => getDiagramConfig(), []);
  const nodes = useMemo(() => getArchitectureData(), []);
  
  const [interactionState, setInteractionState] = useState<InteractionState>({
    hoveredNode: null,
    selectedNode: null,
    mousePosition: new THREE.Vector3(0, 0, 0),
    isActive: false
  });

  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const handleNodeHover = (nodeId: string | null) => {
    setInteractionState(prev => ({ ...prev, hoveredNode: nodeId }));
    
    // Notify parent component about node hover for accessibility
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
    
    // Notify parent component about node selection
    if (onNodeSelect) {
      const selectedNodeData = newSelectedNode ? nodes.find(n => n.id === newSelectedNode) || null : null;
      onNodeSelect(selectedNodeData);
    }
  };

  // Enhanced lighting setup for better 3D visualization
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
      
      {/* Enhanced Camera Controls with OrbitControls */}
      <EnhancedCameraControls 
        isAutoRotate={!isUserInteracting}
      />
      
      {/* Architecture Nodes */}
      {nodes.map((node, index) => (
        <ArchitectureNodeMesh
          key={node.id}
          node={node}
          index={index}
          config={config}
          interactionState={interactionState}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
        />
      ))}
      
      {/* Connection Lines */}
      <ArchitectureConnections 
        nodes={nodes} 
        interactionState={interactionState} 
      />
      
      {/* Interactive Event Handlers for Camera */}
      <mesh 
        visible={false}
        onPointerDown={() => setIsUserInteracting(true)}
        onPointerUp={() => setTimeout(() => setIsUserInteracting(false), 2000)}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

/**
 * Fallback 2D Architecture Diagram
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
 * Main InteractiveArchitectureDiagram Component
 */
export const InteractiveArchitectureDiagram: React.FC = () => {
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

  // Handle node selection from 3D scene
  const handleNodeSelect = (node: ArchitectureNode | null) => {
    setSelectedNode(node);
  };

  // Handle node hover for enhanced interaction feedback
  const handleNodeHover = (nodeId: string | null) => {
    const hoveredNodeData = nodeId ? nodes.find(n => n.id === nodeId) || null : null;
    setHoveredNode(hoveredNodeData);
  };

  // Client-only WebGL detection with performance monitoring
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const performanceStart = performance.now();
        const isReady = isWebGLReady();
        const config = isReady ? getWebGLConfig() : null;
        const performanceEnd = performance.now();
        
        // Log performance metrics for monitoring
        console.log(`[Architecture Diagram] WebGL detection took ${(performanceEnd - performanceStart).toFixed(2)}ms`);
        
        setWebglState({
          isReady: isReady && config !== null,
          config,
          isLoading: false
        });
      } catch (error) {
        console.warn('WebGL detection failed for architecture diagram:', error);
        setWebglState({
          isReady: false,
          config: null,
          isLoading: false
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Performance monitoring for frame rates
  useEffect(() => {
    if (!webglState.isReady) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let monitoringActive = true;

    const monitorFrameRate = () => {
      if (!monitoringActive) return;
      
      frameCount++;
      const currentTime = performance.now();
      
      // Check frame rate every 60 frames
      if (frameCount % 60 === 0) {
        const fps = 60000 / (currentTime - lastTime);
        
        // Warn if frame rate drops below 30fps
        if (fps < 30) {
          console.warn(`[Architecture Diagram] Low frame rate detected: ${fps.toFixed(1)}fps`);
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

  // Memory management and cleanup
  useEffect(() => {
    return () => {
      // Cleanup any remaining 3D resources
      if (webglState.isReady) {
        console.log('[Architecture Diagram] Cleaning up 3D resources');
        
        // The Three.js cleanup will be handled by the Canvas component
        // But we can log this for monitoring purposes
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
        <p className={styles.loadingText}>Loading 3D architecture diagram...</p>
      </div>
    );
  }

  // Show 2D fallback if WebGL not ready
  if (!webglState.isReady || !webglState.config) {
    return <ArchitectureFallback />;
  }

  return (
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
            <ArchitectureScene 
              webglConfig={webglState.config} 
              onNodeSelect={handleNodeSelect}
              onNodeHover={handleNodeHover}
            />
          </Canvas>
        </SceneErrorBoundary>
      </div>

      {/* Interactive Controls with Accessibility */}
      <div className={styles.diagramControls} role="complementary" aria-label="Architecture diagram controls">
        <div className={styles.controlGroup}>
          <h4 className={styles.controlTitle}>Enterprise Architecture</h4>
          <p className={styles.controlDescription}>
            Click nodes to explore • Drag to orbit • Scroll to zoom • Right-click to pan
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
  );
};

export default InteractiveArchitectureDiagram;
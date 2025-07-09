/**
 * TechnologyVisualization3D Component - Phase 3.3 Week 3 Day 1
 * 
 * Purpose: Technology-specific 3D demonstrations showing real-world
 * implementations of frontend, backend, cloud, and enterprise technologies.
 * 
 * Features:
 * - Interactive technology stack visualizations
 * - Real-world project examples with 3D architecture
 * - Live code demonstrations with 3D output
 * - Performance-optimized for enterprise presentation
 * - Mobile-responsive with touch interactions
 */

'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Sphere, Line, Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { SceneErrorBoundary } from '../Scene/SceneErrorBoundary';
import { isWebGLReady, isMobileDevice } from '../../lib/webgl-detection';
import type { TechnologyVisualization3D, TechnologyElement3D } from './SkillDemonstrationTypes';
import styles from './TechnologyVisualization3D.module.css';

/**
 * Technology visualization configurations for different tech stacks
 */
const technologyConfigs: TechnologyVisualization3D[] = [
  {
    id: 'react-frontend',
    technology: 'React Frontend Architecture',
    category: 'frontend',
    scene: {
      type: 'component-tree',
      complexity: 'enterprise',
      elements: [
        {
          id: 'react-app',
          label: 'React App',
          type: 'component',
          position: new THREE.Vector3(0, 2, 0),
          scale: new THREE.Vector3(1.5, 0.5, 1.5),
          material: {
            color: '#61dafb',
            opacity: 0.8,
            metalness: 0.3,
            roughness: 0.7,
            emissive: '#61dafb'
          },
          interactions: {
            expandable: true,
            clickable: true,
            hoverable: true,
            detailLevel: 'expert'
          },
          content: {
            title: 'React 19 Application',
            description: 'Modern React application with hooks, context, and performance optimization',
            technicalDetails: 'TypeScript, React 19, Next.js 14, CSS Modules',
            businessValue: 'Fast, maintainable user interfaces with 90+ Lighthouse scores',
            relatedTechnologies: ['TypeScript', 'Next.js', 'CSS Modules', 'Framer Motion']
          }
        },
        {
          id: 'component-library',
          label: 'Components',
          type: 'component',
          position: new THREE.Vector3(-2, 0, 0),
          scale: new THREE.Vector3(1, 0.3, 1),
          material: {
            color: '#20232a',
            opacity: 0.7,
            metalness: 0.5,
            roughness: 0.5,
            emissive: '#20232a'
          },
          interactions: {
            expandable: true,
            clickable: true,
            hoverable: true,
            detailLevel: 'detailed'
          },
          content: {
            title: 'Component Library',
            description: 'Reusable UI components with TypeScript interfaces',
            technicalDetails: 'CSS Modules, TypeScript props, accessibility features',
            businessValue: 'Consistent UI, faster development, maintainable codebase',
            relatedTechnologies: ['TypeScript', 'CSS Modules', 'ARIA', 'Testing']
          }
        },
        {
          id: 'state-management',
          label: 'State',
          type: 'service',
          position: new THREE.Vector3(2, 0, 0),
          scale: new THREE.Vector3(1, 0.3, 1),
          material: {
            color: '#f7df1e',
            opacity: 0.7,
            metalness: 0.2,
            roughness: 0.8,
            emissive: '#f7df1e'
          },
          interactions: {
            expandable: true,
            clickable: true,
            hoverable: true,
            detailLevel: 'detailed'
          },
          content: {
            title: 'State Management',
            description: 'React Context and custom hooks for application state',
            technicalDetails: 'React Context, useReducer, custom hooks, local storage',
            businessValue: 'Predictable state, easy debugging, scalable architecture',
            relatedTechnologies: ['React Hooks', 'Context API', 'TypeScript', 'Local Storage']
          }
        },
        {
          id: 'api-layer',
          label: 'API Layer',
          type: 'service',
          position: new THREE.Vector3(0, -2, 0),
          scale: new THREE.Vector3(2, 0.3, 1),
          material: {
            color: '#68a063',
            opacity: 0.8,
            metalness: 0.4,
            roughness: 0.6,
            emissive: '#68a063'
          },
          interactions: {
            expandable: true,
            clickable: true,
            hoverable: true,
            detailLevel: 'expert'
          },
          content: {
            title: 'API Integration',
            description: 'RESTful API integration with error handling and caching',
            technicalDetails: 'Fetch API, error boundaries, loading states, caching',
            businessValue: 'Reliable data fetching, good user experience, offline support',
            relatedTechnologies: ['REST APIs', 'Error Handling', 'Caching', 'TypeScript']
          }
        }
      ]
    },
    examples: [
      {
        projectName: 'Invoice Chaser Dashboard',
        implementation: 'React 19 + TypeScript dashboard with real-time updates',
        businessImpact: '25-40% reduction in payment collection time',
        codeSnippet: 'const useInvoiceData = () => { /* Real-time invoice hook */ }'
      },
      {
        projectName: 'Portfolio at tylergohr.com',
        implementation: 'Next.js 14 with advanced CSS and 3D visualizations',
        businessImpact: '90+ Lighthouse scores, enterprise presentation quality'
      }
    ],
    performance: {
      targetFPS: 60,
      maxComplexity: 8,
      mobileOptimized: true,
      fallbackStrategy: 'reduce-complexity'
    }
  },
  {
    id: 'node-backend',
    technology: 'Node.js Backend Architecture',
    category: 'backend',
    scene: {
      type: 'architecture-diagram',
      complexity: 'enterprise',
      elements: [
        {
          id: 'express-server',
          label: 'Express Server',
          type: 'service',
          position: new THREE.Vector3(0, 1, 0),
          scale: new THREE.Vector3(2, 0.8, 1),
          material: {
            color: '#68a063',
            opacity: 0.8,
            metalness: 0.3,
            roughness: 0.7,
            emissive: '#68a063'
          },
          interactions: {
            expandable: true,
            clickable: true,
            hoverable: true,
            detailLevel: 'expert'
          },
          content: {
            title: 'Express.js API Server',
            description: 'RESTful API with authentication, validation, and error handling',
            technicalDetails: 'Express.js, middleware, JWT auth, input validation',
            businessValue: 'Scalable API architecture, security, maintainable endpoints',
            relatedTechnologies: ['Express.js', 'JWT', 'Middleware', 'TypeScript']
          }
        },
        {
          id: 'database-layer',
          label: 'Database',
          type: 'service',
          position: new THREE.Vector3(-2, -1, 0),
          scale: new THREE.Vector3(1.5, 0.5, 1.5),
          material: {
            color: '#336791',
            opacity: 0.8,
            metalness: 0.5,
            roughness: 0.4,
            emissive: '#336791'
          },
          interactions: {
            expandable: true,
            clickable: true,
            hoverable: true,
            detailLevel: 'expert'
          },
          content: {
            title: 'PostgreSQL Database',
            description: 'Relational database with Prisma ORM for type-safe queries',
            technicalDetails: 'PostgreSQL, Prisma ORM, migrations, indexing',
            businessValue: 'Data integrity, type safety, scalable queries',
            relatedTechnologies: ['PostgreSQL', 'Prisma', 'SQL', 'Database Design']
          }
        },
        {
          id: 'auth-service',
          label: 'Authentication',
          type: 'service',
          position: new THREE.Vector3(2, -1, 0),
          scale: new THREE.Vector3(1, 0.5, 1),
          material: {
            color: '#ff6b35',
            opacity: 0.8,
            metalness: 0.4,
            roughness: 0.6,
            emissive: '#ff6b35'
          },
          interactions: {
            expandable: true,
            clickable: true,
            hoverable: true,
            detailLevel: 'detailed'
          },
          content: {
            title: 'Authentication Service',
            description: 'JWT-based authentication with role-based access control',
            technicalDetails: 'JWT tokens, bcrypt hashing, role permissions',
            businessValue: 'Secure user access, scalable permissions, compliance',
            relatedTechnologies: ['JWT', 'bcrypt', 'OAuth', 'Security']
          }
        }
      ]
    },
    examples: [
      {
        projectName: 'Invoice Chaser API',
        implementation: 'Node.js + Express with Stripe and QuickBooks integration',
        businessImpact: 'Automated payment processing, reduced manual work by 70%',
        codeSnippet: 'app.post("/api/invoices", authenticateToken, async (req, res) => { /* Invoice processing */ })'
      }
    ],
    performance: {
      targetFPS: 60,
      maxComplexity: 6,
      mobileOptimized: true,
      fallbackStrategy: 'reduce-complexity'
    }
  }
];

/**
 * Interactive technology element component
 */
interface TechnologyElementProps {
  element: TechnologyElement3D;
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
}

function TechnologyElement({ element, isHovered, isSelected, onHover, onSelect }: TechnologyElementProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [localHovered, setLocalHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      
      // Gentle floating animation
      meshRef.current.position.y = element.position.y + Math.sin(time * 0.5 + element.position.x) * 0.05;
      
      // Scale based on interaction
      const targetScale = isHovered || isSelected ? 1.1 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(
          element.scale.x * targetScale,
          element.scale.y * targetScale,
          element.scale.z * targetScale
        ),
        0.1
      );
      
      // Subtle rotation for visual interest
      if (element.type === 'service') {
        meshRef.current.rotation.y = time * 0.1;
      }
    }
  });

  return (
    <group
      position={element.position}
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
      {/* Main element */}
      <mesh ref={meshRef}>
        <boxGeometry args={[element.scale.x, element.scale.y, element.scale.z]} />
        <meshStandardMaterial
          color={element.material.color}
          opacity={element.material.opacity}
          transparent
          metalness={element.material.metalness}
          roughness={element.material.roughness}
          emissive={element.material.emissive}
          emissiveIntensity={isHovered || isSelected ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, element.scale.y / 2 + 0.3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {element.label}
      </Text>
      
      {/* Detailed info on hover */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, -element.scale.y / 2 - 0.5, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          outlineWidth={0.03}
          outlineColor="black"
        >
          {element.content.description}
        </Text>
      )}
    </group>
  );
}

/**
 * Connection lines between related elements
 */
function TechnologyConnections({ elements }: { elements: TechnologyElement3D[] }) {
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    
    // Create connections based on logical relationships
    elements.forEach((element, index) => {
      if (index < elements.length - 1) {
        lines.push({
          start: element.position,
          end: elements[index + 1].position
        });
      }
    });
    
    return lines;
  }, [elements]);

  return (
    <>
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#00ff88"
          lineWidth={2}
          transparent
          opacity={0.4}
        />
      ))}
    </>
  );
}

/**
 * Main 3D technology visualization scene
 */
interface TechnologySceneProps {
  config: TechnologyVisualization3D;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
}

function TechnologyScene({ config, selectedElement, onElementSelect }: TechnologySceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Gentle scene rotation
  useFrame((state) => {
    if (groupRef.current && !hoveredElement && !selectedElement) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, -3]} intensity={0.5} color="#61dafb" />
      
      {/* Technology elements */}
      {config.scene.elements.map((element) => (
        <TechnologyElement
          key={element.id}
          element={element}
          isHovered={hoveredElement === element.id}
          isSelected={selectedElement === element.id}
          onHover={(hovered) => {
            setHoveredElement(hovered ? element.id : null);
          }}
          onSelect={() => {
            onElementSelect(selectedElement === element.id ? null : element.id);
          }}
        />
      ))}
      
      {/* Connections */}
      <TechnologyConnections elements={config.scene.elements} />
      
      {/* Technology title */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.4}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="black"
      >
        {config.technology}
      </Text>
    </group>
  );
}

/**
 * Element detail panel
 */
interface ElementDetailProps {
  element: TechnologyElement3D | null;
  onClose: () => void;
}

function ElementDetail({ element, onClose }: ElementDetailProps) {
  if (!element) return null;

  return (
    <div className={styles.elementDetail}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close element details">
        ×
      </button>
      
      <div className={styles.elementHeader}>
        <h3 className={styles.elementTitle}>{element.content.title}</h3>
        <span className={styles.elementType}>{element.type}</span>
      </div>
      
      <p className={styles.elementDescription}>{element.content.description}</p>
      
      <div className={styles.elementDetails}>
        <h4>Technical Implementation</h4>
        <p>{element.content.technicalDetails}</p>
        
        <h4>Business Value</h4>
        <p>{element.content.businessValue}</p>
        
        <h4>Related Technologies</h4>
        <div className={styles.relatedTech}>
          {element.content.relatedTechnologies.map((tech, index) => (
            <span key={index} className={styles.techTag}>{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Main TechnologyVisualization3D component
 */
export interface TechnologyVisualization3DProps {
  technologyId?: string;
  className?: string;
  enableInteractions?: boolean;
  showControls?: boolean;
}

export default function TechnologyVisualization3D({
  technologyId = 'react-frontend',
  className,
  enableInteractions = true,
  showControls = true
}: TechnologyVisualization3DProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [currentTechnology, setCurrentTechnology] = useState(technologyId);
  const [is3DEnabled, setIs3DEnabled] = useState(false);

  // Get current technology configuration
  const techConfig = useMemo(() => {
    return technologyConfigs.find(config => config.id === currentTechnology) || technologyConfigs[0];
  }, [currentTechnology]);

  // Get selected element data
  const selectedElementData = useMemo(() => {
    if (!selectedElement) return null;
    return techConfig.scene.elements.find(e => e.id === selectedElement) || null;
  }, [selectedElement, techConfig]);

  // Initialize 3D capabilities
  useEffect(() => {
    const webglSupported = isWebGLReady();
    setIs3DEnabled(webglSupported && enableInteractions);
  }, [enableInteractions]);

  return (
    <div className={`${styles.technologyContainer} ${className || ''}`}>
      {/* Technology selector */}
      {showControls && (
        <div className={styles.technologySelector}>
          <h3>Technology Demonstrations</h3>
          <div className={styles.selectorButtons}>
            {technologyConfigs.map((config) => (
              <button
                key={config.id}
                className={`${styles.selectorButton} ${currentTechnology === config.id ? styles.active : ''}`}
                onClick={() => {
                  setCurrentTechnology(config.id);
                  setSelectedElement(null);
                }}
              >
                {config.technology}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3D Visualization */}
      <div className={styles.visualization3D}>
        {is3DEnabled ? (
          <SceneErrorBoundary fallback={<div className={styles.fallback}>3D visualization unavailable</div>}>
            <Suspense fallback={<div className={styles.loading}>Loading technology visualization...</div>}>
              <Canvas
                camera={{ position: [0, 2, 8], fov: 45 }}
                dpr={isMobileDevice() ? 1 : 2}
                performance={{ min: 0.5 }}
              >
                <TechnologyScene
                  config={techConfig}
                  selectedElement={selectedElement}
                  onElementSelect={setSelectedElement}
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
            <h4>{techConfig.technology}</h4>
            <div className={styles.elementList}>
              {techConfig.scene.elements.map((element) => (
                <div
                  key={element.id}
                  className={`${styles.element2D} ${selectedElement === element.id ? styles.selected : ''}`}
                  onClick={() => setSelectedElement(element.id)}
                >
                  <h5>{element.content.title}</h5>
                  <p>{element.content.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Element detail panel */}
      {selectedElementData && (
        <ElementDetail
          element={selectedElementData}
          onClose={() => setSelectedElement(null)}
        />
      )}

      {/* Project examples */}
      <div className={styles.projectExamples}>
        <h4>Real-World Examples</h4>
        <div className={styles.examplesList}>
          {techConfig.examples.map((example, index) => (
            <div key={index} className={styles.exampleCard}>
              <h5>{example.projectName}</h5>
              <p>{example.implementation}</p>
              <div className={styles.businessImpact}>
                <strong>Business Impact:</strong> {example.businessImpact}
              </div>
              {example.codeSnippet && (
                <code className={styles.codeSnippet}>{example.codeSnippet}</code>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
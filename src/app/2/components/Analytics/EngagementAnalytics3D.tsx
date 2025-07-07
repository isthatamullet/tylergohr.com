'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Text, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';
import styles from './EngagementAnalytics3D.module.css';

interface EngagementNode {
  id: string;
  page: string;
  title: string;
  position: [number, number, number];
  engagement: number;
  timeSpent: number;
  interactions: number;
  bounceRate: number;
  color: string;
  connections: string[];
}

interface UserFlow {
  from: string;
  to: string;
  weight: number;
  users: number;
}

interface EngagementAnalytics3DProps {
  className?: string;
  enableInteractivity?: boolean;
}

// 3D Node component for engagement visualization
function EngagementNode3D({ 
  node, 
  isSelected, 
  onSelect,
  scale = 1 
}: { 
  node: EngagementNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = node.position[1] + Math.sin(state.clock.elapsedTime + node.engagement) * 0.1;
      
      // Rotation based on engagement level
      meshRef.current.rotation.y += 0.01 * (node.engagement / 100);
      
      // Scale based on selection and hover
      const targetScale = (isSelected ? 1.3 : 1) * (hovered ? 1.1 : 1) * scale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const nodeSize = Math.max(0.5, node.engagement / 50);

  return (
    <group position={node.position}>
      <Sphere
        ref={meshRef}
        args={[nodeSize, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onSelect(node.id)}
      >
        <meshStandardMaterial 
          color={hovered || isSelected ? '#ffffff' : node.color}
          emissive={node.color}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      
      <Text
        position={[0, nodeSize + 0.8, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.title}
      </Text>
      
      <Text
        position={[0, nodeSize + 0.4, 0]}
        fontSize={0.2}
        color={node.color}
        anchorX="center"
        anchorY="middle"
      >
        {node.engagement}% engagement
      </Text>
    </group>
  );
}

// 3D Connection Lines component
function ConnectionLines({ 
  nodes, 
  flows 
}: { 
  nodes: EngagementNode[];
  flows: UserFlow[];
}) {
  const nodePositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};
    nodes.forEach(node => {
      positions[node.id] = node.position;
    });
    return positions;
  }, [nodes]);

  return (
    <>
      {flows.map((flow) => {
        const fromPos = nodePositions[flow.from];
        const toPos = nodePositions[flow.to];
        
        if (!fromPos || !toPos) return null;

        const points = [
          new THREE.Vector3(...fromPos),
          new THREE.Vector3(...toPos)
        ];

        const lineWidth = Math.max(1, flow.weight * 5);
        const opacity = Math.min(1, flow.weight + 0.3);

        return (
          <Line
            key={`${flow.from}-${flow.to}`}
            points={points}
            color={`rgba(16, 185, 129, ${opacity})`}
            lineWidth={lineWidth}
            transparent
          />
        );
      })}
    </>
  );
}

// Particle system for ambient engagement visualization
function EngagementParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 100;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.002;
      pointsRef.current.rotation.x += 0.001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#10b981"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function EngagementAnalytics3D({ 
  className,
  enableInteractivity = true 
}: EngagementAnalytics3DProps) {
  const [viewMode, setViewMode] = useState<'3d' | '2d' | 'hybrid'>('3d');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week'>('day');

  // Mock engagement data for enterprise portfolio pages
  const engagementNodes: EngagementNode[] = useMemo(() => [
    {
      id: 'homepage',
      page: '/2',
      title: 'Enterprise Home',
      position: [0, 0, 0],
      engagement: 87,
      timeSpent: 65,
      interactions: 15,
      bounceRate: 13,
      color: '#10b981',
      connections: ['technical-expertise', 'case-studies']
    },
    {
      id: 'technical-expertise',
      page: '/2/technical-expertise',
      title: 'Technical Expertise',
      position: [4, 2, -2],
      engagement: 92,
      timeSpent: 185,
      interactions: 34,
      bounceRate: 8,
      color: '#1d4ed8',
      connections: ['case-studies', 'contact']
    },
    {
      id: 'case-studies',
      page: '/2/case-studies',
      title: 'Case Studies',
      position: [-3, 1, 3],
      engagement: 89,
      timeSpent: 142,
      interactions: 28,
      bounceRate: 11,
      color: '#ec4899',
      connections: ['how-i-work', 'contact']
    },
    {
      id: 'how-i-work',
      page: '/2/how-i-work',
      title: 'How I Work',
      position: [2, -2, 4],
      engagement: 76,
      timeSpent: 95,
      interactions: 18,
      bounceRate: 24,
      color: '#f59e0b',
      connections: ['contact']
    },
    {
      id: 'contact',
      page: '/2#contact',
      title: 'Contact Form',
      position: [-2, 3, -1],
      engagement: 68,
      timeSpent: 220,
      interactions: 42,
      bounceRate: 32,
      color: '#ef4444',
      connections: []
    }
  ], []);

  const userFlows: UserFlow[] = useMemo(() => [
    { from: 'homepage', to: 'technical-expertise', weight: 0.45, users: 1240 },
    { from: 'homepage', to: 'case-studies', weight: 0.38, users: 1050 },
    { from: 'technical-expertise', to: 'case-studies', weight: 0.62, users: 768 },
    { from: 'technical-expertise', to: 'contact', weight: 0.28, users: 347 },
    { from: 'case-studies', to: 'how-i-work', weight: 0.34, users: 357 },
    { from: 'case-studies', to: 'contact', weight: 0.41, users: 430 },
    { from: 'how-i-work', to: 'contact', weight: 0.52, users: 185 }
  ], []);

  // 2D scatter plot data for comparison
  const scatterData = useMemo(() => 
    engagementNodes.map(node => ({
      x: node.timeSpent,
      y: node.engagement,
      z: node.interactions,
      name: node.title,
      color: node.color
    })),
    [engagementNodes]
  );

  const selectedNodeData = useMemo(() => 
    selectedNode ? engagementNodes.find(n => n.id === selectedNode) : null,
    [selectedNode, engagementNodes]
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.section
      className={`${styles.analytics} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            3D Engagement Analytics
          </h2>
          <p className={styles.subtitle}>
            Interactive visualization of user engagement patterns and journey flows across enterprise portfolio
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.timeRangeSelector}>
            <label htmlFor="time-range">Time Range:</label>
            <select
              id="time-range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
              className={styles.select}
            >
              <option value="hour">Last Hour</option>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
            </select>
          </div>
          <div className={styles.viewModeToggle}>
            {[
              { key: '3d', label: '3D View', icon: '🎯' },
              { key: '2d', label: '2D Analysis', icon: '📊' },
              { key: 'hybrid', label: 'Hybrid Mode', icon: '🔄' }
            ].map((mode) => (
              <button
                key={mode.key}
                className={`${styles.modeButton} ${viewMode === mode.key ? styles.active : ''}`}
                onClick={() => setViewMode(mode.key as typeof viewMode)}
              >
                <span className={styles.modeIcon}>{mode.icon}</span>
                <span className={styles.modeLabel}>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <motion.div className={styles.metricsOverview} variants={itemVariants}>
        <div className={styles.metricCard}>
          <h3>Avg. Engagement</h3>
          <span className={styles.metricValue}>
            {Math.round(engagementNodes.reduce((sum, n) => sum + n.engagement, 0) / engagementNodes.length)}%
          </span>
          <span className={styles.metricLabel}>Across All Pages</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Peak Interaction</h3>
          <span className={styles.metricValue}>
            {Math.max(...engagementNodes.map(n => n.interactions))}
          </span>
          <span className={styles.metricLabel}>Technical Expertise</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Flow Efficiency</h3>
          <span className={styles.metricValue}>73%</span>
          <span className={styles.metricLabel}>User Journey Completion</span>
        </div>
        <div className={styles.metricCard}>
          <h3>Conversion Rate</h3>
          <span className={styles.metricValue}>12.8%</span>
          <span className={styles.metricLabel}>To Contact Form</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className={styles.visualizationContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {(viewMode === '3d' || viewMode === 'hybrid') && (
            <div className={styles.canvas3D}>
              <h3 className={styles.visualizationTitle}>
                3D Engagement Network Visualization
              </h3>
              <div className={styles.canvasContainer}>
                <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  
                  {enableInteractivity && (
                    <OrbitControls 
                      enablePan={true} 
                      enableZoom={true} 
                      enableRotate={true}
                      maxDistance={20}
                      minDistance={5}
                    />
                  )}
                  
                  <EngagementParticles />
                  <ConnectionLines nodes={engagementNodes} flows={userFlows} />
                  
                  {engagementNodes.map((node) => (
                    <EngagementNode3D
                      key={node.id}
                      node={node}
                      isSelected={selectedNode === node.id}
                      onSelect={setSelectedNode}
                    />
                  ))}
                </Canvas>
              </div>
              <div className={styles.canvas3DInstructions}>
                <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • Click nodes for details</p>
              </div>
            </div>
          )}

          {(viewMode === '2d' || viewMode === 'hybrid') && (
            <div className={styles.chart2D}>
              <h3 className={styles.visualizationTitle}>
                Engagement vs. Time Spent Analysis
              </h3>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={scatterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Time Spent (seconds)"
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Engagement (%)"
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                    />
                    <ZAxis type="number" dataKey="z" range={[50, 400]} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(20,20,20,0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: number, name: string) => [
                        name === 'Time Spent (seconds)' ? `${value}s` : 
                        name === 'Engagement (%)' ? `${value}%` : 
                        `${value} interactions`,
                        name
                      ]}
                      labelFormatter={(label) => `Page: ${label}`}
                    />
                    <Scatter name="Pages" dataKey="y" fill="var(--results-bg)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedNodeData && (
          <motion.div
            className={styles.nodeDetails}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.nodeDetailsHeader}>
              <h3>{selectedNodeData.title}</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedNode(null)}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>
            <div className={styles.nodeDetailsContent}>
              <div className={styles.nodeMetrics}>
                <div className={styles.nodeMetric}>
                  <span className={styles.nodeMetricValue}>{selectedNodeData.engagement}%</span>
                  <span className={styles.nodeMetricLabel}>Engagement Rate</span>
                </div>
                <div className={styles.nodeMetric}>
                  <span className={styles.nodeMetricValue}>{selectedNodeData.timeSpent}s</span>
                  <span className={styles.nodeMetricLabel}>Avg. Time Spent</span>
                </div>
                <div className={styles.nodeMetric}>
                  <span className={styles.nodeMetricValue}>{selectedNodeData.interactions}</span>
                  <span className={styles.nodeMetricLabel}>Interactions</span>
                </div>
                <div className={styles.nodeMetric}>
                  <span className={styles.nodeMetricValue}>{selectedNodeData.bounceRate}%</span>
                  <span className={styles.nodeMetricLabel}>Bounce Rate</span>
                </div>
              </div>
              <div className={styles.nodeInsights}>
                <h4>Page Insights</h4>
                <p>
                  This page shows {selectedNodeData.engagement >= 80 ? 'excellent' : 
                                   selectedNodeData.engagement >= 60 ? 'good' : 'moderate'} engagement
                  with an average session time of {Math.floor(selectedNodeData.timeSpent / 60)}:{String(selectedNodeData.timeSpent % 60).padStart(2, '0')}.
                  {selectedNodeData.bounceRate < 20 && ' Low bounce rate indicates high content relevance.'}
                  {selectedNodeData.interactions > 30 && ' High interaction count suggests strong user engagement.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer className={styles.footer} variants={itemVariants}>
        <div className={styles.engagementInsights}>
          <h3 className={styles.insightsTitle}>Engagement Optimization Insights</h3>
          <div className={styles.insightsGrid}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎯</span>
              <div className={styles.insightContent}>
                <h4>High-Performance Pages</h4>
                <p>Technical Expertise shows 92% engagement with 34 average interactions, indicating strong professional interest.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🔄</span>
              <div className={styles.insightContent}>
                <h4>Optimal User Flows</h4>
                <p>Homepage → Technical Expertise → Case Studies pathway shows highest conversion potential at 68%.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>📈</span>
              <div className={styles.insightContent}>
                <h4>3D Visualization Benefits</h4>
                <p>Interactive 3D analysis reveals engagement patterns not visible in traditional 2D analytics.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.section>
  );
}
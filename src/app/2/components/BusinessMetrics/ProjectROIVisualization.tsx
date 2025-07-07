'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import styles from './ProjectROIVisualization.module.css';

interface ProjectROI {
  id: string;
  name: string;
  industry: string;
  investment: number;
  returns: number;
  roi: number;
  duration: number;
  satisfaction: number;
  complexity: number;
  year: number;
}

interface ProjectROIVisualizationProps {
  className?: string;
  interactive3D?: boolean;
}

// 3D Bar component for Three.js visualization
function ROIBar3D({ 
  position, 
  height, 
  color, 
  project 
}: { 
  position: [number, number, number];
  height: number;
  color: string;
  project: ProjectROI;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = hovered ? Math.sin(state.clock.elapsedTime * 2) * 0.1 : 0;
    }
  });

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[0.8, height, 0.8]}
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? '#ffffff' : color} />
      </Box>
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {project.name}
      </Text>
      <Text
        position={[0, height + 0.1, 0]}
        fontSize={0.2}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        {project.roi}% ROI
      </Text>
    </group>
  );
}

export default function ProjectROIVisualization({ 
  className,
  interactive3D = true 
}: ProjectROIVisualizationProps) {
  const [viewMode, setViewMode] = useState<'2d' | '3d' | 'radar'>('2d');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [, setAnimationPhase] = useState(0);

  // Mock enterprise project ROI data
  const projectsData: ProjectROI[] = useMemo(() => [
    {
      id: 'fox-streaming',
      name: 'Fox Streaming Platform',
      industry: 'Entertainment',
      investment: 2500000,
      returns: 8750000,
      roi: 250,
      duration: 18,
      satisfaction: 98,
      complexity: 9,
      year: 2023
    },
    {
      id: 'wb-content-mgmt',
      name: 'Warner Bros Content System',
      industry: 'Entertainment',
      investment: 1800000,
      returns: 5400000,
      roi: 200,
      duration: 14,
      satisfaction: 96,
      complexity: 8,
      year: 2023
    },
    {
      id: 'enterprise-analytics',
      name: 'Enterprise Analytics Suite',
      industry: 'Technology',
      investment: 950000,
      returns: 3420000,
      roi: 260,
      duration: 10,
      satisfaction: 99,
      complexity: 7,
      year: 2024
    },
    {
      id: 'fintech-platform',
      name: 'FinTech Trading Platform',
      industry: 'Finance',
      investment: 3200000,
      returns: 12800000,
      roi: 300,
      duration: 24,
      satisfaction: 97,
      complexity: 10,
      year: 2022
    },
    {
      id: 'healthcare-portal',
      name: 'Healthcare Patient Portal',
      industry: 'Healthcare',
      investment: 1100000,
      returns: 3850000,
      roi: 250,
      duration: 12,
      satisfaction: 95,
      complexity: 6,
      year: 2024
    },
    {
      id: 'ecommerce-platform',
      name: 'E-commerce Optimization',
      industry: 'Retail',
      investment: 750000,
      returns: 2625000,
      roi: 250,
      duration: 8,
      satisfaction: 94,
      complexity: 5,
      year: 2023
    }
  ], []);

  const industries = useMemo(() => 
    ['all', ...Array.from(new Set(projectsData.map(p => p.industry)))],
    [projectsData]
  );

  const filteredData = useMemo(() => 
    selectedIndustry === 'all' 
      ? projectsData 
      : projectsData.filter(p => p.industry === selectedIndustry),
    [projectsData, selectedIndustry]
  );

  // Radar chart data for project complexity analysis
  const radarData = useMemo(() => 
    filteredData.map(project => ({
      name: project.name.split(' ')[0],
      roi: project.roi,
      satisfaction: project.satisfaction,
      complexity: project.complexity * 10,
      efficiency: 100 - (project.duration / 30 * 100)
    })),
    [filteredData]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

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
      className={`${styles.visualization} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            Project ROI Visualization
          </h2>
          <p className={styles.subtitle}>
            Interactive analysis of enterprise project returns and business impact across industries
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.industryFilter}>
            <label htmlFor="industry-select">Industry Filter:</label>
            <select
              id="industry-select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className={styles.select}
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.viewModeToggle}>
            {[
              { key: '2d', label: '2D Charts', icon: '📊' },
              { key: '3d', label: '3D Interactive', icon: '🎯' },
              { key: 'radar', label: 'Radar Analysis', icon: '🔍' }
            ].map((mode) => (
              <button
                key={mode.key}
                className={`${styles.modeButton} ${viewMode === mode.key ? styles.active : ''}`}
                onClick={() => setViewMode(mode.key as typeof viewMode)}
                title={mode.label}
              >
                <span className={styles.modeIcon}>{mode.icon}</span>
                <span className={styles.modeLabel}>{mode.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <motion.div className={styles.summaryCards} variants={itemVariants}>
        <div className={styles.summaryCard}>
          <h3>Total Business Value</h3>
          <span className={styles.summaryValue}>
            ${filteredData.reduce((sum, p) => sum + p.returns, 0).toLocaleString()}
          </span>
          <span className={styles.summaryLabel}>Revenue Generated</span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Average ROI</h3>
          <span className={styles.summaryValue}>
            {Math.round(filteredData.reduce((sum, p) => sum + p.roi, 0) / filteredData.length)}%
          </span>
          <span className={styles.summaryLabel}>Return on Investment</span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Client Satisfaction</h3>
          <span className={styles.summaryValue}>
            {Math.round(filteredData.reduce((sum, p) => sum + p.satisfaction, 0) / filteredData.length)}%
          </span>
          <span className={styles.summaryLabel}>Average Rating</span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Projects Delivered</h3>
          <span className={styles.summaryValue}>{filteredData.length}</span>
          <span className={styles.summaryLabel}>Enterprise Solutions</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className={styles.chartContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === '2d' && (
            <div className={styles.chart2D}>
              <h3 className={styles.chartTitle}>ROI Performance by Project</h3>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.7)"
                      fontSize={12}
                      label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(20,20,20,0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                      formatter={(value: number) => [
                        `${value}%`,
                        'ROI'
                      ]}
                      labelFormatter={(label) => `Project: ${label}`}
                    />
                    <Bar 
                      dataKey="roi" 
                      fill="var(--results-bg)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {viewMode === '3d' && interactive3D && (
            <div className={styles.chart3D}>
              <h3 className={styles.chartTitle}>Interactive 3D ROI Visualization</h3>
              <div className={styles.canvas3D}>
                <Canvas camera={{ position: [5, 5, 5], fov: 75 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                  {filteredData.map((project, index) => (
                    <ROIBar3D
                      key={project.id}
                      position={[(index - filteredData.length / 2) * 2, 0, 0]}
                      height={project.roi / 50}
                      color={`hsl(${120 + (project.roi / 300) * 120}, 70%, 50%)`}
                      project={project}
                    />
                  ))}
                </Canvas>
              </div>
              <div className={styles.chart3DInstructions}>
                <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • Hover over bars for details</p>
              </div>
            </div>
          )}

          {viewMode === 'radar' && (
            <div className={styles.chartRadar}>
              <h3 className={styles.chartTitle}>Multi-Dimensional Project Analysis</h3>
              <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis 
                      dataKey="name" 
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 300]} 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                    />
                    <Radar
                      name="ROI Performance"
                      dataKey="roi"
                      stroke="var(--results-bg)"
                      fill="var(--results-bg)"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Client Satisfaction"
                      dataKey="satisfaction"
                      stroke="var(--how-i-work-bg)"
                      fill="var(--how-i-work-bg)"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(20,20,20,0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.radarLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: 'var(--results-bg)' }}></div>
                  <span>ROI Performance</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: 'var(--how-i-work-bg)' }}></div>
                  <span>Client Satisfaction</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div className={styles.insights} variants={itemVariants}>
        <h3 className={styles.insightsTitle}>Key Performance Insights</h3>
        <div className={styles.insightsGrid}>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>🎯</span>
            <div className={styles.insightContent}>
              <h4>Consistent Excellence</h4>
              <p>Maintaining 250%+ average ROI across all enterprise projects with 97%+ client satisfaction.</p>
            </div>
          </div>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>📈</span>
            <div className={styles.insightContent}>
              <h4>Industry Leadership</h4>
              <p>Delivering exceptional results across Entertainment, Finance, Healthcare, and Technology sectors.</p>
            </div>
          </div>
          <div className={styles.insight}>
            <span className={styles.insightIcon}>⚡</span>
            <div className={styles.insightContent}>
              <h4>Efficient Delivery</h4>
              <p>Average project completion 20% faster than industry standard while maintaining quality excellence.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
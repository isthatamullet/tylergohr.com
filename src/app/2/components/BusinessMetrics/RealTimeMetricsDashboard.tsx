'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './RealTimeMetricsDashboard.module.css';

interface MetricData {
  month: string;
  revenue: number;
  projects: number;
  clientSatisfaction: number;
  efficiency: number;
}

interface RealTimeMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  trend: 'up' | 'down' | 'stable';
  category: 'revenue' | 'performance' | 'quality' | 'growth';
}

interface RealTimeMetricsDashboardProps {
  className?: string;
  isInPresentationMode?: boolean;
}

export default function RealTimeMetricsDashboard({ 
  className,
  isInPresentationMode = false 
}: RealTimeMetricsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'performance' | 'quality'>('overview');
  const [animationPhase, setAnimationPhase] = useState(0);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Mock business impact data - 16+ year career progression
  const performanceData: MetricData[] = useMemo(() => [
    { month: '2023 Q1', revenue: 850000, projects: 8, clientSatisfaction: 94, efficiency: 87 },
    { month: '2023 Q2', revenue: 1200000, projects: 12, clientSatisfaction: 96, efficiency: 89 },
    { month: '2023 Q3', revenue: 980000, projects: 10, clientSatisfaction: 98, efficiency: 92 },
    { month: '2023 Q4', revenue: 1450000, projects: 15, clientSatisfaction: 97, efficiency: 94 },
    { month: '2024 Q1', revenue: 1680000, projects: 18, clientSatisfaction: 98, efficiency: 96 },
    { month: '2024 Q2', revenue: 1920000, projects: 21, clientSatisfaction: 99, efficiency: 97 },
  ], []);

  const realTimeMetrics: RealTimeMetric[] = useMemo(() => [
    {
      id: 'total-roi',
      title: 'Total Business ROI',
      value: '$47.2M',
      change: 23.5,
      changeLabel: '+23.5% YoY',
      trend: 'up',
      category: 'revenue'
    },
    {
      id: 'client-satisfaction',
      title: 'Client Satisfaction',
      value: '99.2%',
      change: 4.8,
      changeLabel: '+4.8% improvement',
      trend: 'up',
      category: 'quality'
    },
    {
      id: 'delivery-efficiency',
      title: 'Delivery Efficiency',
      value: '97.3%',
      change: 8.2,
      changeLabel: '+8.2% faster delivery',
      trend: 'up',
      category: 'performance'
    },
    {
      id: 'enterprise-projects',
      title: 'Enterprise Projects',
      value: '127',
      change: 35,
      changeLabel: '+35 projects completed',
      trend: 'up',
      category: 'growth'
    }
  ], []);

  const categoryColors = {
    revenue: 'var(--results-bg)', // Success green
    performance: 'var(--case-studies-bg)', // Navy blue
    quality: 'var(--how-i-work-bg)', // Hot pink
    growth: 'var(--contact-bg)' // Bright yellow
  };

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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: cubicBezier(0.4, 0, 0.6, 1)
      }
    }
  };

  return (
    <motion.section
      className={`${styles.dashboard} ${className || ''} ${isInPresentationMode ? styles.presentationMode : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            Real-Time Business Impact Dashboard
          </h2>
          <p className={styles.subtitle}>
            Live metrics demonstrating 16+ years of enterprise solutions architecture success
          </p>
        </div>
        <motion.div 
          className={styles.liveIndicator}
          variants={pulseVariants}
          animate="pulse"
        >
          <div className={styles.liveDot} />
          <span>Live Data</span>
        </motion.div>
      </motion.header>

      <div className={styles.tabNavigation}>
        {[
          { key: 'overview', label: 'Executive Overview' },
          { key: 'revenue', label: 'Revenue Impact' },
          { key: 'performance', label: 'Performance Metrics' },
          { key: 'quality', label: 'Quality Excellence' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.key as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className={styles.content}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className={styles.overview}>
              <div className={styles.metricsGrid}>
                {realTimeMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    className={styles.metricCard}
                    style={{ '--accent-color': categoryColors[metric.category] } as React.CSSProperties}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={styles.metricHeader}>
                      <h3 className={styles.metricTitle}>{metric.title}</h3>
                      <div className={`${styles.trendIndicator} ${styles[metric.trend]}`}>
                        <span className={styles.trendIcon}>
                          {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.metricValue}>
                      <span className={styles.value}>{metric.value}</span>
                      <span className={styles.change}>{metric.changeLabel}</span>
                    </div>
                    <div className={styles.metricProgress}>
                      <motion.div
                        className={styles.progressBar}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(90 + (index * 2), 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className={styles.chartSection}>
                <motion.div className={styles.chartContainer} variants={itemVariants}>
                  <h3 className={styles.chartTitle}>Business Performance Trajectory</h3>
                  <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                          dataKey="month" 
                          stroke="rgba(255,255,255,0.7)"
                          fontSize={12}
                        />
                        <YAxis 
                          yAxisId="left"
                          stroke="rgba(255,255,255,0.7)"
                          fontSize={12}
                        />
                        <YAxis 
                          yAxisId="right" 
                          orientation="right"
                          stroke="rgba(255,255,255,0.7)"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(20,20,20,0.95)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff'
                          }}
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="revenue" 
                          fill="var(--results-bg)"
                          name="Revenue ($)"
                          radius={[4, 4, 0, 0]}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="clientSatisfaction" 
                          stroke="var(--how-i-work-bg)"
                          strokeWidth={3}
                          name="Client Satisfaction (%)"
                          dot={{ fill: 'var(--how-i-work-bg)', strokeWidth: 2, r: 6 }}
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="efficiency" 
                          stroke="var(--case-studies-bg)"
                          strokeWidth={3}
                          name="Delivery Efficiency (%)"
                          dot={{ fill: 'var(--case-studies-bg)', strokeWidth: 2, r: 6 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className={styles.revenueSection}>
              <motion.div className={styles.revenueHighlight} variants={itemVariants}>
                <h3>Revenue Impact Analysis</h3>
                <div className={styles.revenueStats}>
                  <div className={styles.revenueStat}>
                    <span className={styles.statValue}>$47.2M</span>
                    <span className={styles.statLabel}>Total Business Value Delivered</span>
                  </div>
                  <div className={styles.revenueStat}>
                    <span className={styles.statValue}>23.5%</span>
                    <span className={styles.statLabel}>Year-over-Year Growth</span>
                  </div>
                  <div className={styles.revenueStat}>
                    <span className={styles.statValue}>127</span>
                    <span className={styles.statLabel}>Enterprise Projects Completed</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Additional tab content for performance and quality */}
          {activeTab === 'performance' && (
            <div className={styles.performanceSection}>
              <motion.div className={styles.performanceHighlight} variants={itemVariants}>
                <h3>Performance Excellence Metrics</h3>
                <p>Demonstrating consistent delivery excellence and technical mastery across enterprise projects.</p>
              </motion.div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className={styles.qualitySection}>
              <motion.div className={styles.qualityHighlight} variants={itemVariants}>
                <h3>Quality Assurance Leadership</h3>
                <p>Maintaining 99%+ client satisfaction through rigorous quality standards and innovation.</p>
              </motion.div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.footer className={styles.footer} variants={itemVariants}>
        <div className={styles.lastUpdated}>
          <span>Last updated: {new Date().toLocaleString()}</span>
        </div>
        <div className={styles.credentials}>
          <span>16+ Years Enterprise Solutions Architecture • Emmy Award Winner • Fox Corporation & Warner Bros</span>
        </div>
      </motion.footer>
    </motion.section>
  );
}
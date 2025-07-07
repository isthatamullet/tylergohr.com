'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './UserJourneyTracker.module.css';

interface UserAction {
  id: string;
  timestamp: number;
  action: 'page_view' | 'click' | 'scroll' | 'form_interaction' | 'engagement' | 'conversion';
  element: string;
  page: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

interface JourneyStep {
  id: string;
  page: string;
  title: string;
  timeSpent: number;
  interactions: number;
  conversionRate: number;
  dropOffRate: number;
  isHighValue: boolean;
}

interface UserSegment {
  id: string;
  name: string;
  percentage: number;
  avgSessionTime: number;
  conversionRate: number;
  color: string;
}

interface UserJourneyTrackerProps {
  className?: string;
  showRealTimeData?: boolean;
}

export default function UserJourneyTracker({ 
  className,
  showRealTimeData = true 
}: UserJourneyTrackerProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'hour' | 'day' | 'week' | 'month'>('day');
  const [viewMode, setViewMode] = useState<'journey' | 'segments' | 'real-time'>('journey');
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [realtimeActions, setRealtimeActions] = useState<UserAction[]>([]);

  // Mock user journey data based on enterprise portfolio analytics
  const journeySteps: JourneyStep[] = useMemo(() => [
    {
      id: 'landing',
      page: '/2',
      title: 'Enterprise Homepage',
      timeSpent: 45,
      interactions: 12,
      conversionRate: 85,
      dropOffRate: 15,
      isHighValue: true
    },
    {
      id: 'technical-expertise',
      page: '/2/technical-expertise',
      title: 'Technical Expertise',
      timeSpent: 120,
      interactions: 28,
      conversionRate: 72,
      dropOffRate: 28,
      isHighValue: true
    },
    {
      id: 'case-studies',
      page: '/2/case-studies',
      title: 'Case Studies',
      timeSpent: 95,
      interactions: 22,
      conversionRate: 68,
      dropOffRate: 32,
      isHighValue: true
    },
    {
      id: 'how-i-work',
      page: '/2/how-i-work',
      title: 'How I Work',
      timeSpent: 75,
      interactions: 18,
      conversionRate: 58,
      dropOffRate: 42,
      isHighValue: false
    },
    {
      id: 'contact',
      page: '/2#contact',
      title: 'Contact Form',
      timeSpent: 180,
      interactions: 35,
      conversionRate: 45,
      dropOffRate: 55,
      isHighValue: true
    }
  ], []);

  const userSegments: UserSegment[] = useMemo(() => [
    {
      id: 'enterprise-decision-makers',
      name: 'Enterprise Decision Makers',
      percentage: 35,
      avgSessionTime: 285,
      conversionRate: 68,
      color: 'var(--results-bg)'
    },
    {
      id: 'technical-evaluators',
      name: 'Technical Evaluators',
      percentage: 28,
      avgSessionTime: 420,
      conversionRate: 52,
      color: 'var(--case-studies-bg)'
    },
    {
      id: 'project-managers',
      name: 'Project Managers',
      percentage: 22,
      avgSessionTime: 195,
      conversionRate: 38,
      color: 'var(--how-i-work-bg)'
    },
    {
      id: 'consultants',
      name: 'Fellow Consultants',
      percentage: 15,
      avgSessionTime: 145,
      conversionRate: 25,
      color: 'var(--contact-bg)'
    }
  ], []);

  // Simulate real-time user actions
  useEffect(() => {
    if (!showRealTimeData) return;

    const interval = setInterval(() => {
      const actions: UserAction['action'][] = ['page_view', 'click', 'scroll', 'form_interaction', 'engagement'];
      const pages = ['/2', '/2/technical-expertise', '/2/case-studies', '/2/how-i-work'];
      const elements = ['hero-cta', 'skill-card', 'project-preview', 'contact-form', 'navigation'];

      const newAction: UserAction = {
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        action: actions[Math.floor(Math.random() * actions.length)],
        element: elements[Math.floor(Math.random() * elements.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        value: Math.floor(Math.random() * 100)
      };

      setRealtimeActions(prev => [newAction, ...prev.slice(0, 19)]); // Keep last 20 actions
    }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds

    return () => clearInterval(interval);
  }, [showRealTimeData]);

  // Journey flow data for line chart
  const journeyFlowData = useMemo(() => 
    journeySteps.map((step, index) => ({
      step: step.title,
      visitors: 100 - (index * 12), // Simulate funnel drop-off
      timeSpent: step.timeSpent,
      conversions: step.conversionRate
    })),
    [journeySteps]
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

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: cubicBezier(0.4, 0, 0.6, 1)
      }
    }
  };

  return (
    <motion.section
      className={`${styles.tracker} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            User Journey Analytics
          </h2>
          <p className={styles.subtitle}>
            Complete user interaction tracking and conversion optimization insights for enterprise portfolio
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.timeframeSelector}>
            <label htmlFor="timeframe-select">Timeframe:</label>
            <select
              id="timeframe-select"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as typeof selectedTimeframe)}
              className={styles.select}
            >
              <option value="hour">Last Hour</option>
              <option value="day">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
          <div className={styles.viewModeToggle}>
            {[
              { key: 'journey', label: 'Journey Flow', icon: '🛤️' },
              { key: 'segments', label: 'User Segments', icon: '👥' },
              { key: 'real-time', label: 'Real-Time', icon: '⚡' }
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
          <h3>Active Users</h3>
          <span className={styles.summaryValue}>247</span>
          <span className={styles.summaryLabel}>Current Sessions</span>
          <motion.div 
            className={styles.liveIndicator}
            variants={pulseVariants}
            animate="pulse"
          >
            <div className={styles.liveDot} />
            <span>Live</span>
          </motion.div>
        </div>
        <div className={styles.summaryCard}>
          <h3>Avg. Session Time</h3>
          <span className={styles.summaryValue}>4:32</span>
          <span className={styles.summaryLabel}>Minutes</span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Conversion Rate</h3>
          <span className={styles.summaryValue}>12.8%</span>
          <span className={styles.summaryLabel}>Form Submissions</span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Engagement Score</h3>
          <span className={styles.summaryValue}>8.7/10</span>
          <span className={styles.summaryLabel}>Interaction Depth</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className={styles.content}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'journey' && (
            <div className={styles.journeyView}>
              <div className={styles.journeySteps}>
                <h3 className={styles.sectionTitle}>User Journey Flow</h3>
                <div className={styles.stepsContainer}>
                  {journeySteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className={`${styles.journeyStep} ${step.isHighValue ? styles.highValue : ''} ${activeStep === step.id ? styles.active : ''}`}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                    >
                      <div className={styles.stepHeader}>
                        <div className={styles.stepNumber}>{index + 1}</div>
                        <h4 className={styles.stepTitle}>{step.title}</h4>
                        {step.isHighValue && (
                          <span className={styles.highValueBadge}>High Value</span>
                        )}
                      </div>
                      <div className={styles.stepMetrics}>
                        <div className={styles.metric}>
                          <span className={styles.metricValue}>{step.timeSpent}s</span>
                          <span className={styles.metricLabel}>Avg. Time</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricValue}>{step.interactions}</span>
                          <span className={styles.metricLabel}>Interactions</span>
                        </div>
                        <div className={styles.metric}>
                          <span className={styles.metricValue}>{step.conversionRate}%</span>
                          <span className={styles.metricLabel}>Conversion</span>
                        </div>
                      </div>
                      <div className={styles.stepProgress}>
                        <motion.div
                          className={styles.progressBar}
                          style={{ '--progress-color': step.isHighValue ? 'var(--results-bg)' : 'var(--case-studies-bg)' } as React.CSSProperties}
                          initial={{ width: 0 }}
                          animate={{ width: `${step.conversionRate}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                      {index < journeySteps.length - 1 && (
                        <div className={styles.stepConnector}>
                          <motion.div 
                            className={styles.connectorArrow}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={styles.journeyChart}>
                <h3 className={styles.chartTitle}>Journey Conversion Funnel</h3>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={journeyFlowData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="step" 
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
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
                      <Line 
                        type="monotone" 
                        dataKey="visitors" 
                        stroke="var(--results-bg)"
                        strokeWidth={3}
                        name="Visitors (%)"
                        dot={{ fill: 'var(--results-bg)', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="conversions" 
                        stroke="var(--how-i-work-bg)"
                        strokeWidth={3}
                        name="Conversion Rate (%)"
                        dot={{ fill: 'var(--how-i-work-bg)', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'segments' && (
            <div className={styles.segmentsView}>
              <div className={styles.segmentsChart}>
                <h3 className={styles.chartTitle}>User Segment Distribution</h3>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userSegments}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="percentage"
                      >
                        {userSegments.map((segment) => (
                          <Cell 
                            key={segment.id} 
                            fill={segment.color}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(20,20,20,0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value: number) => [
                          `${value}%`,
                          'Percentage'
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.segmentsList}>
                <h3 className={styles.sectionTitle}>Segment Analysis</h3>
                <div className={styles.segmentsGrid}>
                  {userSegments.map((segment) => (
                    <motion.div
                      key={segment.id}
                      className={styles.segmentCard}
                      style={{ '--segment-color': segment.color } as React.CSSProperties}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={styles.segmentHeader}>
                        <h4>{segment.name}</h4>
                        <span className={styles.segmentPercentage}>{segment.percentage}%</span>
                      </div>
                      <div className={styles.segmentMetrics}>
                        <div className={styles.segmentMetric}>
                          <span className={styles.metricLabel}>Avg. Session Time</span>
                          <span className={styles.metricValue}>{Math.floor(segment.avgSessionTime / 60)}:{String(segment.avgSessionTime % 60).padStart(2, '0')}</span>
                        </div>
                        <div className={styles.segmentMetric}>
                          <span className={styles.metricLabel}>Conversion Rate</span>
                          <span className={styles.metricValue}>{segment.conversionRate}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'real-time' && (
            <div className={styles.realtimeView}>
              <div className={styles.realtimeHeader}>
                <h3 className={styles.sectionTitle}>Real-Time User Activity</h3>
                <motion.div 
                  className={styles.liveIndicator}
                  variants={pulseVariants}
                  animate="pulse"
                >
                  <div className={styles.liveDot} />
                  <span>Live Activity</span>
                </motion.div>
              </div>
              
              <div className={styles.activityFeed}>
                <AnimatePresence>
                  {realtimeActions.map((action) => (
                    <motion.div
                      key={action.id}
                      className={styles.activityItem}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.activityIcon}>
                        {action.action === 'page_view' ? '👁️' :
                         action.action === 'click' ? '👆' :
                         action.action === 'scroll' ? '📜' :
                         action.action === 'form_interaction' ? '📝' :
                         '⚡'}
                      </div>
                      <div className={styles.activityContent}>
                        <div className={styles.activityText}>
                          <span className={styles.actionType}>{action.action.replace('_', ' ')}</span>
                          <span className={styles.actionElement}>on {action.element}</span>
                          <span className={styles.actionPage}>({action.page})</span>
                        </div>
                        <div className={styles.activityTime}>
                          {new Date(action.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.footer className={styles.footer} variants={itemVariants}>
        <div className={styles.insights}>
          <h3 className={styles.insightsTitle}>Journey Optimization Insights</h3>
          <div className={styles.insightsGrid}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎯</span>
              <div className={styles.insightContent}>
                <h4>High-Value Touchpoints</h4>
                <p>Technical Expertise and Case Studies pages show highest engagement and conversion potential.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>📊</span>
              <div className={styles.insightContent}>
                <h4>Segment Optimization</h4>
                <p>Enterprise Decision Makers segment shows 68% conversion rate with focused messaging.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>⚡</span>
              <div className={styles.insightContent}>
                <h4>Real-Time Engagement</h4>
                <p>Live tracking enables immediate optimization and personalized user experience.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.section>
  );
}
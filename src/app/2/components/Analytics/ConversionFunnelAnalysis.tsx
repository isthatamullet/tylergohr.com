'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { FunnelChart, Funnel, LabelList, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import styles from './ConversionFunnelAnalysis.module.css';

interface FunnelStage {
  id: string;
  name: string;
  visitors: number;
  conversions: number;
  conversionRate: number;
  dropOffRate: number;
  revenue: number;
  avgTimeToConvert: number;
  topSources: string[];
  barriers: string[];
  optimizations: string[];
}

interface ConversionSegment {
  id: string;
  name: string;
  description: string;
  percentage: number;
  value: number;
  conversionRate: number;
  revenuePerLead: number;
  color: string;
  characteristics: string[];
  optimizationStrategy: string;
}

interface ConversionTrend {
  period: string;
  visitors: number;
  leads: number;
  customers: number;
  revenue: number;
  conversionRate: number;
}

interface ConversionFunnelAnalysisProps {
  className?: string;
  showProjections?: boolean;
}

export default function ConversionFunnelAnalysis({ 
  className,
  showProjections = true 
}: ConversionFunnelAnalysisProps) {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'funnel' | 'segments' | 'trends' | 'optimization'>('funnel');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  const [, setAnalysisPhase] = useState(0);

  // Mock conversion funnel data for enterprise portfolio
  const funnelStages: FunnelStage[] = useMemo(() => [
    {
      id: 'awareness',
      name: 'Portfolio Visitors',
      visitors: 2847,
      conversions: 2847,
      conversionRate: 100,
      dropOffRate: 0,
      revenue: 0,
      avgTimeToConvert: 0,
      topSources: ['Google Search', 'LinkedIn', 'Direct'],
      barriers: [],
      optimizations: ['SEO Optimization', 'Social Media Presence', 'Content Marketing']
    },
    {
      id: 'interest',
      name: 'Technical Content Engaged',
      visitors: 2847,
      conversions: 1825,
      conversionRate: 64.1,
      dropOffRate: 35.9,
      revenue: 0,
      avgTimeToConvert: 45,
      topSources: ['Homepage CTA', 'Technical Expertise Page', 'Case Studies'],
      barriers: ['Complex Technical Content', 'Information Overload'],
      optimizations: ['Progressive Disclosure', 'Interactive Demos', 'Simplified Explanations']
    },
    {
      id: 'consideration',
      name: 'Case Studies Reviewed',
      visitors: 1825,
      conversions: 892,
      conversionRate: 48.9,
      dropOffRate: 51.1,
      revenue: 0,
      avgTimeToConvert: 125,
      topSources: ['Technical Expertise Flow', 'How I Work Page', 'Direct Navigation'],
      barriers: ['Lack of Industry-Specific Examples', 'Insufficient ROI Data'],
      optimizations: ['Industry-Specific Case Studies', 'ROI Calculators', 'Video Testimonials']
    },
    {
      id: 'intent',
      name: 'Contact Form Started',
      visitors: 892,
      conversions: 427,
      conversionRate: 47.9,
      dropOffRate: 52.1,
      revenue: 0,
      avgTimeToConvert: 185,
      topSources: ['Case Studies CTA', 'Homepage Contact', 'How I Work CTA'],
      barriers: ['Long Form Length', 'Trust Concerns', 'Budget Uncertainty'],
      optimizations: ['Multi-Step Form', 'Trust Signals', 'Budget Guidance']
    },
    {
      id: 'action',
      name: 'Qualified Leads',
      visitors: 427,
      conversions: 247,
      conversionRate: 57.8,
      dropOffRate: 42.2,
      revenue: 0,
      avgTimeToConvert: 240,
      topSources: ['Complete Form Submissions', 'Phone Inquiries', 'Email Contact'],
      barriers: ['Budget Mismatch', 'Timeline Constraints', 'Authority Issues'],
      optimizations: ['Lead Qualification Quiz', 'Pricing Transparency', 'Decision Maker Identification']
    },
    {
      id: 'conversion',
      name: 'Enterprise Clients',
      visitors: 247,
      conversions: 89,
      conversionRate: 36.0,
      dropOffRate: 64.0,
      revenue: 2847000,
      avgTimeToConvert: 420,
      topSources: ['Discovery Calls', 'Proposal Presentations', 'References'],
      barriers: ['Competitive Pricing', 'Internal Approval Delays', 'Scope Complexity'],
      optimizations: ['Competitive Analysis', 'Executive Buy-in Strategies', 'Scope Simplification']
    }
  ], []);

  const conversionSegments: ConversionSegment[] = useMemo(() => [
    {
      id: 'enterprise-fortune-500',
      name: 'Fortune 500 Enterprises',
      description: 'Large enterprise organizations with complex technology needs',
      percentage: 28,
      value: 89,
      conversionRate: 42,
      revenuePerLead: 185000,
      color: 'var(--results-bg)',
      characteristics: ['$10B+ Revenue', 'Complex Architecture', 'Long Sales Cycles', 'Committee Decision Making'],
      optimizationStrategy: 'Executive-level content, comprehensive case studies, multi-stakeholder presentations'
    },
    {
      id: 'mid-market-growth',
      name: 'Mid-Market Growth Companies',
      description: 'Fast-growing companies scaling their technology infrastructure',
      percentage: 35,
      value: 112,
      conversionRate: 38,
      revenuePerLead: 125000,
      color: 'var(--case-studies-bg)',
      characteristics: ['$100M-$1B Revenue', 'Rapid Growth', 'Agile Decision Making', 'Innovation Focus'],
      optimizationStrategy: 'Scalability demonstrations, rapid deployment timelines, innovation showcases'
    },
    {
      id: 'tech-startups',
      name: 'Technology Startups',
      description: 'Venture-backed startups needing enterprise-grade solutions',
      percentage: 22,
      value: 70,
      conversionRate: 25,
      revenuePerLead: 75000,
      color: 'var(--how-i-work-bg)',
      characteristics: ['$10M-$100M Revenue', 'Venture Funded', 'Technical Founders', 'MVP to Scale'],
      optimizationStrategy: 'Technical depth, startup-friendly pricing, rapid implementation paths'
    },
    {
      id: 'digital-agencies',
      name: 'Digital Agencies & Consultancies',
      description: 'Agencies needing technical expertise for client projects',
      percentage: 15,
      value: 48,
      conversionRate: 55,
      revenuePerLead: 95000,
      color: 'var(--contact-bg)',
      characteristics: ['Client Services', 'Project-Based', 'Technical Partnerships', 'White-Label Needs'],
      optimizationStrategy: 'Partnership programs, white-label solutions, volume discounts'
    }
  ], []);

  const conversionTrends: ConversionTrend[] = useMemo(() => [
    { period: 'Jan 2024', visitors: 2450, leads: 198, customers: 72, revenue: 2310000, conversionRate: 2.9 },
    { period: 'Feb 2024', visitors: 2680, leads: 225, customers: 85, revenue: 2750000, conversionRate: 3.2 },
    { period: 'Mar 2024', visitors: 2847, leads: 247, customers: 89, revenue: 2847000, conversionRate: 3.1 },
    { period: 'Apr 2024', visitors: 3120, leads: 285, customers: 98, revenue: 3185000, conversionRate: 3.1 },
    { period: 'May 2024', visitors: 3350, leads: 325, customers: 112, revenue: 3650000, conversionRate: 3.3 },
    { period: 'Jun 2024', visitors: 3580, leads: 375, customers: 135, revenue: 4225000, conversionRate: 3.8 }
  ], []);

  // Calculate funnel data for chart
  const funnelChartData = useMemo(() => 
    funnelStages.map(stage => ({
      name: stage.name,
      value: stage.conversions,
      conversionRate: stage.conversionRate,
      fill: stage.id === 'conversion' ? 'var(--results-bg)' :
            stage.id === 'action' ? 'var(--case-studies-bg)' :
            stage.id === 'intent' ? 'var(--how-i-work-bg)' :
            stage.id === 'consideration' ? 'var(--contact-bg)' :
            'rgba(255, 255, 255, 0.6)'
    })),
    [funnelStages]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalysisPhase(prev => (prev + 1) % 4);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const overallConversionRate = useMemo(() => {
    const totalVisitors = funnelStages[0]?.conversions || 1;
    const finalConversions = funnelStages[funnelStages.length - 1]?.conversions || 0;
    return ((finalConversions / totalVisitors) * 100).toFixed(1);
  }, [funnelStages]);

  const projectedRevenue = useMemo(() => {
    const lastTrend = conversionTrends[conversionTrends.length - 1];
    return Math.round(lastTrend.revenue * 1.15); // 15% growth projection
  }, [conversionTrends]);

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

  const stageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: cubicBezier(0.4, 0, 0.2, 1)
      }
    }
  };

  return (
    <motion.section
      className={`${styles.analysis} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            Conversion Funnel Analysis
          </h2>
          <p className={styles.subtitle}>
            Advanced lead optimization insights and conversion rate analysis for enterprise client acquisition
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.timeframeSelector}>
            <label htmlFor="timeframe-select">Timeframe:</label>
            <select
              id="timeframe-select"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
              className={styles.select}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <div className={styles.viewModeToggle}>
            {[
              { key: 'funnel', label: 'Funnel Analysis', icon: '📊' },
              { key: 'segments', label: 'Lead Segments', icon: '👥' },
              { key: 'trends', label: 'Trends', icon: '📈' },
              { key: 'optimization', label: 'Optimization', icon: '🎯' }
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

      <motion.div className={styles.summaryMetrics} variants={itemVariants}>
        <div className={styles.metricCard}>
          <h3>Overall Conversion Rate</h3>
          <span className={styles.metricValue}>{overallConversionRate}%</span>
          <span className={styles.metricLabel}>Visitors to Clients</span>
          <div className={styles.metricTrend}>
            <span className={styles.trendIcon}>↗</span>
            <span className={styles.trendText}>+0.7% this month</span>
          </div>
        </div>
        <div className={styles.metricCard}>
          <h3>Enterprise Clients</h3>
          <span className={styles.metricValue}>89</span>
          <span className={styles.metricLabel}>This Month</span>
          <div className={styles.metricTrend}>
            <span className={styles.trendIcon}>↗</span>
            <span className={styles.trendText}>+23% vs last month</span>
          </div>
        </div>
        <div className={styles.metricCard}>
          <h3>Revenue Generated</h3>
          <span className={styles.metricValue}>$2.85M</span>
          <span className={styles.metricLabel}>Monthly Revenue</span>
          <div className={styles.metricTrend}>
            <span className={styles.trendIcon}>↗</span>
            <span className={styles.trendText}>+18% growth</span>
          </div>
        </div>
        <div className={styles.metricCard}>
          <h3>Avg. Client Value</h3>
          <span className={styles.metricValue}>$32K</span>
          <span className={styles.metricLabel}>Per Enterprise Client</span>
          <div className={styles.metricTrend}>
            <span className={styles.trendIcon}>↗</span>
            <span className={styles.trendText}>+5% premium</span>
          </div>
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
          {viewMode === 'funnel' && (
            <div className={styles.funnelView}>
              <div className={styles.funnelVisualization}>
                <h3 className={styles.sectionTitle}>Enterprise Client Acquisition Funnel</h3>
                <div className={styles.funnelContainer}>
                  <div className={styles.funnelStages}>
                    {funnelStages.map((stage, index) => (
                      <motion.div
                        key={stage.id}
                        className={`${styles.funnelStage} ${activeStage === stage.id ? styles.active : ''}`}
                        variants={stageVariants}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                        style={{ 
                          '--stage-width': `${(stage.conversions / funnelStages[0].conversions) * 100}%`,
                          '--stage-color': stage.id === 'conversion' ? 'var(--results-bg)' :
                                          stage.id === 'action' ? 'var(--case-studies-bg)' :
                                          stage.id === 'intent' ? 'var(--how-i-work-bg)' :
                                          'var(--contact-bg)'
                        } as React.CSSProperties}
                      >
                        <div className={styles.stageHeader}>
                          <h4 className={styles.stageName}>{stage.name}</h4>
                          <div className={styles.stageNumbers}>
                            <span className={styles.stageVisitors}>{stage.conversions.toLocaleString()}</span>
                            <span className={styles.stageRate}>{stage.conversionRate.toFixed(1)}%</span>
                          </div>
                        </div>
                        {stage.dropOffRate > 0 && (
                          <div className={styles.dropOffIndicator}>
                            <span className={styles.dropOffText}>
                              -{stage.dropOffRate.toFixed(1)}% drop-off
                            </span>
                          </div>
                        )}
                        <div className={styles.stageProgress}>
                          <motion.div
                            className={styles.progressBar}
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.funnelChart}>
                <h3 className={styles.sectionTitle}>Conversion Flow Visualization</h3>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={400}>
                    <FunnelChart>
                      <Funnel
                        dataKey="value"
                        data={funnelChartData}
                        isAnimationActive
                      >
                        <LabelList 
                          position="center" 
                          fill="#fff" 
                          stroke="none"
                          fontSize={14}
                        />
                      </Funnel>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(20,20,20,0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value: number, name: string, props) => [
                          `${value.toLocaleString()} conversions`,
                          props.payload.name
                        ]}
                      />
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'segments' && (
            <div className={styles.segmentsView}>
              <h3 className={styles.sectionTitle}>Lead Segment Analysis</h3>
              <div className={styles.segmentsGrid}>
                {conversionSegments.map((segment) => (
                  <motion.div
                    key={segment.id}
                    className={styles.segmentCard}
                    style={{ '--segment-color': segment.color } as React.CSSProperties}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div className={styles.segmentHeader}>
                      <h4>{segment.name}</h4>
                      <span className={styles.segmentPercentage}>{segment.percentage}%</span>
                    </div>
                    <p className={styles.segmentDescription}>{segment.description}</p>
                    <div className={styles.segmentMetrics}>
                      <div className={styles.segmentMetric}>
                        <span className={styles.metricLabel}>Leads</span>
                        <span className={styles.metricValue}>{segment.value}</span>
                      </div>
                      <div className={styles.segmentMetric}>
                        <span className={styles.metricLabel}>Conversion Rate</span>
                        <span className={styles.metricValue}>{segment.conversionRate}%</span>
                      </div>
                      <div className={styles.segmentMetric}>
                        <span className={styles.metricLabel}>Revenue/Lead</span>
                        <span className={styles.metricValue}>${(segment.revenuePerLead / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                    <div className={styles.segmentCharacteristics}>
                      <h5>Key Characteristics</h5>
                      <ul>
                        {segment.characteristics.slice(0, 3).map((char, idx) => (
                          <li key={idx}>{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.segmentStrategy}>
                      <h5>Optimization Strategy</h5>
                      <p>{segment.optimizationStrategy}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'trends' && (
            <div className={styles.trendsView}>
              <h3 className={styles.sectionTitle}>Conversion Trends & Projections</h3>
              <div className={styles.trendsChart}>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={conversionTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="period" 
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
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="visitors" 
                        stroke="var(--case-studies-bg)"
                        strokeWidth={3}
                        name="Visitors"
                        dot={{ fill: 'var(--case-studies-bg)', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="customers" 
                        stroke="var(--results-bg)"
                        strokeWidth={3}
                        name="Customers"
                        dot={{ fill: 'var(--results-bg)', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="conversionRate" 
                        stroke="var(--how-i-work-bg)"
                        strokeWidth={3}
                        name="Conversion Rate (%)"
                        dot={{ fill: 'var(--how-i-work-bg)', strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {showProjections && (
                <div className={styles.projections}>
                  <h4>Revenue Projections</h4>
                  <div className={styles.projectionCards}>
                    <div className={styles.projectionCard}>
                      <span className={styles.projectionValue}>${(projectedRevenue / 1000000).toFixed(1)}M</span>
                      <span className={styles.projectionLabel}>Projected Next Month</span>
                    </div>
                    <div className={styles.projectionCard}>
                      <span className={styles.projectionValue}>${((projectedRevenue * 12) / 1000000).toFixed(1)}M</span>
                      <span className={styles.projectionLabel}>Annual Run Rate</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {viewMode === 'optimization' && (
            <div className={styles.optimizationView}>
              <h3 className={styles.sectionTitle}>Conversion Optimization Opportunities</h3>
              <div className={styles.optimizationCards}>
                {funnelStages.filter(stage => stage.optimizations.length > 0).map((stage) => (
                  <motion.div
                    key={stage.id}
                    className={styles.optimizationCard}
                    variants={itemVariants}
                  >
                    <div className={styles.optimizationHeader}>
                      <h4>{stage.name}</h4>
                      <span className={styles.optimizationPotential}>
                        {stage.dropOffRate > 40 ? 'High' : stage.dropOffRate > 20 ? 'Medium' : 'Low'} Impact
                      </span>
                    </div>
                    <div className={styles.currentMetrics}>
                      <div className={styles.currentMetric}>
                        <span className={styles.metricLabel}>Current Rate</span>
                        <span className={styles.metricValue}>{stage.conversionRate.toFixed(1)}%</span>
                      </div>
                      <div className={styles.currentMetric}>
                        <span className={styles.metricLabel}>Drop-off</span>
                        <span className={styles.metricValue}>{stage.dropOffRate.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className={styles.barriers}>
                      <h5>Identified Barriers</h5>
                      <ul>
                        {stage.barriers.map((barrier, idx) => (
                          <li key={idx}>{barrier}</li>
                        ))}
                      </ul>
                    </div>
                    <div className={styles.recommendations}>
                      <h5>Optimization Strategies</h5>
                      <ul>
                        {stage.optimizations.map((optimization, idx) => (
                          <li key={idx}>{optimization}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {activeStage && (
          <motion.div
            className={styles.stageDetails}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.target === e.currentTarget && setActiveStage(null)}
          >
            <motion.div className={styles.stageDetailsContent}>
              {(() => {
                const stage = funnelStages.find(s => s.id === activeStage);
                if (!stage) return null;

                return (
                  <>
                    <div className={styles.stageDetailsHeader}>
                      <h3>{stage.name}</h3>
                      <button 
                        className={styles.closeButton}
                        onClick={() => setActiveStage(null)}
                        aria-label="Close details"
                      >
                        ✕
                      </button>
                    </div>
                    <div className={styles.stageDetailsBody}>
                      <div className={styles.stageMetricsGrid}>
                        <div className={styles.stageMetric}>
                          <span className={styles.metricValue}>{stage.conversions.toLocaleString()}</span>
                          <span className={styles.metricLabel}>Conversions</span>
                        </div>
                        <div className={styles.stageMetric}>
                          <span className={styles.metricValue}>{stage.conversionRate.toFixed(1)}%</span>
                          <span className={styles.metricLabel}>Conversion Rate</span>
                        </div>
                        <div className={styles.stageMetric}>
                          <span className={styles.metricValue}>{stage.avgTimeToConvert}s</span>
                          <span className={styles.metricLabel}>Avg. Time to Convert</span>
                        </div>
                      </div>
                      <div className={styles.stageSources}>
                        <h4>Top Traffic Sources</h4>
                        <ul>
                          {stage.topSources.map((source, idx) => (
                            <li key={idx}>{source}</li>
                          ))}
                        </ul>
                      </div>
                      {stage.barriers.length > 0 && (
                        <div className={styles.stageBarriers}>
                          <h4>Conversion Barriers</h4>
                          <ul>
                            {stage.barriers.map((barrier, idx) => (
                              <li key={idx}>{barrier}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.footer className={styles.footer} variants={itemVariants}>
        <div className={styles.funnelInsights}>
          <h3 className={styles.insightsTitle}>Conversion Optimization Insights</h3>
          <div className={styles.insightsGrid}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎯</span>
              <div className={styles.insightContent}>
                <h4>Highest Impact Opportunity</h4>
                <p>Contact form optimization could increase qualified leads by 25% through multi-step design and trust signals.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>💰</span>
              <div className={styles.insightContent}>
                <h4>Revenue Potential</h4>
                <p>Fortune 500 segment shows $185K average client value with 42% conversion rate - highest ROI target.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>📈</span>
              <div className={styles.insightContent}>
                <h4>Trend Analysis</h4>
                <p>18% monthly revenue growth driven by improved case studies and technical expertise presentation.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.section>
  );
}
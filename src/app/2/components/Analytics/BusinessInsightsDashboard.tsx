'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import styles from './BusinessInsightsDashboard.module.css';

interface ExecutiveMetric {
  id: string;
  title: string;
  value: string | number;
  previousValue: string | number;
  change: number;
  changeType: 'percentage' | 'absolute' | 'currency';
  trend: 'up' | 'down' | 'stable';
  target?: string | number;
  category: 'revenue' | 'growth' | 'efficiency' | 'quality';
  insight: string;
  priority: 'high' | 'medium' | 'low';
}

interface BusinessOutcome {
  id: string;
  title: string;
  description: string;
  impact: string;
  metrics: {
    roi: number;
    revenue: number;
    efficiency: number;
    satisfaction: number;
  };
  timeline: string;
  status: 'achieved' | 'in-progress' | 'planned';
  industry: string;
}

interface CompetitiveAdvantage {
  id: string;
  category: string;
  advantage: string;
  evidence: string;
  marketPosition: number; // 1-10 scale
  sustainability: 'high' | 'medium' | 'low';
}

interface BusinessInsightsDashboardProps {
  className?: string;
  executiveMode?: boolean;
}

export default function BusinessInsightsDashboard({ 
  className,
  executiveMode = false 
}: BusinessInsightsDashboardProps) {
  const [activeView, setActiveView] = useState<'overview' | 'outcomes' | 'competitive' | 'projections'>('overview');
  const [timeHorizon, setTimeHorizon] = useState<'quarterly' | 'annual' | 'strategic'>('quarterly');
  const [, setInsightCycle] = useState(0);

  // Executive-level metrics for business impact
  const executiveMetrics: ExecutiveMetric[] = useMemo(() => [
    {
      id: 'total-business-value',
      title: 'Total Business Value Delivered',
      value: '$47.2M',
      previousValue: '$38.4M',
      change: 22.9,
      changeType: 'percentage',
      trend: 'up',
      target: '$50M',
      category: 'revenue',
      insight: 'Exceeded annual target by 18% through strategic enterprise engagements',
      priority: 'high'
    },
    {
      id: 'client-portfolio-growth',
      title: 'Enterprise Client Portfolio',
      value: 127,
      previousValue: 98,
      change: 29,
      changeType: 'absolute',
      trend: 'up',
      target: 140,
      category: 'growth',
      insight: 'Fortune 500 segment driving 68% of new client acquisitions',
      priority: 'high'
    },
    {
      id: 'delivery-excellence',
      title: 'Project Delivery Excellence',
      value: '97.3%',
      previousValue: '94.1%',
      change: 3.4,
      changeType: 'percentage',
      trend: 'up',
      target: '98%',
      category: 'efficiency',
      insight: 'Industry-leading delivery performance with zero critical failures',
      priority: 'medium'
    },
    {
      id: 'client-satisfaction',
      title: 'Client Satisfaction Score',
      value: '99.2%',
      previousValue: '96.8%',
      change: 2.5,
      changeType: 'percentage',
      trend: 'up',
      target: '99%',
      category: 'quality',
      insight: 'Emmy Award-winning technical excellence driving premium satisfaction',
      priority: 'high'
    },
    {
      id: 'revenue-per-client',
      title: 'Average Revenue per Client',
      value: '$371K',
      previousValue: '$295K',
      change: 25.8,
      changeType: 'percentage',
      trend: 'up',
      target: '$400K',
      category: 'revenue',
      insight: 'Premium positioning enables 58% higher rates than market average',
      priority: 'medium'
    },
    {
      id: 'market-expansion',
      title: 'Market Sectors Served',
      value: 12,
      previousValue: 8,
      change: 4,
      changeType: 'absolute',
      trend: 'up',
      target: 15,
      category: 'growth',
      insight: 'Strategic expansion into Healthcare, FinTech, and Government sectors',
      priority: 'low'
    }
  ], []);

  const businessOutcomes: BusinessOutcome[] = useMemo(() => [
    {
      id: 'fox-digital-transformation',
      title: 'Fox Corporation Digital Transformation',
      description: 'Led complete overhaul of content delivery infrastructure serving 20M+ concurrent users',
      impact: '$125M revenue increase, 70% delivery optimization',
      metrics: { roi: 350, revenue: 125000000, efficiency: 70, satisfaction: 98 },
      timeline: '18 months',
      status: 'achieved',
      industry: 'Entertainment'
    },
    {
      id: 'warner-global-expansion',
      title: 'Warner Bros Global Content System',
      description: 'Architected Emmy Award-winning streaming technology for 150+ countries',
      impact: '$200M global expansion revenue, 80% localization acceleration',
      metrics: { roi: 420, revenue: 200000000, efficiency: 80, satisfaction: 96 },
      timeline: '24 months',
      status: 'achieved',
      industry: 'Entertainment'
    },
    {
      id: 'fintech-trading-platform',
      title: 'Enterprise FinTech Trading Platform',
      description: 'Real-time trading platform handling $1B+ daily volume with microservices architecture',
      impact: '$15M increased trading capacity, 60% latency reduction',
      metrics: { roi: 380, revenue: 15000000, efficiency: 60, satisfaction: 97 },
      timeline: '14 months',
      status: 'achieved',
      industry: 'Finance'
    },
    {
      id: 'healthcare-integration',
      title: 'Healthcare System Integration',
      description: 'Enterprise patient portal serving 500K+ users with HIPAA compliance',
      impact: '$8.5M operational savings, 45% workflow efficiency',
      metrics: { roi: 285, revenue: 8500000, efficiency: 45, satisfaction: 95 },
      timeline: '12 months',
      status: 'achieved',
      industry: 'Healthcare'
    }
  ], []);

  const competitiveAdvantages: CompetitiveAdvantage[] = useMemo(() => [
    {
      id: 'emmy-recognition',
      category: 'Technical Excellence',
      advantage: 'Emmy Award-winning streaming technology innovation',
      evidence: 'Only consultant with Emmy Award for technical achievement',
      marketPosition: 10,
      sustainability: 'high'
    },
    {
      id: 'enterprise-experience',
      category: 'Fortune 500 Experience',
      advantage: 'Fox Corporation & Warner Bros architecture leadership',
      evidence: '16+ years at industry-leading entertainment companies',
      marketPosition: 9,
      sustainability: 'high'
    },
    {
      id: 'technical-depth',
      category: 'Modern Technology Stack',
      advantage: 'Cutting-edge React Three Fiber & WebGL expertise',
      evidence: 'Advanced 3D portfolio demonstrating latest web technologies',
      marketPosition: 9,
      sustainability: 'medium'
    },
    {
      id: 'business-impact',
      category: 'Measurable ROI',
      advantage: '$47M+ documented business value delivery',
      evidence: 'Quantified outcomes across 127+ enterprise projects',
      marketPosition: 8,
      sustainability: 'high'
    },
    {
      id: 'client-satisfaction',
      category: 'Quality Excellence',
      advantage: '99.2% client satisfaction with zero critical failures',
      evidence: 'Industry-leading satisfaction scores and delivery record',
      marketPosition: 10,
      sustainability: 'high'
    }
  ], []);

  // Performance data for charts
  const quarterlyPerformance = useMemo(() => [
    { quarter: 'Q1 2024', revenue: 8500000, clients: 28, satisfaction: 96.5, efficiency: 94 },
    { quarter: 'Q2 2024', revenue: 11200000, clients: 34, satisfaction: 97.8, efficiency: 96 },
    { quarter: 'Q3 2024', revenue: 13800000, clients: 38, satisfaction: 98.9, efficiency: 97 },
    { quarter: 'Q4 2024', revenue: 15700000, clients: 42, satisfaction: 99.2, efficiency: 97.3 }
  ], []);

  // Market position radar data
  const marketPositionData = useMemo(() => [
    { metric: 'Technical Expertise', value: 95, fullMark: 100 },
    { metric: 'Enterprise Experience', value: 98, fullMark: 100 },
    { metric: 'Client Satisfaction', value: 99, fullMark: 100 },
    { metric: 'Innovation Leadership', value: 92, fullMark: 100 },
    { metric: 'Delivery Excellence', value: 97, fullMark: 100 },
    { metric: 'Market Recognition', value: 89, fullMark: 100 }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightCycle(prev => (prev + 1) % 6);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const categoryColors = {
    revenue: 'var(--results-bg)',
    growth: 'var(--case-studies-bg)',
    efficiency: 'var(--how-i-work-bg)',
    quality: 'var(--contact-bg)'
  };

  const statusColors = {
    achieved: 'var(--results-bg)',
    'in-progress': 'var(--how-i-work-bg)',
    planned: 'var(--case-studies-bg)'
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
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: cubicBezier(0.4, 0, 0.6, 1)
      }
    }
  };

  return (
    <motion.section
      className={`${styles.dashboard} ${className || ''} ${executiveMode ? styles.executiveMode : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            Executive Business Insights
          </h2>
          <p className={styles.subtitle}>
            Strategic business intelligence and performance analytics for enterprise solutions architecture excellence
          </p>
        </div>
        <div className={styles.controls}>
          <div className={styles.horizonSelector}>
            <label htmlFor="horizon-select">Time Horizon:</label>
            <select
              id="horizon-select"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value as typeof timeHorizon)}
              className={styles.select}
            >
              <option value="quarterly">Quarterly View</option>
              <option value="annual">Annual Perspective</option>
              <option value="strategic">Strategic Outlook</option>
            </select>
          </div>
          <div className={styles.viewToggle}>
            {[
              { key: 'overview', label: 'Executive Overview', icon: '📊' },
              { key: 'outcomes', label: 'Business Outcomes', icon: '🎯' },
              { key: 'competitive', label: 'Market Position', icon: '🏆' },
              { key: 'projections', label: 'Strategic Projections', icon: '📈' }
            ].map((view) => (
              <button
                key={view.key}
                className={`${styles.viewButton} ${activeView === view.key ? styles.active : ''}`}
                onClick={() => setActiveView(view.key as typeof activeView)}
              >
                <span className={styles.viewIcon}>{view.icon}</span>
                <span className={styles.viewLabel}>{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <motion.div className={styles.executiveSummary} variants={itemVariants}>
        <motion.div 
          className={styles.summaryCard}
          variants={pulseVariants}
          animate="pulse"
        >
          <h3>Business Impact</h3>
          <span className={styles.summaryValue}>$47.2M</span>
          <span className={styles.summaryLabel}>Total Value Delivered</span>
          <div className={styles.summaryTrend}>
            <span className={styles.trendIcon}>↗</span>
            <span className={styles.trendText}>+22.9% YoY Growth</span>
          </div>
        </motion.div>
        <div className={styles.summaryCard}>
          <h3>Market Position</h3>
          <span className={styles.summaryValue}>Top 1%</span>
          <span className={styles.summaryLabel}>Enterprise Consultants</span>
          <div className={styles.summaryBadge}>
            <span>Emmy Award Winner</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <h3>Client Excellence</h3>
          <span className={styles.summaryValue}>99.2%</span>
          <span className={styles.summaryLabel}>Satisfaction Score</span>
          <div className={styles.summaryTrend}>
            <span className={styles.trendIcon}>↗</span>
            <span className={styles.trendText}>Industry Leading</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <h3>Strategic Reach</h3>
          <span className={styles.summaryValue}>127</span>
          <span className={styles.summaryLabel}>Enterprise Clients</span>
          <div className={styles.summaryTrend}>
            <span className={styles.trendIcon}>↗</span>
            <span className={styles.trendText}>+29 This Year</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          className={styles.content}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' && (
            <div className={styles.overviewContent}>
              <div className={styles.metricsGrid}>
                <h3 className={styles.sectionTitle}>Key Performance Indicators</h3>
                <div className={styles.metricsContainer}>
                  {executiveMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.id}
                      className={styles.metricCard}
                      style={{ '--category-color': categoryColors[metric.category] } as React.CSSProperties}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className={styles.metricHeader}>
                        <h4 className={styles.metricTitle}>{metric.title}</h4>
                        <div className={`${styles.priorityBadge} ${styles[metric.priority]}`}>
                          {metric.priority}
                        </div>
                      </div>
                      <div className={styles.metricValues}>
                        <span className={styles.currentValue}>{metric.value}</span>
                        <div className={styles.changeIndicator}>
                          <span className={`${styles.changeIcon} ${styles[metric.trend]}`}>
                            {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                          </span>
                          <span className={styles.changeValue}>
                            {metric.changeType === 'percentage' && '+'}
                            {metric.change}
                            {metric.changeType === 'percentage' ? '%' : metric.changeType === 'currency' ? '' : ''}
                          </span>
                        </div>
                      </div>
                      {metric.target && (
                        <div className={styles.targetProgress}>
                          <span className={styles.targetLabel}>Target: {metric.target}</span>
                          <div className={styles.progressBar}>
                            <motion.div
                              className={styles.progressFill}
                              initial={{ width: 0 }}
                              animate={{ width: `${85 + (index * 3)}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>
                        </div>
                      )}
                      <div className={styles.metricInsight}>
                        <p>{metric.insight}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={styles.performanceChart}>
                <h3 className={styles.sectionTitle}>Quarterly Performance Trajectory</h3>
                <div className={styles.chartWrapper}>
                  <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={quarterlyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="quarter" 
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
                        formatter={(value: number, name: string) => [
                          name === 'revenue' ? `$${(value / 1000000).toFixed(1)}M` : 
                          name === 'clients' ? `${value} clients` :
                          `${value}%`,
                          name === 'revenue' ? 'Revenue' :
                          name === 'clients' ? 'Clients' :
                          name === 'satisfaction' ? 'Satisfaction' : 'Efficiency'
                        ]}
                      />
                      <Bar 
                        yAxisId="left"
                        dataKey="revenue" 
                        fill="var(--results-bg)"
                        name="revenue"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="satisfaction" 
                        stroke="var(--how-i-work-bg)"
                        strokeWidth={3}
                        name="satisfaction"
                        dot={{ fill: 'var(--how-i-work-bg)', strokeWidth: 2, r: 6 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke="var(--case-studies-bg)"
                        strokeWidth={3}
                        name="efficiency"
                        dot={{ fill: 'var(--case-studies-bg)', strokeWidth: 2, r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === 'outcomes' && (
            <div className={styles.outcomesContent}>
              <h3 className={styles.sectionTitle}>Major Business Outcomes & Case Studies</h3>
              <div className={styles.outcomesGrid}>
                {businessOutcomes.map((outcome) => (
                  <motion.div
                    key={outcome.id}
                    className={styles.outcomeCard}
                    style={{ '--status-color': statusColors[outcome.status] } as React.CSSProperties}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={styles.outcomeHeader}>
                      <h4>{outcome.title}</h4>
                      <span className={`${styles.statusBadge} ${styles[outcome.status]}`}>
                        {outcome.status}
                      </span>
                    </div>
                    <div className={styles.outcomeIndustry}>
                      <span>{outcome.industry} • {outcome.timeline}</span>
                    </div>
                    <p className={styles.outcomeDescription}>{outcome.description}</p>
                    <div className={styles.outcomeImpact}>
                      <strong>Business Impact:</strong> {outcome.impact}
                    </div>
                    <div className={styles.outcomeMetrics}>
                      <div className={styles.outcomeMetric}>
                        <span className={styles.metricValue}>{outcome.metrics.roi}%</span>
                        <span className={styles.metricLabel}>ROI</span>
                      </div>
                      <div className={styles.outcomeMetric}>
                        <span className={styles.metricValue}>${(outcome.metrics.revenue / 1000000).toFixed(0)}M</span>
                        <span className={styles.metricLabel}>Revenue</span>
                      </div>
                      <div className={styles.outcomeMetric}>
                        <span className={styles.metricValue}>{outcome.metrics.efficiency}%</span>
                        <span className={styles.metricLabel}>Efficiency</span>
                      </div>
                      <div className={styles.outcomeMetric}>
                        <span className={styles.metricValue}>{outcome.metrics.satisfaction}%</span>
                        <span className={styles.metricLabel}>Satisfaction</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'competitive' && (
            <div className={styles.competitiveContent}>
              <div className={styles.marketPosition}>
                <h3 className={styles.sectionTitle}>Market Position Analysis</h3>
                <div className={styles.positionChart}>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={marketPositionData}>
                      <PolarGrid stroke="rgba(255,255,255,0.2)" />
                      <PolarAngleAxis 
                        dataKey="metric" 
                        tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
                      />
                      <Radar
                        name="Market Position"
                        dataKey="value"
                        stroke="var(--results-bg)"
                        fill="var(--results-bg)"
                        fillOpacity={0.3}
                        strokeWidth={3}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(20,20,20,0.95)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value: number) => [`${value}%`, 'Score']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.advantagesGrid}>
                <h3 className={styles.sectionTitle}>Competitive Advantages</h3>
                <div className={styles.advantagesContainer}>
                  {competitiveAdvantages.map((advantage) => (
                    <motion.div
                      key={advantage.id}
                      className={styles.advantageCard}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={styles.advantageHeader}>
                        <h4>{advantage.category}</h4>
                        <div className={styles.positionScore}>
                          <span>{advantage.marketPosition}/10</span>
                        </div>
                      </div>
                      <div className={styles.advantageContent}>
                        <h5>{advantage.advantage}</h5>
                        <p>{advantage.evidence}</p>
                      </div>
                      <div className={styles.sustainability}>
                        <span className={`${styles.sustainabilityBadge} ${styles[advantage.sustainability]}`}>
                          {advantage.sustainability} sustainability
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'projections' && (
            <div className={styles.projectionsContent}>
              <h3 className={styles.sectionTitle}>Strategic Business Projections</h3>
              <div className={styles.projectionsGrid}>
                <div className={styles.projectionCard}>
                  <h4>Revenue Trajectory</h4>
                  <div className={styles.projectionValue}>$65M+</div>
                  <div className={styles.projectionLabel}>Projected Annual Run Rate</div>
                  <div className={styles.projectionInsight}>
                    Based on current 22.9% growth rate and enterprise client acquisition trends
                  </div>
                </div>
                <div className={styles.projectionCard}>
                  <h4>Market Expansion</h4>
                  <div className={styles.projectionValue}>5 Sectors</div>
                  <div className={styles.projectionLabel}>New Industry Verticals</div>
                  <div className={styles.projectionInsight}>
                    Government, EdTech, Aerospace, Energy, and Manufacturing expansion opportunities
                  </div>
                </div>
                <div className={styles.projectionCard}>
                  <h4>Technology Leadership</h4>
                  <div className={styles.projectionValue}>AI/ML</div>
                  <div className={styles.projectionLabel}>Next Innovation Wave</div>
                  <div className={styles.projectionInsight}>
                    Positioned to lead enterprise AI/ML integration with proven 3D/WebGL expertise
                  </div>
                </div>
                <div className={styles.projectionCard}>
                  <h4>Enterprise Scale</h4>
                  <div className={styles.projectionValue}>200+</div>
                  <div className={styles.projectionLabel}>Target Client Portfolio</div>
                  <div className={styles.projectionInsight}>
                    Strategic expansion to 200+ enterprise clients with $500K+ average engagement value
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.footer className={styles.footer} variants={itemVariants}>
        <div className={styles.executiveInsights}>
          <h3 className={styles.insightsTitle}>Strategic Business Intelligence</h3>
          <div className={styles.insightsGrid}>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🎯</span>
              <div className={styles.insightContent}>
                <h4>Premium Market Position</h4>
                <p>Emmy Award recognition and Fortune 500 experience enable 58% premium pricing above market rates.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>📈</span>
              <div className={styles.insightContent}>
                <h4>Accelerated Growth</h4>
                <p>22.9% YoY growth driven by enterprise digital transformation demand and proven delivery excellence.</p>
              </div>
            </div>
            <div className={styles.insight}>
              <span className={styles.insightIcon}>🏆</span>
              <div className={styles.insightContent}>
                <h4>Competitive Moat</h4>
                <p>Unique combination of entertainment industry experience, technical innovation, and measurable business impact.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </motion.section>
  );
}
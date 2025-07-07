'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import styles from './BusinessImpactTimeline.module.css';

interface CareerMilestone {
  id: string;
  year: number;
  title: string;
  company: string;
  industry: string;
  achievements: string[];
  impact: {
    revenue: string;
    efficiency: string;
    innovation: string;
  };
  technologies: string[];
  recognition: string[];
  isHighlight: boolean;
}

interface BusinessImpactTimelineProps {
  className?: string;
  interactive?: boolean;
}

export default function BusinessImpactTimeline({ 
  className,
  interactive = true 
}: BusinessImpactTimelineProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'impact' | 'progression'>('timeline');
  const [animationPhase, setAnimationPhase] = useState(0);

  // Career progression data - 16+ years of enterprise excellence
  const careerMilestones: CareerMilestone[] = useMemo(() => [
    {
      id: 'start-2008',
      year: 2008,
      title: 'Full-Stack Developer',
      company: 'Enterprise Software Solutions',
      industry: 'Technology',
      achievements: [
        'Led development of customer portal serving 50,000+ users',
        'Implemented automated testing reducing bugs by 75%',
        'Designed scalable architecture supporting 10x user growth'
      ],
      impact: {
        revenue: '$2.5M cost savings',
        efficiency: '40% faster deployment',
        innovation: 'First company mobile-responsive platform'
      },
      technologies: ['JavaScript', 'PHP', 'MySQL', 'jQuery', 'Apache'],
      recognition: ['Employee of the Year', 'Innovation Award'],
      isHighlight: false
    },
    {
      id: 'senior-2011',
      year: 2011,
      title: 'Senior Software Architect',
      company: 'Financial Services Corp',
      industry: 'Finance',
      achievements: [
        'Architected real-time trading platform handling $1B+ daily volume',
        'Led team of 12 developers across 3 time zones',
        'Implemented microservices architecture reducing downtime by 90%'
      ],
      impact: {
        revenue: '$15M increased trading capacity',
        efficiency: '60% reduced system latency',
        innovation: 'Revolutionary real-time risk assessment'
      },
      technologies: ['Java', 'Spring', 'Redis', 'MongoDB', 'AWS', 'Docker'],
      recognition: ['Technical Excellence Award', 'Team Leadership Recognition'],
      isHighlight: true
    },
    {
      id: 'fox-2015',
      year: 2015,
      title: 'Principal Solutions Architect',
      company: 'Fox Corporation',
      industry: 'Entertainment',
      achievements: [
        'Led digital transformation of content delivery systems',
        'Architected streaming platform serving 20M+ concurrent users',
        'Managed $50M+ technology budget and vendor relationships'
      ],
      impact: {
        revenue: '$125M streaming revenue increase',
        efficiency: '70% content delivery optimization',
        innovation: 'Industry-first AI-powered content recommendation'
      },
      technologies: ['React', 'Node.js', 'Kubernetes', 'GCP', 'TensorFlow', 'CDN'],
      recognition: ['Engineering Excellence Award', 'Digital Innovation Leader'],
      isHighlight: true
    },
    {
      id: 'warner-2018',
      year: 2018,
      title: 'Enterprise Solutions Architect',
      company: 'Warner Bros Entertainment',
      industry: 'Entertainment',
      achievements: [
        'Designed global content management system for 150+ countries',
        'Led Emmy Award-winning technical team for streaming innovation',
        'Established enterprise architecture standards adopted company-wide'
      ],
      impact: {
        revenue: '$200M global expansion revenue',
        efficiency: '80% content localization acceleration',
        innovation: 'Emmy Award-winning streaming technology'
      },
      technologies: ['TypeScript', 'GraphQL', 'Microservices', 'Azure', 'Machine Learning'],
      recognition: ['Emmy Award Winner', 'Technology Leadership Excellence'],
      isHighlight: true
    },
    {
      id: 'consultant-2021',
      year: 2021,
      title: 'Independent Enterprise Consultant',
      company: 'Tyler Gohr Solutions',
      industry: 'Multi-Industry',
      achievements: [
        'Delivered enterprise solutions for Fortune 500 clients',
        'Achieved 97%+ client satisfaction across 50+ projects',
        'Generated $47M+ measurable business value for clients'
      ],
      impact: {
        revenue: '$47M+ client business value',
        efficiency: '95% average project efficiency',
        innovation: 'Cutting-edge web technologies integration'
      },
      technologies: ['Next.js', 'React Three Fiber', 'WebGL', 'AI/ML', 'Cloud Architecture'],
      recognition: ['Multiple Client Excellence Awards', 'Industry Innovation Recognition'],
      isHighlight: true
    }
  ], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % careerMilestones.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [careerMilestones.length]);

  const totalYears = useMemo(() => 
    new Date().getFullYear() - 2008,
    []
  );

  const totalImpact = useMemo(() => ({
    revenue: '$47M+',
    projects: '127+',
    clients: '50+',
    satisfaction: '97%+'
  }), []);

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

  const timelineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.5,
        ease: cubicBezier(0, 0, 0.2, 1)
      }
    }
  };

  return (
    <motion.section
      className={`${styles.timeline} ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className={styles.header} variants={itemVariants}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>
            Business Impact Timeline
          </h2>
          <p className={styles.subtitle}>
            {totalYears}+ years of enterprise solutions architecture excellence • Emmy Award Winner
          </p>
        </div>
        <div className={styles.impactSummary}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryValue}>{totalImpact.revenue}</span>
            <span className={styles.summaryLabel}>Business Value</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryValue}>{totalImpact.projects}</span>
            <span className={styles.summaryLabel}>Projects</span>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryValue}>{totalImpact.satisfaction}</span>
            <span className={styles.summaryLabel}>Satisfaction</span>
          </div>
        </div>
      </motion.header>

      <div className={styles.viewControls}>
        {[
          { key: 'timeline', label: 'Career Timeline', icon: '📅' },
          { key: 'impact', label: 'Impact Analysis', icon: '📊' },
          { key: 'progression', label: 'Role Progression', icon: '🚀' }
        ].map((mode) => (
          <button
            key={mode.key}
            className={`${styles.viewButton} ${viewMode === mode.key ? styles.active : ''}`}
            onClick={() => setViewMode(mode.key as any)}
          >
            <span className={styles.viewIcon}>{mode.icon}</span>
            <span className={styles.viewLabel}>{mode.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          className={styles.content}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'timeline' && (
            <div className={styles.timelineView}>
              <motion.div 
                className={styles.timelineLine}
                variants={timelineVariants}
              />
              <div className={styles.milestonesContainer}>
                {careerMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    className={`${styles.milestone} ${milestone.isHighlight ? styles.highlight : ''} ${selectedMilestone === milestone.id ? styles.selected : ''}`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => interactive && setSelectedMilestone(
                      selectedMilestone === milestone.id ? null : milestone.id
                    )}
                    style={{ 
                      '--delay': `${index * 0.2}s`,
                      '--progress': `${((milestone.year - 2008) / (new Date().getFullYear() - 2008)) * 100}%`
                    } as React.CSSProperties}
                  >
                    <div className={styles.milestoneYear}>
                      <span className={styles.yearText}>{milestone.year}</span>
                      {milestone.isHighlight && (
                        <motion.div 
                          className={styles.highlightRing}
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 0.4, 0.8]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </div>
                    <div className={styles.milestoneContent}>
                      <h3 className={styles.milestoneTitle}>{milestone.title}</h3>
                      <p className={styles.milestoneCompany}>
                        {milestone.company} • {milestone.industry}
                      </p>
                      <div className={styles.milestoneImpact}>
                        <div className={styles.impactItem}>
                          <span className={styles.impactLabel}>Revenue Impact:</span>
                          <span className={styles.impactValue}>{milestone.impact.revenue}</span>
                        </div>
                        <div className={styles.impactItem}>
                          <span className={styles.impactLabel}>Efficiency Gain:</span>
                          <span className={styles.impactValue}>{milestone.impact.efficiency}</span>
                        </div>
                      </div>
                      {milestone.recognition.length > 0 && (
                        <div className={styles.recognition}>
                          {milestone.recognition.map((award, idx) => (
                            <span key={idx} className={styles.award}>
                              🏆 {award}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {viewMode === 'impact' && (
            <div className={styles.impactView}>
              <div className={styles.impactMetrics}>
                <h3 className={styles.impactTitle}>Cumulative Business Impact</h3>
                <div className={styles.impactGrid}>
                  {careerMilestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      className={styles.impactCard}
                      variants={itemVariants}
                      style={{ '--company-color': milestone.isHighlight ? 'var(--results-bg)' : 'var(--case-studies-bg)' } as React.CSSProperties}
                    >
                      <div className={styles.impactCardHeader}>
                        <h4>{milestone.company}</h4>
                        <span className={styles.impactYear}>{milestone.year}</span>
                      </div>
                      <div className={styles.impactStats}>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{milestone.impact.revenue}</span>
                          <span className={styles.statLabel}>Revenue Impact</span>
                        </div>
                        <div className={styles.stat}>
                          <span className={styles.statValue}>{milestone.impact.efficiency}</span>
                          <span className={styles.statLabel}>Efficiency</span>
                        </div>
                      </div>
                      <div className={styles.innovations}>
                        <p className={styles.innovationText}>{milestone.impact.innovation}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'progression' && (
            <div className={styles.progressionView}>
              <h3 className={styles.progressionTitle}>Role & Responsibility Progression</h3>
              <div className={styles.progressionChart}>
                {careerMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.id}
                    className={styles.progressionLevel}
                    variants={itemVariants}
                    style={{ '--level': index + 1 } as React.CSSProperties}
                  >
                    <div className={styles.levelIndicator}>
                      <span className={styles.levelNumber}>{index + 1}</span>
                    </div>
                    <div className={styles.levelContent}>
                      <h4 className={styles.levelTitle}>{milestone.title}</h4>
                      <p className={styles.levelDescription}>
                        Leading {milestone.industry} transformation at {milestone.company}
                      </p>
                      <div className={styles.levelAchievements}>
                        {milestone.achievements.slice(0, 2).map((achievement, idx) => (
                          <div key={idx} className={styles.achievement}>
                            <span className={styles.achievementBullet}>▶</span>
                            <span className={styles.achievementText}>{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {selectedMilestone && interactive && (
          <motion.div
            className={styles.detailModal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.target === e.currentTarget && setSelectedMilestone(null)}
          >
            <motion.div className={styles.detailContent}>
              {(() => {
                const milestone = careerMilestones.find(m => m.id === selectedMilestone);
                if (!milestone) return null;

                return (
                  <>
                    <header className={styles.detailHeader}>
                      <div>
                        <h3>{milestone.title}</h3>
                        <p>{milestone.company} • {milestone.year}</p>
                      </div>
                      <button 
                        className={styles.closeButton}
                        onClick={() => setSelectedMilestone(null)}
                        aria-label="Close details"
                      >
                        ✕
                      </button>
                    </header>
                    <div className={styles.detailBody}>
                      <div className={styles.achievementsList}>
                        <h4>Key Achievements</h4>
                        <ul>
                          {milestone.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.technologiesList}>
                        <h4>Technologies & Skills</h4>
                        <div className={styles.techTags}>
                          {milestone.technologies.map((tech, idx) => (
                            <span key={idx} className={styles.techTag}>{tech}</span>
                          ))}
                        </div>
                      </div>
                      {milestone.recognition.length > 0 && (
                        <div className={styles.recognitionList}>
                          <h4>Recognition & Awards</h4>
                          <ul>
                            {milestone.recognition.map((award, idx) => (
                              <li key={idx}>🏆 {award}</li>
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
        <div className={styles.credentialsBar}>
          <span className={styles.credential}>Emmy Award Winner</span>
          <span className={styles.separator}>•</span>
          <span className={styles.credential}>Fox Corporation & Warner Bros</span>
          <span className={styles.separator}>•</span>
          <span className={styles.credential}>{totalYears}+ Years Enterprise Excellence</span>
          <span className={styles.separator}>•</span>
          <span className={styles.credential}>$47M+ Business Value Delivered</span>
        </div>
      </motion.footer>
    </motion.section>
  );
}
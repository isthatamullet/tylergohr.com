"use client"

import React from 'react'
import { ResultsSection } from '../Section/Section'
import { MetricCard } from './MetricCard'
import styles from './Results.module.css'

export interface Metric {
  id: string
  number: string
  label: string
  description: string
  icon: string
  category: 'achievement' | 'financial' | 'performance' | 'leadership' | 'scale' | 'innovation' | 'experience' | 'platform'
}

const metrics: Metric[] = [
  {
    id: 'emmy-award',
    number: '1',
    label: 'Emmy Award Winner',
    description: '2018 FIFA World Cup Streaming Technology, The National Academy of Television Arts & Sciences',
    icon: '🏆',
    category: 'achievement'
  },
  {
    id: 'cost-savings',
    number: '$2M+',
    label: 'Cost Savings Achieved',
    description: 'Fox Corporation content strategy optimization, streamlined workflows and enhanced efficiency',
    icon: '💰',
    category: 'financial'
  },
  {
    id: 'success-rate',
    number: '96%',
    label: 'Success Rate Achievement',
    description: 'Warner Bros delivery improvement (from 32%), achieved in first 3 months through strategic redesign',
    icon: '📈',
    category: 'performance'
  },
  {
    id: 'team-leadership',
    number: '10+',
    label: 'Team Members Led',
    description: 'Across global organizations (Fox Corporation, Warner Bros, SDI Media)',
    icon: '👥',
    category: 'leadership'
  },
  {
    id: 'content-scale',
    number: '17,000+',
    label: 'Titles Managed',
    description: 'Plus 30,000+ digital assets, enterprise-scale content distribution platforms',
    icon: '📚',
    category: 'scale'
  },
  {
    id: 'efficiency-gains',
    number: '50%',
    label: 'Efficiency Gains',
    description: 'AI-powered automation implementation, reduced manual review time and error rates',
    icon: '🤖',
    category: 'innovation'
  },
  {
    id: 'experience',
    number: '16+',
    label: 'Years Experience',
    description: 'Enterprise technical leadership, Fortune 500 companies and global platforms',
    icon: '🌍',
    category: 'experience'
  },
  {
    id: 'platform-contributions',
    number: '3',
    label: 'Major Platform Contributions',
    description: 'Fox Nation, Fox Weather, FIFA World Cup - successful launches with millions of users',
    icon: '🚀',
    category: 'platform'
  }
]

export interface ResultsProps {
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Custom section title
   */
  title?: string
  
  /**
   * Whether to enable scroll-triggered animations
   */
  animate?: boolean
}

/**
 * Results & Impact section showcasing measurable outcomes and achievements
 * Displays 8 key metrics in a responsive grid with counter animations
 */
export const Results: React.FC<ResultsProps> = ({
  className = '',
  title = 'Delivering measurable impact through strategic technical leadership',
  animate = true
}) => {
  return (
    <ResultsSection 
      id="results" 
      className={`${styles.resultsSection} ${className}`}
      aria-labelledby="results-title"
    >
      <div className={styles.resultsContainer}>
        <header className={styles.resultsHeader}>
          <h2 id="results-title" className={styles.resultsTitle}>
            {title}
          </h2>
        </header>
        
        <div className={styles.metricsGrid}>
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              animationDelay={index * 100}
              animate={animate}
            />
          ))}
        </div>
      </div>
    </ResultsSection>
  )
}

export default Results
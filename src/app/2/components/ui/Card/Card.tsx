"use client"

import React from 'react'
import { ClientMotionDiv } from '@/app/2/lib/framer-motion-client'
import styles from './Card.module.css'

export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant type
   */
  variant: 'results' | 'case-study' | 'technical' | 'process'
  
  /**
   * Card size
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  
  /**
   * Card content
   */
  children: React.ReactNode
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Whether the card is clickable/interactive
   */
  interactive?: boolean
  
  /**
   * Whether to apply glassmorphism effect
   */
  glassmorphism?: boolean
  
  /**
   * Whether to show loading state
   */
  loading?: boolean
  
  /**
   * Click handler for interactive cards
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
}

/**
 * Results & Impact card for metrics display
 */
export interface ResultsCardProps extends Omit<BaseCardProps, 'variant' | 'children'> {
  /**
   * Primary metric value
   */
  value: string | number
  
  /**
   * Metric label/description
   */
  label: string
  
  /**
   * Optional subtitle or context
   */
  subtitle?: string
  
  /**
   * Icon or symbol to display
   */
  icon?: React.ReactNode
  
  /**
   * Trend indicator (up, down, neutral)
   */
  trend?: 'up' | 'down' | 'neutral'
  
  /**
   * Percentage change (for trend)
   */
  change?: string
}

/**
 * Case Study card for project showcases
 */
export interface CaseStudyCardProps extends Omit<BaseCardProps, 'variant' | 'children'> {
  /**
   * Project title
   */
  title: string
  
  /**
   * Brief project description
   */
  description: string
  
  /**
   * Achievement badge/metric
   */
  badge?: {
    label: string
    value: string
    type: 'emmy' | 'savings' | 'success' | 'innovation'
  }
  
  /**
   * Tech stack/tools used
   */
  technologies?: string[]
  
  /**
   * Call-to-action text
   */
  ctaText?: string
  
  /**
   * Image or visual element
   */
  image?: React.ReactNode
}

/**
 * Technical Expertise card for skill categories
 */
export interface TechnicalCardProps extends Omit<BaseCardProps, 'variant' | 'children'> {
  /**
   * Skill category title
   */
  category: string
  
  /**
   * List of skills or technologies
   */
  skills: string[]
  
  /**
   * Proficiency level or years of experience
   */
  experience?: string
  
  /**
   * Current project example
   */
  currentExample?: string
  
  /**
   * Icon representing the category
   */
  icon?: React.ReactNode
  
  /**
   * Whether the card is expanded (for mobile collapse)
   */
  expanded?: boolean
  
  /**
   * Toggle handler for mobile expand/collapse
   */
  onToggle?: () => void
}

/**
 * Process/How I Work card for methodology steps
 */
export interface ProcessCardProps extends Omit<BaseCardProps, 'variant' | 'children'> {
  /**
   * Step number
   */
  step: number
  
  /**
   * Process step title
   */
  title: string
  
  /**
   * Step description
   */
  description: string
  
  /**
   * Tools or methods used in this step
   */
  tools?: string[]
  
  /**
   * Duration or timeframe
   */
  duration?: string
  
  /**
   * Visual element or icon
   */
  visual?: React.ReactNode
}

/**
 * Base Card component with variant system and Framer Motion animations
 */
export const Card: React.FC<BaseCardProps> = ({
  variant,
  size = 'md',
  children,
  className = '',
  interactive = false,
  glassmorphism = false,
  loading = false,
  onClick,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    styles[`card--${size}`],
    interactive && styles['card--interactive'],
    glassmorphism && styles['card--glassmorphism'],
    loading && styles['card--loading'],
    className
  ].filter(Boolean).join(' ')

  // Separate motion-specific props from HTML props
  const { id, style, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby } = props
  const htmlProps = { id, style, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedby }

  if (interactive) {
    return (
      <ClientMotionDiv
        className={cardClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        whileHover={{ 
          scale: 1.02,
          y: -4
        }}
        whileTap={{ 
          scale: 0.98 
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25
        }}
        {...htmlProps}
      >
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner} />
          </div>
        )}
        {children}
      </ClientMotionDiv>
    )
  }

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * Results & Impact Card
 */
export const ResultsCard: React.FC<ResultsCardProps> = ({
  value,
  label,
  subtitle,
  icon,
  trend,
  change,
  ...props
}) => {
  return (
    <Card variant="results" {...props}>
      <div className={styles.resultsCardContent}>
        {icon && (
          <div className={styles.resultsCardIcon}>
            {icon}
          </div>
        )}
        
        <div className={styles.resultsCardValue}>
          {value}
        </div>
        
        <div className={styles.resultsCardLabel}>
          {label}
        </div>
        
        {subtitle && (
          <div className={styles.resultsCardSubtitle}>
            {subtitle}
          </div>
        )}
        
        {trend && change && (
          <div className={`${styles.resultsCardTrend} ${styles[`trend--${trend}`]}`}>
            {trend === 'up' && '↗'} 
            {trend === 'down' && '↘'} 
            {trend === 'neutral' && '→'} 
            {change}
          </div>
        )}
      </div>
    </Card>
  )
}

/**
 * Case Study Card
 */
export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  title,
  description,
  badge,
  technologies,
  ctaText = "Learn More",
  image,
  ...props
}) => {
  return (
    <Card variant="case-study" interactive {...props}>
      <div className={styles.caseStudyCardContent}>
        {image && (
          <div className={styles.caseStudyCardImage}>
            {image}
          </div>
        )}
        
        {badge && (
          <div className={`${styles.caseStudyCardBadge} ${styles[`badge--${badge.type}`]}`}>
            <span className={styles.badgeLabel}>{badge.label}</span>
            <span className={styles.badgeValue}>{badge.value}</span>
          </div>
        )}
        
        <div className={styles.caseStudyCardTitle}>
          {title}
        </div>
        
        <div className={styles.caseStudyCardDescription}>
          {description}
        </div>
        
        {technologies && technologies.length > 0 && (
          <div className={styles.caseStudyCardTech}>
            {technologies.map((tech, index) => (
              <span key={index} className={styles.techTag}>
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <div className={styles.caseStudyCardCta}>
          {ctaText} →
        </div>
      </div>
    </Card>
  )
}

/**
 * Technical Expertise Card
 */
export const TechnicalCard: React.FC<TechnicalCardProps> = ({
  category,
  skills,
  experience,
  currentExample,
  icon,
  expanded = false,
  onToggle,
  glassmorphism = true,
  ...props
}) => {
  return (
    <Card variant="technical" glassmorphism={glassmorphism} interactive={!!onToggle} onClick={onToggle} {...props}>
      <div className={styles.technicalCardContent}>
        <div className={styles.technicalCardHeader}>
          {icon && (
            <div className={styles.technicalCardIcon}>
              {icon}
            </div>
          )}
          
          <div className={styles.technicalCardCategory}>
            {category}
          </div>
          
          {onToggle && (
            <div className={`${styles.technicalCardToggle} ${expanded ? styles['toggle--expanded'] : ''}`}>
              ↓
            </div>
          )}
        </div>
        
        {experience && (
          <div className={styles.technicalCardExperience}>
            {experience}
          </div>
        )}
        
        <div className={`${styles.technicalCardSkills} ${expanded ? styles['skills--expanded'] : ''}`}>
          {skills.map((skill, index) => (
            <span key={index} className={styles.skillTag}>
              {skill}
            </span>
          ))}
        </div>
        
        {currentExample && (expanded || !onToggle) && (
          <div className={styles.technicalCardExample}>
            <strong>Current:</strong> {currentExample}
          </div>
        )}
      </div>
    </Card>
  )
}

/**
 * Process/How I Work Card
 */
export const ProcessCard: React.FC<ProcessCardProps> = ({
  step,
  title,
  description,
  tools,
  duration,
  visual,
  ...props
}) => {
  return (
    <Card variant="process" {...props}>
      <div className={styles.processCardContent}>
        <div className={styles.processCardStep}>
          {step}
        </div>
        
        {visual && (
          <div className={styles.processCardVisual}>
            {visual}
          </div>
        )}
        
        <div className={styles.processCardTitle}>
          {title}
        </div>
        
        <div className={styles.processCardDescription}>
          {description}
        </div>
        
        {duration && (
          <div className={styles.processCardDuration}>
            ⏱ {duration}
          </div>
        )}
        
        {tools && tools.length > 0 && (
          <div className={styles.processCardTools}>
            {tools.map((tool, index) => (
              <span key={index} className={styles.toolTag}>
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

export default Card
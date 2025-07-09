"use client"

import React, { useEffect, useRef, useState } from 'react'
import type { CaseStudy } from './CaseStudiesPreview'
import styles from './CaseStudyCard.module.css'

export interface CaseStudyCardProps {
  /**
   * Case study data to display
   */
  caseStudy: CaseStudy
  
  /**
   * Animation delay in milliseconds for staggered reveals
   */
  animationDelay?: number
  
  /**
   * Whether parent section is visible for triggering animations
   */
  isVisible?: boolean
  
  /**
   * Card index for CSS custom property stagger timing
   */
  cardIndex: number
  
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * Individual case study card with metric badge and scroll-triggered animations
 * Features hover effects, staggered reveals, and gradient metric badges
 */
export const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  animationDelay = 0,
  isVisible = false,
  cardIndex,
  className = ''
}) => {
  const [cardRevealed, setCardRevealed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Individual card intersection observer for precise animation control
  useEffect(() => {
    if (!isVisible) return

    const timer = setTimeout(() => {
      setCardRevealed(true)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [isVisible, animationDelay])

  // Set CSS custom property for stagger timing
  const cardStyle = {
    '--card-index': cardIndex
  } as React.CSSProperties

  return (
    <article
      ref={cardRef}
      className={`
        ${styles.caseStudyCard} 
        ${cardRevealed ? styles.revealed : ''}
        ${className}
      `}
      style={cardStyle}
      aria-labelledby={`case-study-title-${caseStudy.id}`}
    >
      {/* Metric Badge - Separate animation layer */}
      <div 
        className={`
          ${styles.metricBadge} 
          ${styles[`metricBadge--${caseStudy.metricCategory}`]}
          ${cardRevealed ? styles.badgeRevealed : ''}
        `}
        aria-label={`Achievement: ${caseStudy.metricBadge}`}
      >
        {caseStudy.metricBadge}
      </div>

      <div className={styles.caseStudyContent}>
        <h3 
          id={`case-study-title-${caseStudy.id}`}
          className={styles.caseStudyTitle}
        >
          {caseStudy.title}
        </h3>

        <p className={styles.caseStudyChallenge}>
          {caseStudy.challengeTeaser}
        </p>

        <p className={styles.caseStudyImpact}>
          <strong>{caseStudy.keyImpact}</strong>
        </p>

        <a 
          href={caseStudy.link}
          className={styles.caseStudyCTA}
          aria-label={`${caseStudy.ctaText} - ${caseStudy.title}`}
        >
          {caseStudy.ctaText}
        </a>
      </div>
    </article>
  )
}

export default CaseStudyCard
"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ProcessCard } from '../ui/Card/Card'
import styles from './HowIWorkPreview.module.css'

export interface HowIWorkProcess {
  id: string
  step: number
  title: string
  description: string
  tools: string[]
  icon: string
  duration?: string
}

/**
 * How I Work Preview Section
 * Displays 4 process highlight cards showcasing enterprise methodology
 * Uses existing ProcessCard components with scroll-triggered animations
 */
export const HowIWorkPreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // How I Work process data from PORTFOLIO-REDESIGN-CONTENT-CONDENSED.md
  const processSteps: HowIWorkProcess[] = [
    {
      id: 'github-planning',
      step: 1,
      title: 'Issue-Based Development',
      description: 'Every feature tracked through GitHub issues with milestone progress and transparent workflow',
      tools: ['GitHub Issues', 'Project Boards', 'Milestone Tracking'],
      icon: '📋',
      duration: 'Ongoing'
    },
    {
      id: 'modern-stack',
      step: 2,
      title: 'Next.js 14 + TypeScript',
      description: 'Enterprise-grade architecture with cutting-edge CSS features and 90+ Lighthouse scores',
      tools: ['Next.js 14', 'TypeScript', 'CSS Modules', 'App Router'],
      icon: '⚛️',
      duration: 'Foundation'
    },
    {
      id: 'cloud-infrastructure',
      step: 3,
      title: 'Cloud-Native Deployment',
      description: 'Production-ready with automatic scaling, preview deployments, and enterprise monitoring',
      tools: ['Google Cloud Run', 'Docker', 'GitHub Actions', 'Preview URLs'],
      icon: '☁️',
      duration: 'Automated'
    },
    {
      id: 'quality-gates',
      step: 4,
      title: 'Automated Quality Gates',
      description: 'TypeScript validation, ESLint standards, Jest testing, and production build verification',
      tools: ['TypeScript', 'ESLint', 'Jest', 'Lighthouse'],
      icon: '✅',
      duration: 'Pre-commit'
    }
  ]

  // Intersection Observer for scroll-triggered section animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="process"
      className={styles.howIWorkSection}
      aria-labelledby="how-i-work-title"
      role="region"
    >
      <div className={styles.container}>
        <header 
          className={`${styles.howIWorkHeader} ${isVisible ? styles.revealed : ''}`}
        >
          <h2 id="how-i-work-title" className={styles.sectionTitle}>
            How I Work
          </h2>
          <p className={styles.sectionDescription}>
            Enterprise methodology from discovery to optimization, ensuring scalable solutions and measurable outcomes.
          </p>
        </header>

        <div className={styles.processGrid}>
          {processSteps.map((process, index) => (
            <div
              key={process.id}
              className={`${styles.processCardWrapper} ${isVisible ? styles.cardRevealed : ''}`}
              style={{ 
                '--card-index': index,
                animationDelay: `${index * 150}ms`
              } as React.CSSProperties}
            >
              <ProcessCard
                step={process.step}
                title={process.title}
                description={process.description}
                tools={process.tools}
                duration={process.duration}
                visual={process.icon}
                size="md"
                className={styles.processCard}
              />
            </div>
          ))}
        </div>

        <div className={`${styles.sectionCTA} ${isVisible ? styles.revealed : ''}`}>
          <a 
            href="/2/process" 
            className={styles.ctaButton}
            aria-label="View complete development process methodology"
          >
            View Full Process →
          </a>
          <p className={styles.ctaSupporting}>
            Explore detailed methodology with technical implementation insights and project examples
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowIWorkPreview
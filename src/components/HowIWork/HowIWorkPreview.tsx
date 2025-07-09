"use client"

import React, { useEffect, useRef, useState } from 'react'
import styles from './HowIWorkPreview.module.css'

export interface ProcessStep {
  id: string
  step: number
  title: string
  description: string
  icon: string
  side: 'left' | 'right' | 'center'
  x: number
  y: number
}

/**
 * How I Work Preview Section
 * Displays 7-step descending staircase layout showcasing enterprise methodology
 * Uses clean diagonal positioning with scroll-triggered animations
 */
export const HowIWorkPreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // 7 Process Steps positioned in descending staircase layout
  // Following diagonal flow: upper left → lower right
  const processSteps: ProcessStep[] = [
    {
      id: 'discovery',
      step: 1,
      title: 'Discovery',
      description: 'Stakeholder interviews, problem definition, scope clarification',
      icon: '🔍',
      side: 'right',
      x: 0, // Top left start
      y: 0
    },
    {
      id: 'research',
      step: 2,
      title: 'Research',
      description: 'Technical research, architecture planning, GitHub issue roadmap',
      icon: '📊',
      side: 'right',
      x: 12, // Down and right 12%
      y: 12
    },
    {
      id: 'design',
      step: 3,
      title: 'Design',
      description: 'UI/UX design, technical prototypes, validation cycles',
      icon: '🎨',
      side: 'right',
      x: 24, // Down and right 24%
      y: 24
    },
    {
      id: 'implementation',
      step: 4,
      title: 'Implementation',
      description: 'Next.js development, iterative building, code reviews',
      icon: '⚡️',
      side: 'right',
      x: 36, // Down and right 36%
      y: 36
    },
    {
      id: 'testing',
      step: 5,
      title: 'Testing',
      description: 'Jest testing, TypeScript validation, performance optimization',
      icon: '🧪',
      side: 'right',
      x: 48, // Down and right 48%
      y: 48
    },
    {
      id: 'deployment',
      step: 6,
      title: 'Deployment',
      description: 'Google Cloud deployment, CI/CD pipeline, monitoring setup',
      icon: '🚀',
      side: 'right',
      x: 60, // Down and right 60%
      y: 60
    },
    {
      id: 'optimization',
      step: 7,
      title: 'Optimization',
      description: 'Performance monitoring, continuous improvement, maintenance',
      icon: '📈',
      side: 'right',
      x: 72, // Bottom right end
      y: 72
    }
  ]

  // No complex SVG path needed for simple staircase layout

  // Simple staircase layout doesn't need path length calculation

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
      <div className={styles.backgroundOverlay} />
      
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

        {/* Desktop Staircase Layout */}
        <div className={`${styles.staircaseContainer} ${isVisible ? styles.revealed : ''}`}>
          {/* Process Steps */}
          {processSteps.map((step, index) => (
            <div
              key={step.id}
              className={`${styles.processStep} ${styles[step.side]} ${isVisible ? styles.stepRevealed : ''}`}
              style={{
                '--step-x': `${step.x}%`,
                '--step-y': `${step.y}%`,
                '--step-index': index,
                animationDelay: `${index * 150}ms` // Staggered reveal timing
              } as React.CSSProperties}
            >
              <div className={styles.stepIcon}>
                <span className={styles.iconEmoji} role="img" aria-hidden="true">
                  {step.icon}
                </span>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Layout */}
        <div className={styles.mobileProcessList}>
          {processSteps.map((step, index) => (
            <div
              key={`mobile-${step.id}`}
              className={`${styles.mobileProcessStep} ${isVisible ? styles.mobileStepRevealed : ''}`}
              style={{
                '--step-index': index,
                animationDelay: `${index * 100}ms`
              } as React.CSSProperties}
            >
              <div className={styles.mobileStepIcon}>
                <span className={styles.iconEmoji} role="img" aria-hidden="true">
                  {step.icon}
                </span>
              </div>
              <div className={styles.mobileStepContent}>
                <h3 className={styles.mobileStepTitle}>
                  {step.title}
                </h3>
                <p className={styles.mobileStepDescription}>
                  {step.description}
                </p>
              </div>
              {index < processSteps.length - 1 && (
                <div className={styles.mobileConnector} aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        <div className={`${styles.sectionCTA} ${isVisible ? styles.revealed : ''}`}>
          <a 
            href="/how-i-work" 
            className={styles.ctaButton}
            aria-label="View complete development process methodology"
          >
            View Full Process →
          </a>
          <p className={styles.ctaSupporting}>
            Discover the complete methodology behind enterprise-quality development
          </p>
        </div>
      </div>
    </section>
  )
}

export default HowIWorkPreview
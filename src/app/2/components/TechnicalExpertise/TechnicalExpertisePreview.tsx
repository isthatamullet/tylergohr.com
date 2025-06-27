"use client"

import React, { useEffect, useRef, useState } from 'react'
import { TechnicalCard } from '../ui/Card/Card'
import styles from './TechnicalExpertisePreview.module.css'

export interface TechnicalExpertiseCategory {
  id: string
  category: string
  skills: string[]
  experience: string
  currentExample: string
  icon: string
}

/**
 * Technical Expertise Preview Section
 * Displays 4 glassmorphism cards showcasing technical skills and experience
 * Features mobile expand/collapse functionality and background image overlay
 */
export const TechnicalExpertisePreview: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)

  // Technical expertise data from PORTFOLIO-REDESIGN-CONTENT-CONDENSED.md
  const expertiseCategories: TechnicalExpertiseCategory[] = [
    {
      id: 'modern-frontend',
      category: 'Modern Frontend',
      skills: ['React 19', 'Next.js 14', 'TypeScript', 'Advanced CSS', 'Framer Motion', 'CSS Grid Subgrid'],
      experience: '8+ years',
      currentExample: 'This portfolio built with Next.js 14 + TypeScript',
      icon: '⚛️'
    },
    {
      id: 'backend-cloud',
      category: 'Backend & Cloud',
      skills: ['Node.js', 'Express APIs', 'Google Cloud Platform', 'PostgreSQL', 'Prisma ORM', 'Docker'],
      experience: '10+ years',
      currentExample: 'Google Cloud Run deployment with CI/CD automation',
      icon: '☁️'
    },
    {
      id: 'enterprise-leadership',
      category: 'Enterprise Leadership',
      skills: ['Team Leadership (10+ people)', 'AI Implementation Pioneer', 'Product Management', 'Strategic Planning'],
      experience: '16+ years',
      currentExample: 'Leading Warner Bros & Fox Corporation technical initiatives',
      icon: '👥'
    },
    {
      id: 'integration-automation',
      category: 'Integration & Automation',
      skills: ['Stripe Payment Processing', 'Real-time Socket.IO', 'AI-Powered Automation', 'API Integration'],
      experience: '12+ years',
      currentExample: 'Invoice Chaser automation reducing payment times 25-40%',
      icon: '🔧'
    }
  ]

  // Toggle card expansion (mobile functionality)
  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev)
      if (newSet.has(cardId)) {
        newSet.delete(cardId)
      } else {
        newSet.add(cardId)
      }
      return newSet
    })
  }

  // Check if we're on mobile (for expand/collapse behavior)
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      id="skills"
      className={styles.technicalSection}
      aria-labelledby="technical-title"
      role="region"
    >
      <div className={styles.backgroundOverlay} />
      
      <div className={styles.container}>
        <header 
          className={`${styles.technicalHeader} ${isVisible ? styles.revealed : ''}`}
        >
          <h2 id="technical-title" className={styles.sectionTitle}>
            Technical Expertise
          </h2>
          <p className={styles.sectionDescription}>
            Cutting-edge technologies and enterprise leadership experience driving innovation across Fortune 500 organizations.
          </p>
        </header>

        <div className={styles.expertiseGrid}>
          {expertiseCategories.map((expertise, index) => (
            <div
              key={expertise.id}
              className={`${styles.expertiseCardWrapper} ${isVisible ? styles.cardRevealed : ''}`}
              style={{ 
                '--card-index': index,
                animationDelay: `${index * 150}ms`
              } as React.CSSProperties}
            >
              <TechnicalCard
                category={expertise.category}
                skills={expertise.skills}
                experience={expertise.experience}
                currentExample={expertise.currentExample}
                icon={expertise.icon}
                expanded={expandedCards.has(expertise.id)}
                onToggle={isMobile ? () => toggleCard(expertise.id) : undefined}
                size="md"
                glassmorphism={true}
                className={styles.technicalCard}
              />
            </div>
          ))}
        </div>

        <div className={`${styles.sectionCTA} ${isVisible ? styles.revealed : ''}`}>
          <a 
            href="/2/skills" 
            className={styles.ctaButton}
            aria-label="View complete technical expertise and project examples"
          >
            View Full Technical Portfolio →
          </a>
          <p className={styles.ctaSupporting}>
            Explore detailed project implementations and technical leadership case studies
          </p>
        </div>
      </div>
    </section>
  )
}

export default TechnicalExpertisePreview
"use client"

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { NetworkAnimation } from './NetworkAnimation'
import { isWebGLReady } from '../../lib/webgl-detection'
import styles from './About.module.css'

// Dynamically import 3D component to prevent SSR issues
const NetworkAnimation3D = dynamic(() => import('./NetworkAnimation3D'), {
  ssr: false,
  loading: () => <NetworkAnimation /> // Use 2D version as loading fallback
})

/**
 * About Section Component - Enterprise Solutions Architect positioning
 * 
 * Features:
 * - 60/40 grid layout (text/animation) on desktop
 * - Emmy Award emphasis with gold highlighting
 * - Network animation demonstrating technical expertise
 * - Mobile responsive stacking layout
 * - Scroll-triggered staggered animations for content reveals
 */
export const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [webglReady, setWebglReady] = useState<boolean | null>(null) // null = checking, boolean = determined
  const sectionRef = useRef<HTMLElement>(null)

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

  // Client-only WebGL detection for progressive enhancement
  useEffect(() => {
    // Small delay to ensure client-side hydration is complete
    const timer = setTimeout(() => {
      try {
        const isReady = isWebGLReady()
        setWebglReady(isReady)
      } catch (error) {
        console.warn('WebGL detection failed, using 2D fallback:', error)
        setWebglReady(false)
      }
    }, 150) // Slightly longer delay for stability

    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className={styles.aboutSection} 
      id="about" 
      aria-labelledby="about-title"
    >
      <div className={styles.aboutContainer}>
        
        {/* Content Side - 60% */}
        <div className={styles.aboutContent}>
          <h2 
            id="about-title" 
            className={`${styles.aboutTitle} ${isVisible ? styles.titleRevealed : ''}`}
          >
            About Tyler Gohr
          </h2>
          
          <p className={`${styles.aboutParagraph} ${styles.paragraph1} ${isVisible ? styles.paragraphRevealed : ''}`}>
            I{"'"}m Tyler Gohr, an <span className={styles.emmyHighlight}>Emmy Award-winning</span> Enterprise Solutions Architect who transforms complex technical challenges into competitive business advantages. Over 16+ years leading technical teams at <span className={styles.enterpriseHighlight}>Fox Corporation and Warner Bros Entertainment</span>, I{"'"}ve architected platforms serving millions of users while managing systems with 50,000+ digital assets.
          </p>
          
          <p className={`${styles.aboutParagraph} ${styles.paragraph2} ${isVisible ? styles.paragraphRevealed : ''}`}>
            My approach combines Fortune 500-level expertise with a passion for solving real business problems. Whether you{"'"}re a growing company needing a custom web application or an enterprise requiring complex digital infrastructure, I bring the same strategic thinking and technical precision to every project — from initial concept through deployment and optimization.
          </p>
          
          <p className={`${styles.aboutParagraph} ${styles.paragraph3} ${isVisible ? styles.paragraphRevealed : ''}`}>
            I specialize in AI-powered automation, content distribution systems, and full-stack development, always focusing on solutions that deliver measurable impact while scaling with your business goals.
          </p>
        </div>

        {/* Animation Side - 40% - Progressive Enhancement: 3D or 2D */}
        <div className={`${styles.aboutAnimation} ${isVisible ? styles.animationRevealed : ''}`}>
          {webglReady === true ? (
            <NetworkAnimation3D />
          ) : (
            <NetworkAnimation />
          )}
        </div>
        
      </div>
    </section>
  )
}

export default About
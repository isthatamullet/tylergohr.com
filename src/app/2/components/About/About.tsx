"use client"

import React from 'react'
import { NetworkAnimation } from './NetworkAnimation'
import styles from './About.module.css'

/**
 * About Section Component - Enterprise Solutions Architect positioning
 * 
 * Features:
 * - 60/40 grid layout (text/animation) on desktop
 * - Emmy Award emphasis with gold highlighting
 * - Network animation demonstrating technical expertise
 * - Mobile responsive stacking layout
 */
export const About: React.FC = () => {
  return (
    <section className={styles.aboutSection} id="about" aria-labelledby="about-title">
      <div className={styles.aboutContainer}>
        
        {/* Content Side - 60% */}
        <div className={styles.aboutContent}>
          <h2 id="about-title" className={styles.aboutTitle}>
            About Tyler Gohr
          </h2>
          
          <p className={styles.aboutParagraph}>
            I&apos;m Tyler Gohr, an <span className={styles.emmyHighlight}>Emmy Award-winning</span> Enterprise Solutions Architect who transforms complex technical challenges into competitive business advantages. Over 16+ years leading technical teams at <span className={styles.enterpriseHighlight}>Fox Corporation and Warner Bros Entertainment</span>, I&apos;ve architected platforms serving millions of users while managing systems with 17,000+ digital assets.
          </p>
          
          <p className={styles.aboutParagraph}>
            My approach combines Fortune 500-level expertise with a passion for solving real business problems. Whether you&apos;re a growing company needing a custom web application or an enterprise requiring complex digital infrastructure, I bring the same strategic thinking and technical precision to every project—from initial concept through deployment and optimization.
          </p>
          
          <p className={styles.aboutParagraph}>
            I specialize in AI-powered automation, content distribution systems, and full-stack development, always focusing on solutions that deliver measurable impact while scaling with your business goals.
          </p>
        </div>

        {/* Animation Side - 40% */}
        <div className={styles.aboutAnimation}>
          <NetworkAnimation />
        </div>
        
      </div>
    </section>
  )
}

export default About
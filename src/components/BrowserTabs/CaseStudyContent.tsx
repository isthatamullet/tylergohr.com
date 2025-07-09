import React from 'react'
import styles from './CaseStudyContent.module.css'

// Utility function to decode HTML entities
// Note: &amp; is decoded LAST to prevent double-decoding vulnerabilities
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')  // Must be last to prevent double-decoding
}

interface CaseStudy {
  id: string
  title: string
  company: string
  challenge: string
  solution: string
  implementation: string[]
  results: string[]
  businessValue: string
  badge: {
    label: string
    value: string
    type: 'emmy' | 'savings' | 'success' | 'innovation'
  }
}

interface CaseStudyContentProps {
  study: CaseStudy
}

export default function CaseStudyContent({ study }: CaseStudyContentProps) {
  return (
    <div className={styles.caseStudyContent}>
      {/* Case Study Header */}
      <header className={styles.caseStudyHeader}>
        <div className={`${styles.badge} ${styles[`badge--${study.badge.type}`]} ${styles.badgeLarge}`}>
          <span className={styles.badgeValue}>{study.badge.value}</span>
          <span className={styles.badgeLabel}>{study.badge.label}</span>
        </div>
        <h2 className={styles.caseStudyTitle}>{study.title}</h2>
        <p className={styles.caseStudyCompany}>{study.company}</p>
      </header>

      {/* Case Study Content Grid */}
      <div className={styles.caseStudyGrid}>
        {/* Challenge */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>The Challenge</h3>
          <p className={styles.contentText}>{decodeHtmlEntities(study.challenge)}</p>
        </div>

        {/* Solution */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>My Solution</h3>
          <p className={styles.contentText}>{study.solution}</p>
        </div>

        {/* Technical Implementation */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>Technical Implementation</h3>
          <ul className={styles.contentList}>
            {study.implementation.map((item, i) => (
              <li key={i} className={styles.contentListItem}>
                {decodeHtmlEntities(item)}
              </li>
            ))}
          </ul>
        </div>

        {/* Results */}
        <div className={styles.contentSection}>
          <h3 className={styles.contentTitle}>Measurable Results</h3>
          <ul className={styles.contentList}>
            {study.results.map((result, i) => (
              <li key={i} className={styles.contentListItem}>
                {decodeHtmlEntities(result)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Business Value */}
      <div className={styles.businessValue}>
        <h3 className={styles.businessValueTitle}>What This Means for Your Business</h3>
        <p className={styles.businessValueText}>{decodeHtmlEntities(study.businessValue)}</p>
      </div>
    </div>
  )
}
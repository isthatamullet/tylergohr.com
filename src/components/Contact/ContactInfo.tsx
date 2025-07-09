"use client"

import React from 'react'
import styles from './ContactInfo.module.css'

export interface ContactInfoProps {
  className?: string
}

/**
 * Contact Information Component
 * Dual-audience messaging, professional links, and trust-building elements
 */
export const ContactInfo: React.FC<ContactInfoProps> = ({ className }) => {
  return (
    <div className={`${styles.contactInfo} ${className || ''}`}>
      {/* Response Time Commitment */}
      <div className={styles.responseTime}>
        <div className={styles.responseIcon} aria-hidden="true">⚡</div>
        <div className={styles.responseContent}>
          <h3 className={styles.responseTitle}>Response Time</h3>
          <p className={styles.responseText}>Within 24 hours for all inquiries</p>
        </div>
      </div>

      {/* Dual-Audience Messaging */}
      <div className={styles.audienceSection}>
        {/* For Tech Professionals */}
        <div className={styles.audienceCard}>
          <div className={styles.cardIcon} aria-hidden="true">👨‍💻</div>
          <h4 className={styles.cardTitle}>For Tech Professionals</h4>
          <p className={styles.cardDescription}>
            Looking for a senior technical leader who combines enterprise-scale experience with cutting-edge development practices? Let{"'"}s connect about opportunities where strategic thinking and technical excellence drive innovation.
          </p>
        </div>

        {/* For Small Business */}
        <div className={styles.audienceCard}>
          <div className={styles.cardIcon} aria-hidden="true">🚀</div>
          <h4 className={styles.cardTitle}>For Small Business</h4>
          <p className={styles.cardDescription}>
            Need a custom web application, e-commerce platform, or digital solution that actually grows your business? I bring Fortune 500-level expertise to projects of every size, ensuring your investment delivers measurable results.
          </p>
        </div>
      </div>

      {/* Professional Links */}
      <div className={styles.professionalLinks}>
        <h4 className={styles.linksTitle}>Professional Links</h4>
        <div className={styles.linksList}>
          <a 
            href="https://linkedin.com/in/tyler-gohr" 
            className={styles.linkItem}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect on LinkedIn (opens in new tab)"
          >
            <span className={styles.linkIcon} aria-hidden="true">💼</span>
            <span className={styles.linkText}>LinkedIn Profile</span>
            <span className={styles.linkArrow} aria-hidden="true">↗</span>
          </a>
          
          <a 
            href="https://github.com/isthatamullet" 
            className={styles.linkItem}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View code on GitHub (opens in new tab)"
          >
            <span className={styles.linkIcon} aria-hidden="true">💻</span>
            <span className={styles.linkText}>GitHub Profile</span>
            <span className={styles.linkArrow} aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* Trust Building Elements */}
      <div className={styles.trustElements}>
        <h4 className={styles.trustTitle}>Why Work With Me?</h4>
        <div className={styles.trustList}>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon} aria-hidden="true">🏆</span>
            <span className={styles.trustText}>Emmy Award winner with proven track record</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon} aria-hidden="true">💰</span>
            <span className={styles.trustText}>$2M+ in documented cost savings delivered</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon} aria-hidden="true">📈</span>
            <span className={styles.trustText}>96% project success rate across global teams</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustIcon} aria-hidden="true">⚡</span>
            <span className={styles.trustText}>16+ years of enterprise technical leadership</span>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className={styles.availability}>
        <h4 className={styles.availabilityTitle}>Availability</h4>
        <div className={styles.availabilityContent}>
          <p className={styles.availabilityText}>
            <strong>Monday-Friday:</strong> 9 AM - 6 PM PST
          </p>
          <p className={styles.availabilityText}>
            <strong>Project Consultations:</strong> Available for detailed discussions
          </p>
          <p className={styles.availabilityNote}>
            Currently accepting new projects and leadership opportunities
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
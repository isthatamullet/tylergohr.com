"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ContactForm } from './ContactForm'
import ContactInfo from './ContactInfo'
import styles from './ContactSection.module.css'

export interface ContactSectionProps {
  className?: string
}

/**
 * Contact Section Component
 * Dual-column layout with contact form and professional information
 * Features real-time form validation and dual-audience messaging
 */
export const ContactSection: React.FC<ContactSectionProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false)
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


  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`${styles.contactSection} ${className || ''}`}
      aria-labelledby="contact-title"
      role="region"
    >
      <div className={styles.container}>
        <header 
          className={`${styles.contactHeader} ${isVisible ? styles.revealed : ''}`}
        >
          <h2 id="contact-title" className={styles.sectionTitle}>
            Ready to transform your technical challenges?
          </h2>
          <p className={styles.sectionDescription}>
            Let{"'"}s discuss your project and explore how my Emmy-winning expertise and modern development approach can deliver the results you need.
          </p>
        </header>

        {/* Desktop: Two-column layout | Mobile: Stacked layout */}
        <div className={`${styles.contactContent} ${isVisible ? styles.revealed : ''}`}>
          {/* Contact Form - Left column on desktop */}
          <div className={styles.formContainer}>
            <ContactForm />
          </div>

          {/* Contact Information - Right column on desktop */}
          <div className={styles.infoContainer}>
            <ContactInfo />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
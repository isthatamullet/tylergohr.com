'use client'

import { useEffect, useRef } from 'react'
import styles from './ParallaxSection.module.css'

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
}

export default function ParallaxSection({ 
  children, 
  className = '', 
  speed = 0.5 
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect()
          const scrolled = window.pageYOffset
          const rate = scrolled * -speed
          
          // Only apply parallax when section is in viewport for performance
          if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
            section.style.transform = `translate3d(0, ${rate}px, 0)`
          }
          
          ticking = false
        })
        ticking = true
      }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <section 
      ref={sectionRef}
      className={`${styles.parallaxSection} ${className}`}
    >
      {children}
    </section>
  )
}
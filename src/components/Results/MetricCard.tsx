"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ClientMotionDiv, useMotionValue, animate as animateValue } from '../../lib/framer-motion-client'
import type { Metric } from './Results'
import styles from './MetricCard.module.css'

export interface MetricCardProps {
  /**
   * Metric data to display
   */
  metric: Metric
  
  /**
   * Animation delay in milliseconds for staggered reveals
   */
  animationDelay?: number
  
  /**
   * Whether to enable animations
   */
  animate?: boolean
  
  /**
   * Additional CSS classes
   */
  className?: string
}

// Helper function to format display values based on original metric format
const formatDisplayValue = (currentValue: number, originalFormat: string, isRange: boolean = false, currentValue2?: number): string => {
  const rounded = Math.round(currentValue)
  const rounded2 = currentValue2 ? Math.round(currentValue2) : null
  
  // Handle ranges (like "50-75%")
  if (isRange && rounded2 !== null) {
    if (originalFormat.includes('%')) {
      return `${rounded}-${rounded2}%`
    }
    return `${rounded}-${rounded2}`
  }
  
  if (originalFormat.includes('$') && originalFormat.includes('M')) {
    return `$${rounded}M+`
  }
  if (originalFormat.includes('%')) {
    return `${rounded}%`
  }
  if (originalFormat.includes('+') && originalFormat.includes(',')) {
    return `${rounded.toLocaleString()}+`
  }
  if (originalFormat.includes('+')) {
    return `${rounded}+`
  }
  return rounded.toString()
}

/**
 * Individual metric card with counter animation and gradient styling
 * Displays metric number, label, and description with scroll-triggered animations
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  animationDelay = 0,
  animate = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const countValue = useMotionValue(0)
  const countValue2 = useMotionValue(0)
  const [displayValue, setDisplayValue] = useState(isRange ? '0-0' : '0')

  // Extract numeric value(s) from metric.number for animation
  const getNumericValues = (numberString: string): { value1: number; value2?: number; isRange: boolean } => {
    // Check if it's a range (like "50-75%")
    if (numberString.includes('-')) {
      const parts = numberString.split('-')
      if (parts.length === 2) {
        const value1 = parseFloat(parts[0])
        const value2 = parseFloat(parts[1].replace(/[$,%+M]/g, ''))
        return { value1: isNaN(value1) ? 0 : value1, value2: isNaN(value2) ? 0 : value2, isRange: true }
      }
    }
    
    // Handle single values: "1", "$2M+", "96%", "10+", "50,000+", "16+", "3"
    const cleanedString = numberString.replace(/[$,%+M]/g, '').replace(/,/g, '')
    const numValue = parseFloat(cleanedString)
    return { value1: isNaN(numValue) ? 0 : numValue, isRange: false }
  }

  const { value1: finalValue, value2: finalValue2, isRange } = getNumericValues(metric.number)

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (!animate || hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px'
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [animate, hasAnimated])

  // Counter animation when visible
  useEffect(() => {
    if (!isVisible || hasAnimated || !animate) return

    const timer = setTimeout(() => {
      if (isRange && finalValue2 !== undefined) {
        // Animate both values for ranges
        const controls1 = animateValue(countValue, finalValue, {
          duration: 2,
          ease: "easeOut",
        })
        
        const controls2 = animateValue(countValue2, finalValue2, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (value2: number) => {
            const value1 = countValue.get()
            setDisplayValue(formatDisplayValue(value1, metric.number, true, value2))
          },
          onComplete: () => {
            setDisplayValue(metric.number)
            setHasAnimated(true)
          }
        })

        return () => {
          controls1.stop()
          controls2.stop()
        }
      } else {
        // Single value animation
        const controls = animateValue(countValue, finalValue, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (value: number) => {
            setDisplayValue(formatDisplayValue(value, metric.number))
          },
          onComplete: () => {
            setDisplayValue(metric.number)
            setHasAnimated(true)
          }
        })

        return () => controls.stop()
      }
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [isVisible, finalValue, finalValue2, isRange, animationDelay, animate, hasAnimated, countValue, countValue2, metric.number])

  // Set initial display value
  useEffect(() => {
    if (!animate) {
      setDisplayValue(metric.number)
    } else {
      if (isRange) {
        setDisplayValue(metric.number.includes('%') ? '0-0%' : '0-0')
      } else {
        setDisplayValue('0')
      }
    }
  }, [animate, metric.number, isRange])

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        delay: animationDelay / 1000
      }
    },
    hover: {
      y: -4,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <ClientMotionDiv
      ref={cardRef}
      className={`${styles.metricCard} ${styles[`metricCard--${metric.category}`]} ${className}`}
      variants={cardVariants}
      initial={animate ? 'hidden' : 'visible'}
      animate={isVisible ? 'visible' : 'hidden'}
      whileHover={animate ? 'hover' : undefined}
    >
      <div className={styles.metricIcon} aria-hidden="true">
        {metric.icon}
      </div>
      
      <div className={styles.metricNumber} aria-live="polite">
        {displayValue}
      </div>
      
      <h3 className={styles.metricLabel}>
        {metric.label}
      </h3>
      
      <p className={styles.metricDescription}>
        {metric.description}
      </p>
    </ClientMotionDiv>
  )
}

export default MetricCard
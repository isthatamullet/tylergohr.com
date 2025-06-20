'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ProjectMetric } from '@/lib/types'
import styles from './ProjectMetrics.module.css'

interface ProjectMetricsProps {
  metrics: ProjectMetric[]
  animateOnScroll?: boolean
  duration?: number
}

export default function ProjectMetrics({ 
  metrics, 
  animateOnScroll = true, 
  duration = 2000 
}: ProjectMetricsProps) {
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({})
  const [hasAnimated, setHasAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Animate counter values
  const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = start + (end - start) * easeOut
      
      callback(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }

  // Extract numeric value from metric value
  const getNumericValue = (value: string | number): number => {
    if (typeof value === 'number') return value
    
    // Handle percentage values (e.g., "25-40" -> 32.5)
    if (value.includes('-')) {
      const [min, max] = value.split('-').map(v => parseFloat(v.replace(/[^\d.]/g, '')))
      return (min + max) / 2
    }
    
    // Handle other numeric strings (e.g., "<100" -> 100, "95" -> 95)
    return parseFloat(value.replace(/[^\d.]/g, '')) || 0
  }

  // Start animations
  const startAnimations = useCallback(() => {
    if (hasAnimated) return
    
    metrics.forEach((metric, index) => {
      const numericValue = getNumericValue(metric.value)
      
      setTimeout(() => {
        animateValue(0, numericValue, duration, (currentValue) => {
          setAnimatedValues(prev => ({
            ...prev,
            [index]: currentValue
          }))
        })
      }, index * 200) // Stagger animations
    })
    
    setHasAnimated(true)
  }, [hasAnimated, metrics, duration])

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    if (!animateOnScroll) {
      startAnimations()
      return
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            startAnimations()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [animateOnScroll, hasAnimated, startAnimations])

  // Format display value
  const formatDisplayValue = (metric: ProjectMetric, index: number): string => {
    const animatedValue = animatedValues[index]
    
    if (animatedValue === undefined) {
      return typeof metric.value === 'string' ? metric.value : metric.value.toString()
    }
    
    const originalValue = metric.value.toString()
    
    // Handle percentage ranges
    if (originalValue.includes('-')) {
      const [min, max] = originalValue.split('-')
      const minNum = parseFloat(min.replace(/[^\d.]/g, ''))
      const maxNum = parseFloat(max.replace(/[^\d.]/g, ''))
      const range = maxNum - minNum
      const progress = animatedValue / ((minNum + maxNum) / 2)
      const currentMin = Math.round(minNum + (range * progress * 0.3))
      const currentMax = Math.round(maxNum * progress)
      return `${currentMin}-${currentMax}`
    }
    
    // Handle prefixed values like "<100"
    if (originalValue.startsWith('<')) {
      return `<${Math.round(animatedValue)}`
    }
    
    // Handle regular numbers
    if (typeof metric.value === 'number' || !isNaN(parseFloat(originalValue))) {
      return Math.round(animatedValue).toString()
    }
    
    return originalValue
  }

  return (
    <div ref={containerRef} className={`${styles.metricsContainer} fade-in-on-scroll`}>
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div 
            key={index} 
            className={`${styles.metricCard} scale-in-on-scroll`}
            style={{ 
              '--metric-color': metric.color || 'var(--portfolio-interactive)',
              animationDelay: `${index * 100}ms`
            } as React.CSSProperties}
          >
            <div className={styles.metricContent}>
              <div className={styles.metricValue}>
                <span className={styles.value}>
                  {formatDisplayValue(metric, index)}
                </span>
                {metric.unit && (
                  <span className={styles.unit}>{metric.unit}</span>
                )}
              </div>
              
              <h3 className={styles.metricLabel}>{metric.label}</h3>
              
              {metric.improvement && (
                <p className={styles.metricImprovement}>
                  <svg 
                    className={styles.improvementIcon} 
                    width="12" 
                    height="12" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z"/>
                  </svg>
                  {metric.improvement}
                </p>
              )}
            </div>
            
            {/* Animated Background Accent */}
            <div 
              className={styles.metricAccent}
              style={{
                background: `linear-gradient(135deg, ${metric.color || 'var(--portfolio-interactive)'}20, transparent)`,
                animationDelay: `${index * 150}ms`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
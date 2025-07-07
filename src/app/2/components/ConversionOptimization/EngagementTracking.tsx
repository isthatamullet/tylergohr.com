"use client"

import React, { useEffect, useCallback, useRef, useState } from 'react'
import { CTAContext, calculateEngagementLevel } from './CallToActionOptimizer'

export interface EngagementEvent {
  type: 'scroll' | 'click' | 'hover' | 'focus' | 'section_view' | 'time_milestone' | 'interaction'
  timestamp: number
  data: {
    element?: string
    section?: string
    scrollProgress?: number
    timeOnPage?: number
    coordinates?: { x: number; y: number }
    value?: string | number
  }
}

export interface EngagementMetrics {
  totalTimeOnPage: number
  scrollDepth: number
  sectionsViewed: string[]
  interactionCount: number
  averageSessionTime: number
  bounceRate: number
  conversionEvents: number
  deviceType: 'mobile' | 'tablet' | 'desktop'
  isReturningVisitor: boolean
}

export interface EngagementTrackingProps {
  className?: string
  onEngagementUpdate?: (context: CTAContext) => void
  onEngagementEvent?: (event: EngagementEvent) => void
  onMetricsUpdate?: (metrics: EngagementMetrics) => void
  trackingEnabled?: boolean
  debugMode?: boolean
}

/**
 * Engagement Tracking Component
 * Comprehensive user interaction monitoring for conversion optimization
 * Tracks scroll behavior, section views, time on page, and interaction patterns
 */
export const EngagementTracking: React.FC<EngagementTrackingProps> = ({
  onEngagementUpdate,
  onEngagementEvent,
  onMetricsUpdate,
  trackingEnabled = true,
  debugMode = false
}) => {
  const [context, setContext] = useState<CTAContext>({
    currentSection: 'hero',
    scrollProgress: 0,
    timeOnPage: 0,
    sectionsViewed: [],
    interactionEvents: [],
    deviceType: 'desktop',
    isReturningVisitor: false,
    engagementLevel: 'low'
  })

  const [metrics, setMetrics] = useState<EngagementMetrics>({
    totalTimeOnPage: 0,
    scrollDepth: 0,
    sectionsViewed: [],
    interactionCount: 0,
    averageSessionTime: 0,
    bounceRate: 0,
    conversionEvents: 0,
    deviceType: 'desktop',
    isReturningVisitor: false
  })

  const startTimeRef = useRef<number>(Date.now())
  const lastScrollTimeRef = useRef<number>(Date.now())
  const sectionObserverRef = useRef<IntersectionObserver | null>(null)
  const eventsRef = useRef<EngagementEvent[]>([])
  const interactionCountRef = useRef<number>(0)

  // Detect device type
  const detectDeviceType = useCallback((): CTAContext['deviceType'] => {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1200) return 'tablet'
    return 'desktop'
  }, [])

  // Check if returning visitor
  const detectReturningVisitor = useCallback((): boolean => {
    try {
      const lastVisit = localStorage.getItem('portfolio_last_visit')
      const now = Date.now()
      
      if (lastVisit) {
        const lastVisitTime = parseInt(lastVisit, 10)
        const daysSinceLastVisit = (now - lastVisitTime) / (1000 * 60 * 60 * 24)
        
        // Consider returning visitor if last visit was within 30 days
        if (daysSinceLastVisit <= 30) {
          return true
        }
      }
      
      // Store current visit
      localStorage.setItem('portfolio_last_visit', now.toString())
      return false
    } catch {
      // localStorage not available
      return false
    }
  }, [])

  // Log engagement event
  const logEvent = useCallback((event: EngagementEvent) => {
    if (!trackingEnabled) return
    
    eventsRef.current.push(event)
    
    // Keep only last 100 events to prevent memory bloat
    if (eventsRef.current.length > 100) {
      eventsRef.current = eventsRef.current.slice(-100)
    }
    
    if (debugMode) {
      console.log('Engagement Event:', event)
    }
    
    if (onEngagementEvent) {
      onEngagementEvent(event)
    }
  }, [trackingEnabled, debugMode, onEngagementEvent])

  // Update scroll progress
  const updateScrollProgress = useCallback(() => {
    const scrollTop = window.pageYOffset
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = Math.min(Math.round((scrollTop / docHeight) * 100), 100)
    
    setContext(prev => {
      if (prev.scrollProgress !== scrollProgress) {
        const newContext = { ...prev, scrollProgress }
        
        // Log scroll milestones
        if (scrollProgress > 0 && scrollProgress % 25 === 0 && scrollProgress !== prev.scrollProgress) {
          logEvent({
            type: 'scroll',
            timestamp: Date.now(),
            data: { scrollProgress }
          })
        }
        
        return newContext
      }
      return prev
    })
    
    setMetrics(prev => ({ ...prev, scrollDepth: Math.max(prev.scrollDepth, scrollProgress) }))
    lastScrollTimeRef.current = Date.now()
  }, [logEvent])

  // Update time on page
  const updateTimeOnPage = useCallback(() => {
    const timeOnPage = Date.now() - startTimeRef.current
    
    setContext(prev => {
      const newContext = { ...prev, timeOnPage }
      
      // Log time milestones (30s, 1m, 2m, 5m)
      const milestones = [30000, 60000, 120000, 300000]
      milestones.forEach(milestone => {
        if (timeOnPage >= milestone && prev.timeOnPage < milestone) {
          logEvent({
            type: 'time_milestone',
            timestamp: Date.now(),
            data: { timeOnPage: milestone }
          })
        }
      })
      
      return newContext
    })
    
    setMetrics(prev => ({ ...prev, totalTimeOnPage: timeOnPage }))
  }, [logEvent])

  // Track section visibility
  const setupSectionObserver = useCallback(() => {
    if (sectionObserverRef.current) {
      sectionObserverRef.current.disconnect()
    }
    
    const options = {
      threshold: 0.3, // Section must be 30% visible
      rootMargin: '-10% 0px -10% 0px'
    }
    
    sectionObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          if (sectionId) {
            setContext(prev => {
              if (!prev.sectionsViewed.includes(sectionId)) {
                const newSectionsViewed = [...prev.sectionsViewed, sectionId]
                
                logEvent({
                  type: 'section_view',
                  timestamp: Date.now(),
                  data: { section: sectionId }
                })
                
                return {
                  ...prev,
                  currentSection: sectionId,
                  sectionsViewed: newSectionsViewed
                }
              }
              return { ...prev, currentSection: sectionId }
            })
            
            setMetrics(prev => ({
              ...prev,
              sectionsViewed: [...new Set([...prev.sectionsViewed, sectionId])]
            }))
          }
        }
      })
    }, options)
    
    // Observe all sections
    const sections = document.querySelectorAll('section[id], [data-section]')
    sections.forEach(section => {
      if (sectionObserverRef.current) {
        sectionObserverRef.current.observe(section)
      }
    })
  }, [logEvent])

  // Track interactions
  const trackInteraction = useCallback((event: MouseEvent | KeyboardEvent, type: 'click' | 'hover' | 'focus') => {
    if (!trackingEnabled) return
    
    const target = event.target as HTMLElement
    const elementInfo = target.tagName.toLowerCase() + 
      (target.className ? `.${target.className.split(' ')[0]}` : '') +
      (target.id ? `#${target.id}` : '')
    
    interactionCountRef.current += 1
    
    const interactionEvent: EngagementEvent = {
      type: type,
      timestamp: Date.now(),
      data: {
        element: elementInfo,
        coordinates: 'clientX' in event ? { x: event.clientX, y: event.clientY } : undefined
      }
    }
    
    logEvent(interactionEvent)
    
    setContext(prev => ({
      ...prev,
      interactionEvents: [...prev.interactionEvents, `${type}:${elementInfo}`].slice(-20) // Keep last 20
    }))
    
    setMetrics(prev => ({ ...prev, interactionCount: interactionCountRef.current }))
  }, [trackingEnabled, logEvent])

  // Update engagement level
  const updateEngagementLevel = useCallback(() => {
    setContext(prev => {
      const newEngagementLevel = calculateEngagementLevel(prev)
      return { ...prev, engagementLevel: newEngagementLevel }
    })
  }, [])

  // Initialize tracking
  useEffect(() => {
    if (!trackingEnabled) return
    
    const deviceType = detectDeviceType()
    const isReturningVisitor = detectReturningVisitor()
    
    setContext(prev => ({ ...prev, deviceType, isReturningVisitor }))
    setMetrics(prev => ({ ...prev, deviceType, isReturningVisitor }))
    
    // Setup scroll tracking
    const handleScroll = () => updateScrollProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Setup interaction tracking
    const handleClick = (e: MouseEvent) => trackInteraction(e, 'click')
    const handleMouseEnter = (e: MouseEvent) => trackInteraction(e, 'hover')
    
    document.addEventListener('click', handleClick)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    
    // Setup time tracking
    const timeInterval = setInterval(updateTimeOnPage, 1000)
    const engagementInterval = setInterval(updateEngagementLevel, 5000)
    
    // Setup section observation
    setupSectionObserver()
    
    // Initial updates
    updateScrollProgress()
    updateTimeOnPage()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      clearInterval(timeInterval)
      clearInterval(engagementInterval)
      
      if (sectionObserverRef.current) {
        sectionObserverRef.current.disconnect()
      }
    }
  }, [
    trackingEnabled,
    detectDeviceType,
    detectReturningVisitor,
    updateScrollProgress,
    updateTimeOnPage,
    updateEngagementLevel,
    setupSectionObserver,
    trackInteraction
  ])

  // Call update callbacks when context changes
  useEffect(() => {
    if (onEngagementUpdate) {
      onEngagementUpdate(context)
    }
  }, [context, onEngagementUpdate])

  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics)
    }
  }, [metrics, onMetricsUpdate])

  // Expose context and metrics for external access
  React.useEffect(() => {
    // Store context in global for debugging
    if (debugMode && typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>).engagementContext = context;
      (window as unknown as Record<string, unknown>).engagementMetrics = metrics;
      (window as unknown as Record<string, unknown>).engagementEvents = eventsRef.current;
    }
  }, [context, metrics, debugMode])

  // This component doesn't render any UI - it's purely for tracking
  return null
}

// Hook for using engagement tracking in other components
export const useEngagementTracking = (): [CTAContext, EngagementMetrics, EngagementEvent[]] => {
  const [context] = useState<CTAContext>({
    currentSection: 'hero',
    scrollProgress: 0,
    timeOnPage: 0,
    sectionsViewed: [],
    interactionEvents: [],
    deviceType: 'desktop',
    isReturningVisitor: false,
    engagementLevel: 'low'
  })
  
  const [metrics] = useState<EngagementMetrics>({
    totalTimeOnPage: 0,
    scrollDepth: 0,
    sectionsViewed: [],
    interactionCount: 0,
    averageSessionTime: 0,
    bounceRate: 0,
    conversionEvents: 0,
    deviceType: 'desktop',
    isReturningVisitor: false
  })
  
  const [events] = useState<EngagementEvent[]>([])

  return [context, metrics, events]
}

// Utility function to get engagement summary
export const getEngagementSummary = (
  context: CTAContext, 
  metrics: EngagementMetrics
): string => {
  const minutes = Math.floor(context.timeOnPage / 60000)
  const seconds = Math.floor((context.timeOnPage % 60000) / 1000)
  const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
  
  return `${context.engagementLevel.toUpperCase()} engagement - ${timeString} on page, ${context.scrollProgress}% scrolled, ${context.sectionsViewed.length} sections viewed, ${metrics.interactionCount} interactions`
}

export default EngagementTracking
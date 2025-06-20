'use client'

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals'
import { useEffect } from 'react'
import { logWebVital } from './PerformanceOptimizations'

export default function WebVitals() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Monitor all Core Web Vitals
    onCLS(logWebVital)
    onFCP(logWebVital) 
    onINP(logWebVital) // Interaction to Next Paint (replaces FID)
    onLCP(logWebVital)
    onTTFB(logWebVital)

    // Additional performance monitoring
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navigationEntry = entry as PerformanceNavigationTiming
          console.log(`%c[Navigation] DOM Content Loaded: ${navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart}ms`, 'color: #2563eb')
          console.log(`%c[Navigation] Page Load Complete: ${navigationEntry.loadEventEnd - navigationEntry.loadEventStart}ms`, 'color: #2563eb')
        }
        
        if (entry.entryType === 'paint') {
          console.log(`%c[Paint] ${entry.name}: ${entry.startTime}ms`, 'color: #7c3aed')
        }
      }
    })

    observer.observe({ entryTypes: ['navigation', 'paint'] })

    // Monitor long tasks that could impact performance
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks over 50ms
          console.warn(`%c[Long Task] ${entry.duration}ms task detected`, 'color: #dc2626')
        }
      }
    })

    if ('PerformanceObserver' in window) {
      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] })
      } catch {
        // longtask not supported in all browsers
      }
    }

    return () => {
      observer.disconnect()
      longTaskObserver.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}
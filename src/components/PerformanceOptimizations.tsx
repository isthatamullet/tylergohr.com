'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'
import type { Metric } from 'web-vitals'

export default function PerformanceOptimizations() {
  // Report Web Vitals for monitoring
  useReportWebVitals((metric) => {
    // In production, you would send this to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric)
    }
    
    // Example: Send to analytics service
    // analytics.track('Web Vital', {
    //   name: metric.name,
    //   value: metric.value,
    //   id: metric.id,
    //   label: metric.label,
    // })
  })

  useEffect(() => {
    // Optimize font loading
    const optimizeFontLoading = () => {
      // Preload critical fonts - reserved for future font optimization
      // const criticalFonts = [
      //   'system-ui',
      //   '-apple-system', 
      //   'BlinkMacSystemFont',
      //   'Segoe UI',
      //   'Roboto',
      //   'Helvetica Neue',
      //   'Arial',
      //   'sans-serif'
      // ]

      // Check if font-display is supported
      if ('fontDisplay' in document.documentElement.style) {
        const fontFaces = document.fonts?.values()
        if (fontFaces) {
          for (const fontFace of fontFaces) {
            if (fontFace.display !== 'swap') {
              fontFace.display = 'swap'
            }
          }
        }
      }
    }

    // Optimize images for better LCP
    const optimizeImages = () => {
      // Add loading="lazy" to images below the fold
      const images = document.querySelectorAll('img:not([loading])') as NodeListOf<HTMLImageElement>
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              const dataSrc = img.getAttribute('data-src')
              if (dataSrc && (dataSrc.startsWith('http://') || dataSrc.startsWith('https://') || dataSrc.startsWith('/'))) {
                img.src = dataSrc
                img.removeAttribute('data-src')
              }
              imageObserver.unobserve(img)
            }
          })
        },
        {
          root: null,
          rootMargin: '50px',
          threshold: 0.1
        }
      )

      images.forEach((img) => {
        const rect = img.getBoundingClientRect()
        const isAboveFold = rect.top < window.innerHeight

        if (!isAboveFold) {
          img.setAttribute('loading', 'lazy')
          // Implement lazy loading for better performance
          if (img.src) {
            img.setAttribute('data-src', img.src)
            img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+'
          }
          imageObserver.observe(img)
        } else {
          // Mark critical images for high priority
          img.setAttribute('fetchpriority', 'high')
        }
      })
    }

    // Reduce layout shift by reserving space for dynamic content
    const preventLayoutShift = () => {
      // Add min-height to containers that will have dynamic content
      const dynamicContainers = document.querySelectorAll('[data-dynamic-content]') as NodeListOf<HTMLElement>
      dynamicContainers.forEach((container) => {
        if (!container.style.minHeight) {
          container.style.minHeight = '100px'
        }
      })
    }

    // Optimize third-party scripts
    const optimizeThirdPartyScripts = () => {
      // Defer non-critical scripts
      const scripts = document.querySelectorAll('script[src]:not([defer]):not([async])')
      scripts.forEach((script) => {
        if (!script.getAttribute('src')?.includes('_next/static')) {
          script.setAttribute('defer', '')
        }
      })
    }

    // Resource hints for better performance
    const addResourceHints = () => {
      const head = document.head
      
      // Preconnect to external domains (if any)
      const preconnects: string[] = [
        // Add any external domains you use
        // 'https://fonts.googleapis.com',
        // 'https://analytics.google.com',
      ]

      preconnects.forEach((url) => {
        const link = document.createElement('link')
        link.rel = 'preconnect'
        link.href = url
        link.crossOrigin = 'anonymous'
        head.appendChild(link)
      })

      // Prefetch next likely pages
      const prefetchPages: string[] = [
        // Add pages that users are likely to visit next
        // '/projects',
        // '/about',
      ]

      prefetchPages.forEach((page) => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = page
        head.appendChild(link)
      })
    }

    // Critical CSS optimization
    const optimizeCriticalCSS = () => {
      // Mark critical CSS as high priority
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]')
      stylesheets.forEach((stylesheet, index) => {
        if (index === 0) {
          // First stylesheet is typically critical
          stylesheet.setAttribute('data-critical', 'true')
        } else {
          // Non-critical stylesheets can be loaded asynchronously
          stylesheet.setAttribute('media', 'print')
          stylesheet.addEventListener('load', () => {
            stylesheet.setAttribute('media', 'all')
          })
        }
      })
    }

    // Run optimizations
    optimizeFontLoading()
    optimizeImages()
    preventLayoutShift()
    optimizeThirdPartyScripts()
    addResourceHints()
    optimizeCriticalCSS()

  }, [])

  return null // This component doesn't render anything
}

// Web Vitals thresholds for monitoring
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  INP: { good: 200, needsImprovement: 500 },   // Interaction to Next Paint (replaces FID)
  CLS: { good: 0.1, needsImprovement: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  TTFB: { good: 800, needsImprovement: 1800 }, // Time to First Byte
}

// Performance monitoring utilities
export const logWebVital = (metric: Metric) => {
  const { name, value } = metric
  const threshold = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS]
  
  let rating = 'poor'
  if (threshold) {
    if (value <= threshold.good) rating = 'good'
    else if (value <= threshold.needsImprovement) rating = 'needs-improvement'
  }

  console.log(`%c[${name}] ${value}ms (${rating})`, 
    `color: ${rating === 'good' ? '#16a34a' : rating === 'needs-improvement' ? '#f59e0b' : '#dc2626'}`
  )
  
  // Performance budget alerts
  if (rating === 'poor') {
    console.warn(`Performance budget exceeded for ${name}: ${value}ms`)
  }
}
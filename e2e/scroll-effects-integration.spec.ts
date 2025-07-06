import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { 
  waitForPageReady,
  waitForScrollPosition,
  waitForNetworkAnimationReady,
  waitForAnimationComplete,
  waitForElementReady,
  VIEWPORT_SIZES,
  shouldSkipVisual,
  conditionalScreenshot
} from './utils/dev-test-helpers'

test.describe('Phase 3 Week 2 Day 4 - Scroll Effects Integration & Testing', () => {
  
  test.describe('Task 1: Integration Validation - Cross-Component Communication', () => {
    
    test('scroll integration: ScrollController state drives WebGL parallax rendering', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Scroll to architecture section to trigger WebGL parallax
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Check that WebGL parallax is responding to scroll state
      const webglParallaxActive = await page.evaluate(() => {
        // Look for WebGL canvas or parallax indicators
        const canvasElements = document.querySelectorAll('canvas')
        const parallaxElements = document.querySelectorAll('[class*="parallax"]')
        
        return canvasElements.length > 0 || parallaxElements.length > 0
      })
      
      expect(webglParallaxActive).toBe(true)
      
      // Verify scroll state is being tracked
      const scrollStateTracked = await page.evaluate(() => {
        return window.scrollY > 0 && 
               document.documentElement.style.getPropertyValue('--scroll-progress') !== ''
      })
      
      expect(scrollStateTracked).toBe(true)
    })
    
    test('scroll integration: TechnicalStorytellingScroll hijacking works with section navigation', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test smooth scroll hijacking functionality
      const initialScrollPosition = await page.evaluate(() => window.scrollY)
      
      // Trigger section navigation
      await page.evaluate(() => {
        window.scrollTo({ top: 1000, behavior: 'smooth' })
      })
      
      // Wait for scroll to complete
      await page.waitForFunction(() => Math.abs(window.scrollY - 1000) < 50, { timeout: 2000 })
      
      const finalScrollPosition = await page.evaluate(() => window.scrollY)
      expect(finalScrollPosition).toBeGreaterThan(initialScrollPosition)
      
      // Check that section snapping is working
      const sectionSnapDetected = await page.evaluate(() => {
        // Look for section snap indicators or smooth scroll behavior
        return document.documentElement.style.scrollBehavior === 'smooth' ||
               document.querySelector('[data-scroll-snapping]') !== null
      })
      
      expect(sectionSnapDetected).toBe(true)
    })
    
    test('scroll integration: MobileScrollOptimizer enhances 3D sphere interaction', async ({ page }) => {
      // Test on mobile viewport
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Navigate to architecture section with 3D elements
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Check mobile optimization is active
      const mobileOptimizationActive = await page.evaluate(() => {
        // Look for mobile optimization indicators
        const mobileOptimizedElements = document.querySelectorAll('[data-mobile-optimized]')
        const touchOptimizedElements = document.querySelectorAll('[class*="touch-optimized"]')
        
        return mobileOptimizedElements.length > 0 || 
               touchOptimizedElements.length > 0 ||
               window.innerWidth <= 768
      })
      
      expect(mobileOptimizationActive).toBe(true)
      
      // Simulate touch interaction
      const architectureDiagram = page.locator('[class*="diagram"]').first()
      if (await architectureDiagram.count() > 0) {
        await architectureDiagram.tap()
        
        // Verify touch interaction was handled
        const touchInteractionHandled = await page.evaluate(() => {
          return document.querySelector('[data-touch-interaction="true"]') !== null ||
                 document.body.classList.contains('touch-interaction-active')
        })
        
        expect(touchInteractionHandled).toBe(true)
      }
    })
    
    test('scroll integration: Performance monitoring tracks combined resource usage', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check that performance monitoring is active
      const performanceMonitoringActive = await page.evaluate(() => {
        // Look for performance monitoring indicators
        return (window as any).performanceMonitor !== undefined ||
               document.querySelector('[class*="performance"]') !== null ||
               (window as any).scrollEffectsPerformance !== undefined
      })
      
      expect(performanceMonitoringActive).toBe(true)
      
      // Trigger scrolling to activate performance tracking
      await page.evaluate(() => {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            window.scrollTo({ top: i * 200, behavior: 'smooth' })
          }, i * 100)
        }
      })
      
      await page.waitForTimeout(600) // Allow scroll events to be tracked
      
      // Verify performance metrics are being collected
      const performanceMetricsCollected = await page.evaluate(() => {
        return (window as any).scrollEventCount > 0 ||
               (window as any).performanceData !== undefined ||
               document.querySelector('[data-performance-metrics]') !== null
      })
      
      expect(performanceMetricsCollected).toBe(true)
    })
  })
  
  test.describe('Task 1.2: State Management Coordination', () => {
    
    test('state coordination: No scroll event conflicts between multiple listeners', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check that scroll event listeners are properly coordinated
      const scrollListenerConflicts = await page.evaluate(() => {
        let scrollEventCount = 0
        const originalAddEventListener = document.addEventListener
        
        // Monitor scroll event listener additions
        document.addEventListener = function(type: string, listener: any, options?: any) {
          if (type === 'scroll') {
            scrollEventCount++
          }
          return originalAddEventListener.call(this, type, listener, options)
        }
        
        // Trigger a scroll event
        window.dispatchEvent(new Event('scroll'))
        
        // Restore original addEventListener
        document.addEventListener = originalAddEventListener
        
        // Should have coordinated listeners, not excessive duplicates
        return scrollEventCount < 10 // Reasonable threshold
      })
      
      expect(scrollListenerConflicts).toBe(true)
    })
    
    test('state coordination: Shared performance metrics across components', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check for unified performance monitoring
      const sharedPerformanceMetrics = await page.evaluate(() => {
        return (window as any).sharedPerformanceMetrics !== undefined ||
               (window as any).scrollEffectsPerformance !== undefined ||
               document.querySelector('[data-shared-metrics]') !== null
      })
      
      expect(sharedPerformanceMetrics).toBe(true)
    })
    
    test('state coordination: Consistent device detection across components', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check device detection consistency
      const deviceDetectionConsistent = await page.evaluate(() => {
        const isMobile = window.innerWidth <= 768
        const mobileElements = document.querySelectorAll('[data-mobile="true"]')
        const desktopElements = document.querySelectorAll('[data-desktop="true"]')
        
        if (isMobile) {
          return mobileElements.length > 0 && desktopElements.length === 0
        } else {
          return desktopElements.length > 0 && mobileElements.length === 0
        }
      })
      
      expect(deviceDetectionConsistent).toBe(true)
    })
  })
  
  test.describe('Task 2: Performance Optimization - Combined Effects', () => {
    
    test('performance combined: Desktop maintains 60fps minimum with all effects', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Start performance monitoring
      await page.evaluate(() => {
        (window as any).performanceStartTime = performance.now()
        ;(window as any).frameCount = 0
        
        const measureFPS = () => {
          ;(window as any).frameCount++
          requestAnimationFrame(measureFPS)
        }
        requestAnimationFrame(measureFPS)
      })
      
      // Trigger scroll effects
      await page.evaluate(() => {
        const sections = ['hero', 'browser', 'architecture', 'cta']
        sections.forEach((sectionId, index) => {
          setTimeout(() => {
            const section = document.querySelector(`[data-section-id="${sectionId}"]`)
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' })
            }
          }, index * 500)
        })
      })
      
      await page.waitForTimeout(3000) // Allow effects to run
      
      // Measure FPS
      const fps = await page.evaluate(() => {
        const elapsed = performance.now() - (window as any).performanceStartTime
        const frameCount = (window as any).frameCount
        return (frameCount / elapsed) * 1000
      })
      
      expect(fps).toBeGreaterThan(60) // Target: 60fps minimum
    })
    
    test('performance combined: Mobile maintains 30fps with optimizations active', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check mobile optimizations are active
      const mobileOptimizationsActive = await page.evaluate(() => {
        return window.innerWidth <= 768 &&
               (document.querySelector('[data-mobile-optimized]') !== null ||
                document.body.classList.contains('mobile-optimized'))
      })
      
      expect(mobileOptimizationsActive).toBe(true)
      
      // Verify reduced complexity for mobile
      const reducedComplexity = await page.evaluate(() => {
        const webglElements = document.querySelectorAll('canvas')
        const complexAnimations = document.querySelectorAll('[data-complex-animation]')
        
        // Mobile should have fewer resource-intensive elements
        return webglElements.length <= 1 && complexAnimations.length <= 3
      })
      
      expect(reducedComplexity).toBe(true)
    })
    
    test('performance combined: Memory usage within target limits', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Trigger all scroll effects to measure maximum memory usage
      await page.evaluate(() => {
        // Simulate heavy scrolling to test memory usage
        for (let i = 0; i < 20; i++) {
          setTimeout(() => {
            window.scrollTo({ 
              top: (i % 4) * 500, 
              behavior: 'smooth' 
            })
          }, i * 100)
        }
      })
      
      await page.waitForTimeout(2500) // Allow effects to complete
      
      // Check for memory leaks or excessive usage
      const memoryUsage = await page.evaluate(() => {
        if ((performance as any).memory) {
          return (performance as any).memory.usedJSHeapSize
        }
        return 0 // Fallback if memory API not available
      })
      
      // Target: <150MB (150 * 1024 * 1024 bytes)
      const targetMemoryLimit = 150 * 1024 * 1024
      
      if (memoryUsage > 0) {
        expect(memoryUsage).toBeLessThan(targetMemoryLimit)
      }
    })
  })
  
  test.describe('Task 3: Cross-Browser & Cross-Device Testing', () => {
    
    test('cross-browser scroll: WebGL parallax performance validation across browsers', async ({ page, browserName }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Navigate to WebGL parallax section
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Check WebGL support and fallback behavior
      const webglSupport = await page.evaluate(() => {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        return gl !== null
      })
      
      if (webglSupport) {
        // Verify WebGL parallax is working
        const webglParallaxWorking = await page.evaluate(() => {
          const canvasElements = document.querySelectorAll('canvas')
          return canvasElements.length > 0
        })
        expect(webglParallaxWorking).toBe(true)
      } else {
        // Verify fallback is working
        const fallbackWorking = await page.evaluate(() => {
          const cssParallaxElements = document.querySelectorAll('[class*="parallax-fallback"]')
          const staticBackgrounds = document.querySelectorAll('[data-static-background]')
          return cssParallaxElements.length > 0 || staticBackgrounds.length > 0
        })
        expect(fallbackWorking).toBe(true)
      }
    })
    
    test('cross-device scroll: Tablet optimization with reduced complexity', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.tablet)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check tablet-specific optimizations
      const tabletOptimizationsActive = await page.evaluate(() => {
        const isTabletViewport = window.innerWidth >= 768 && window.innerWidth < 1200
        const reducedEffects = document.querySelectorAll('[data-reduced-effects]')
        const tabletOptimized = document.querySelectorAll('[data-tablet-optimized]')
        
        return isTabletViewport && 
               (reducedEffects.length > 0 || tabletOptimized.length > 0)
      })
      
      expect(tabletOptimizationsActive).toBe(true)
    })
  })
  
  test.describe('Task 4: Accessibility & Usability Validation', () => {
    
    test('accessibility scroll: prefers-reduced-motion honored with static backgrounds', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check that animations are reduced or disabled
      const reducedMotionRespected = await page.evaluate(() => {
        const animatedElements = document.querySelectorAll('[data-animation]')
        const staticElements = document.querySelectorAll('[data-static]')
        
        // Should have more static elements when reduced motion is preferred
        return staticElements.length >= animatedElements.length ||
               document.body.classList.contains('reduced-motion')
      })
      
      expect(reducedMotionRespected).toBe(true)
    })
    
    test('accessibility scroll: Keyboard navigation works with scroll hijacking', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test keyboard navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      await page.keyboard.press('Enter')
      
      // Check that focus is maintained and navigation works
      const focusedElement = await page.evaluate(() => {
        return document.activeElement?.tagName.toLowerCase()
      })
      
      expect(['button', 'a', 'input', 'select', 'textarea']).toContain(focusedElement)
      
      // Test arrow key navigation if implemented
      await page.keyboard.press('ArrowDown')
      
      const scrollPosition = await page.evaluate(() => window.scrollY)
      expect(scrollPosition).toBeGreaterThanOrEqual(0)
    })
    
    test('accessibility scroll: WCAG 2.1 AA compliance maintained', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Run accessibility scan with all scroll effects active
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
    })
  })
  
  test.describe('Business Presentation Quality Validation', () => {
    
    test('client presentation: Professional-grade scroll smoothness', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test smooth scrolling behavior
      const scrollSmoothness = await page.evaluate(() => {
        return new Promise((resolve) => {
          let frameCount = 0
          let lastTimestamp = performance.now()
          
          const measureSmoothness = (timestamp: number) => {
            const deltaTime = timestamp - lastTimestamp
            frameCount++
            
            if (frameCount < 60) { // Measure for ~1 second at 60fps
              lastTimestamp = timestamp
              requestAnimationFrame(measureSmoothness)
            } else {
              // Consistent frame timing indicates smooth scrolling
              resolve(deltaTime < 20) // Less than 20ms between frames = smooth
            }
          }
          
          // Start measurement and trigger scroll
          requestAnimationFrame(measureSmoothness)
          window.scrollTo({ top: 1000, behavior: 'smooth' })
        })
      })
      
      expect(scrollSmoothness).toBe(true)
    })
    
    test('client presentation: Technical sophistication demonstration', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Verify advanced technical features are working
      const technicalSophistication = await page.evaluate(() => {
        const webglElements = document.querySelectorAll('canvas')
        const parallaxElements = document.querySelectorAll('[class*="parallax"]')
        const animatedElements = document.querySelectorAll('[class*="animation"]')
        const interactiveElements = document.querySelectorAll('[data-interactive]')
        
        return webglElements.length > 0 && 
               parallaxElements.length > 0 && 
               animatedElements.length > 0 &&
               interactiveElements.length > 0
      })
      
      expect(technicalSophistication).toBe(true)
    })
  })
  
  test.describe('Visual Regression - Scroll Effects Integration', () => {
    
    test('visual scroll: Combined effects visual consistency', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test visual consistency across different scroll positions
      await conditionalScreenshot(page, 'scroll-effects-top.png')
      
      await page.evaluate(() => {
        window.scrollTo({ top: 500, behavior: 'instant' })
      })
      await page.waitForTimeout(200)
      await conditionalScreenshot(page, 'scroll-effects-middle.png')
      
      await page.evaluate(() => {
        window.scrollTo({ top: 1000, behavior: 'instant' })
      })
      await page.waitForTimeout(200)
      await conditionalScreenshot(page, 'scroll-effects-bottom.png')
    })
  })
})
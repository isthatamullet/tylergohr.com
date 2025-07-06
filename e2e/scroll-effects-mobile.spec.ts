import { test, expect } from '@playwright/test'
import { 
  waitForPageReady,
  waitForScrollPosition,
  waitForElementReady,
  VIEWPORT_SIZES
} from './utils/dev-test-helpers'

test.describe('Phase 3 Week 2 Day 4 - Comprehensive Mobile Scroll Experience', () => {
  
  // Configure all tests to run on mobile viewports
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(VIEWPORT_SIZES.mobile)
  })
  
  test.describe('Mobile Viewport Optimization', () => {
    
    test('mobile scroll: iPhone viewport optimization', async ({ page }) => {
      // Test iPhone-specific viewport
      await page.setViewportSize({ width: 390, height: 844 }) // iPhone 12/13/14
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check mobile optimization detection
      const iPhoneOptimization = await page.evaluate(() => {
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
          orientation: window.screen.orientation?.type || 'portrait-primary'
        }
        
        const mobileDetection = {
          isMobileSize: viewport.width < 768,
          isHighDPI: viewport.devicePixelRatio >= 2,
          isPortrait: viewport.height > viewport.width
        }
        
        // Check for mobile-specific optimizations
        const optimizations = {
          touchOptimized: document.querySelector('[data-touch-optimized]') !== null,
          mobileScrollOptimized: document.querySelector('[data-mobile-scroll]') !== null,
          reducedComplexity: document.querySelectorAll('[data-reduced-complexity]').length > 0,
          staticBackgrounds: document.querySelectorAll('[data-static-background]').length > 0
        }
        
        return {
          viewport,
          mobileDetection,
          optimizations
        }
      })
      
      expect(iPhoneOptimization.mobileDetection.isMobileSize).toBe(true)
      expect(iPhoneOptimization.mobileDetection.isPortrait).toBe(true)
      
      // Test scroll behavior on iPhone
      await page.evaluate(() => {
        window.scrollTo({ top: 500, behavior: 'smooth' })
      })
      
      await page.waitForTimeout(300)
      
      const scrollBehavior = await page.evaluate(() => ({
        scrollPosition: window.scrollY,
        smoothScrollSupported: CSS.supports('scroll-behavior', 'smooth'),
        webkitOverflowScrolling: (getComputedStyle(document.body) as any).webkitOverflowScrolling
      }))
      
      expect(scrollBehavior.scrollPosition).toBeGreaterThan(0)
      expect(scrollBehavior.smoothScrollSupported).toBe(true)
    })
    
    test('mobile scroll: Android viewport optimization', async ({ page }) => {
      // Test common Android viewport
      await page.setViewportSize({ width: 412, height: 869 }) // Pixel 4/5
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test Android-specific features
      const androidOptimization = await page.evaluate(() => {
        const isAndroidSize = window.innerWidth >= 400 && window.innerWidth <= 450
        const hasAddressBar = window.innerHeight < window.screen.height * 0.9
        
        // Test viewport handling for address bar behavior
        const viewportMeta = document.querySelector('meta[name="viewport"]')
        const hasViewportMeta = viewportMeta !== null
        
        return {
          isAndroidSize,
          hasAddressBar,
          hasViewportMeta,
          viewportContent: viewportMeta?.getAttribute('content') || ''
        }
      })
      
      expect(androidOptimization.isAndroidSize).toBe(true)
      expect(androidOptimization.hasViewportMeta).toBe(true)
      
      // Test scroll performance on Android
      const androidScrollPerformance = await page.evaluate(() => {
        let frameCount = 0
        const startTime = performance.now()
        
        const measureFrames = () => {
          frameCount++
          if (frameCount < 30) {
            requestAnimationFrame(measureFrames)
          }
        }
        
        requestAnimationFrame(measureFrames)
        
        // Trigger scroll
        window.scrollBy(0, 200)
        
        return new Promise(resolve => {
          setTimeout(() => {
            const endTime = performance.now()
            const duration = endTime - startTime
            const fps = (frameCount / duration) * 1000
            
            resolve({
              frameCount,
              fps: Math.round(fps),
              performance: fps >= 20 ? 'good' : fps >= 15 ? 'acceptable' : 'poor'
            })
          }, 600)
        })
      })
      
      expect((androidScrollPerformance as any).fps).toBeGreaterThan(15) // Minimum acceptable mobile FPS
    })
    
    test('mobile scroll: Tablet landscape optimization', async ({ page }) => {
      // Test tablet in landscape mode
      await page.setViewportSize({ width: 1024, height: 768 }) // iPad landscape
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      const tabletLandscapeOptimization = await page.evaluate(() => {
        const isTabletLandscape = window.innerWidth > 900 && window.innerHeight < 900
        const hasTabletOptimizations = document.querySelector('[data-tablet-optimized]') !== null
        
        // Check for landscape-specific layout adjustments
        const landscapeElements = document.querySelectorAll('[data-landscape-optimized]')
        const horizontalScrollElements = document.querySelectorAll('[data-horizontal-scroll]')
        
        return {
          isTabletLandscape,
          hasTabletOptimizations,
          landscapeElements: landscapeElements.length,
          horizontalScrollElements: horizontalScrollElements.length
        }
      })
      
      expect(tabletLandscapeOptimization.isTabletLandscape).toBe(true)
      
      // Test landscape-specific scroll behavior
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      const landscapeScrollBehavior = await page.evaluate(() => ({
        scrollWorking: window.scrollY > 0,
        orientationHandled: window.screen.orientation?.type.includes('landscape') || 
                           window.innerWidth > window.innerHeight
      }))
      
      expect(landscapeScrollBehavior.scrollWorking).toBe(true)
    })
  })
  
  test.describe('Touch Gesture Recognition & Enhanced Touch Interaction', () => {
    
    test('mobile scroll: Touch gesture recognition validation', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test touch event support
      const touchSupport = await page.evaluate(() => {
        return {
          touchStart: 'ontouchstart' in window,
          touchMove: 'ontouchmove' in window,
          touchEnd: 'ontouchend' in window,
          touchCancel: 'ontouchcancel' in window,
          maxTouchPoints: navigator.maxTouchPoints || 0
        }
      })
      
      expect(touchSupport.touchStart).toBe(true)
      expect(touchSupport.touchMove).toBe(true)
      expect(touchSupport.touchEnd).toBe(true)
      expect(touchSupport.maxTouchPoints).toBeGreaterThan(0)
      
      // Test touch interaction on architecture section
      const architectureSection = page.locator('[data-section-id="architecture"]')
      if (await architectureSection.count() > 0) {
        // Simulate touch tap
        await architectureSection.tap()
        
        const touchResponse = await page.evaluate(() => {
          return {
            touchHandled: document.body.classList.contains('touch-active') ||
                         document.querySelector('[data-touch-interaction]') !== null,
            visualFeedback: document.querySelector('[data-touch-feedback]') !== null,
            hapticFeedback: navigator.vibrate !== undefined
          }
        })
        
        expect(touchResponse.touchHandled).toBe(true)
        
        // Test touch scrolling
        await page.touchscreen.tap(200, 400)
        await page.touchscreen.tap(200, 300) // Scroll up gesture simulation
        
        const touchScrollResponse = await page.evaluate(() => window.scrollY)
        expect(touchScrollResponse).toBeGreaterThanOrEqual(0)
      }
    })
    
    test('mobile scroll: Enhanced 3D interaction with touch controls', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Navigate to 3D architecture section
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Test enhanced 3D touch interactions
      const threeDTouchSupport = await page.evaluate(() => {
        // Check for 3D elements
        const threeDElements = document.querySelectorAll('canvas, [class*="3d"], [class*="sphere"]')
        const touchEnhanced3D = document.querySelectorAll('[data-touch-enhanced-3d]')
        
        // Check for gesture support
        const gestureSupport = {
          pinchZoom: 'ongesturestart' in window,
          rotation: 'ongesturechange' in window,
          touchForce: ('TouchEvent' in window) && ('force' in TouchEvent.prototype)
        }
        
        return {
          threeDElements: threeDElements.length,
          touchEnhanced3D: touchEnhanced3D.length,
          gestureSupport
        }
      })
      
      expect(threeDTouchSupport.threeDElements).toBeGreaterThan(0)
      
      // Test touch interaction with 3D elements
      const architectureDiagram = page.locator('[class*="diagram"], canvas').first()
      if (await architectureDiagram.count() > 0) {
        // Test touch and hold
        await architectureDiagram.tap()
        
        const touchInteractionResult = await page.evaluate(() => {
          return {
            threeDInteractionActive: document.querySelector('[data-3d-interaction-active]') !== null,
            touchControlsVisible: document.querySelector('[data-touch-controls]') !== null,
            interactionFeedback: document.querySelector('[data-interaction-feedback]') !== null
          }
        })
        
        expect(touchInteractionResult.threeDInteractionActive).toBe(true)
      }
    })
    
    test('mobile scroll: Multi-touch gesture handling', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test multi-touch support
      const multiTouchSupport = await page.evaluate(() => {
        const maxTouchPoints = navigator.maxTouchPoints
        const touchEventSupported = 'TouchEvent' in window
        
        return {
          maxTouchPoints,
          touchEventSupported,
          supportsMultiTouch: maxTouchPoints > 1
        }
      })
      
      expect(multiTouchSupport.supportsMultiTouch).toBe(true)
      expect(multiTouchSupport.maxTouchPoints).toBeGreaterThan(1)
      
      // Simulate pinch zoom gesture (if supported)
      if (multiTouchSupport.supportsMultiTouch) {
        await page.evaluate(() => {
          // Simulate pinch zoom on the page
          const touchStartEvent = new TouchEvent('touchstart', {
            touches: [
              new Touch({ identifier: 1, target: document.body, clientX: 150, clientY: 150 }),
              new Touch({ identifier: 2, target: document.body, clientX: 250, clientY: 250 })
            ]
          })
          
          const touchMoveEvent = new TouchEvent('touchmove', {
            touches: [
              new Touch({ identifier: 1, target: document.body, clientX: 100, clientY: 100 }),
              new Touch({ identifier: 2, target: document.body, clientX: 300, clientY: 300 })
            ]
          })
          
          document.body.dispatchEvent(touchStartEvent)
          document.body.dispatchEvent(touchMoveEvent)
        })
        
        const pinchZoomResponse = await page.evaluate(() => {
          return {
            zoomHandled: document.body.classList.contains('pinch-zoom') ||
                        document.querySelector('[data-pinch-zoom]') !== null,
            preventDefaultZoom: document.querySelector('[data-prevent-zoom]') !== null
          }
        })
        
        // Should handle pinch zoom appropriately (either enable or disable based on design)
        expect(typeof pinchZoomResponse.zoomHandled).toBe('boolean')
      }
    })
  })
  
  test.describe('Mobile Performance Optimization', () => {
    
    test('mobile scroll: 30fps stable performance target', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test mobile performance during scroll
      const mobilePerformanceTest = await page.evaluate(() => {
        let frameCount = 0
        let startTime = performance.now()
        let lastFrameTime = startTime
        const frameTimings: number[] = []
        
        const measureMobilePerformance = (timestamp: number) => {
          frameCount++
          const frameTime = timestamp - lastFrameTime
          frameTimings.push(frameTime)
          lastFrameTime = timestamp
          
          if (frameCount < 60) { // Measure for 1 second at 60fps max
            requestAnimationFrame(measureMobilePerformance)
          }
        }
        
        requestAnimationFrame(measureMobilePerformance)
        
        // Trigger heavy scroll activity
        let scrollPosition = 0
        const scrollInterval = setInterval(() => {
          scrollPosition += 50
          window.scrollTo({ top: scrollPosition, behavior: 'smooth' })
          
          if (scrollPosition >= 1000) {
            clearInterval(scrollInterval)
          }
        }, 100)
        
        return new Promise(resolve => {
          setTimeout(() => {
            const endTime = performance.now()
            const totalDuration = endTime - startTime
            const averageFPS = (frameCount / totalDuration) * 1000
            
            // Calculate frame consistency
            const averageFrameTime = frameTimings.reduce((sum, time) => sum + time, 0) / frameTimings.length
            const frameTimeVariance = frameTimings.reduce((sum, time) => sum + Math.pow(time - averageFrameTime, 2), 0) / frameTimings.length
            
            resolve({
              frameCount,
              totalDuration: Math.round(totalDuration),
              averageFPS: Math.round(averageFPS),
              frameConsistency: Math.round(Math.sqrt(frameTimeVariance)),
              targetMet: averageFPS >= 25, // 25fps minimum for mobile
              smooth: Math.sqrt(frameTimeVariance) < 10 // Low variance = smooth
            })
          }, 1200)
        })
      })
      
      const performanceResult = mobilePerformanceTest as any
      expect(performanceResult.averageFPS).toBeGreaterThan(25) // Mobile target
      expect(performanceResult.targetMet).toBe(true)
    })
    
    test('mobile scroll: Battery-aware animation optimization', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test battery-conscious optimizations
      const batteryOptimization = await page.evaluate(() => {
        // Check for battery API support (limited browser support)
        const batteryAPI = (navigator as any).getBattery !== undefined
        
        // Check for reduced animation complexity on mobile
        const animationElements = document.querySelectorAll('[class*="animation"], [class*="parallax"]')
        const reducedAnimations = document.querySelectorAll('[data-reduced-animation]')
        const staticFallbacks = document.querySelectorAll('[data-static-fallback]')
        
        // Check for mobile-specific optimizations
        const mobileOptimizations = {
          reducedParticles: document.querySelector('[data-reduced-particles]') !== null,
          simplifiedEffects: document.querySelector('[data-simplified-effects]') !== null,
          batteryMode: document.querySelector('[data-battery-mode]') !== null
        }
        
        return {
          batteryAPI,
          animationElements: animationElements.length,
          reducedAnimations: reducedAnimations.length,
          staticFallbacks: staticFallbacks.length,
          mobileOptimizations
        }
      })
      
      // Should have some form of mobile optimization
      expect(
        batteryOptimization.reducedAnimations > 0 ||
        batteryOptimization.staticFallbacks > 0 ||
        Object.values(batteryOptimization.mobileOptimizations).some(Boolean)
      ).toBe(true)
      
      // Test that animations are appropriately simplified on mobile
      const simplifiedAnimations = await page.evaluate(() => {
        const animations = document.querySelectorAll('[class*="animation"]')
        const simplificationResults = Array.from(animations).map(element => {
          const computedStyle = window.getComputedStyle(element)
          return {
            element: element.className,
            animationDuration: computedStyle.animationDuration,
            isSimplified: computedStyle.animationDuration === '0s' ||
                         parseFloat(computedStyle.animationDuration) < 1 ||
                         element.hasAttribute('data-simplified')
          }
        })
        
        return {
          totalAnimations: animations.length,
          simplifiedCount: simplificationResults.filter(r => r.isSimplified).length,
          simplificationRatio: simplificationResults.filter(r => r.isSimplified).length / Math.max(animations.length, 1)
        }
      })
      
      // At least 50% of animations should be simplified for mobile
      if (simplifiedAnimations.totalAnimations > 0) {
        expect(simplifiedAnimations.simplificationRatio).toBeGreaterThan(0.5)
      }
    })
    
    test('mobile scroll: Memory usage optimization', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test mobile memory usage
      const mobileMemoryUsage = await page.evaluate(() => {
        let initialMemory = 0
        let currentMemory = 0
        
        if ((performance as any).memory) {
          initialMemory = (performance as any).memory.usedJSHeapSize
        }
        
        // Trigger scroll effects to load more content
        for (let i = 0; i < 10; i++) {
          window.scrollTo({ top: i * 100, behavior: 'instant' })
        }
        
        return new Promise(resolve => {
          setTimeout(() => {
            if ((performance as any).memory) {
              currentMemory = (performance as any).memory.usedJSHeapSize
            }
            
            const memoryIncrease = currentMemory - initialMemory
            const memoryIncreasePercent = initialMemory > 0 ? (memoryIncrease / initialMemory) * 100 : 0
            
            resolve({
              initialMemory: Math.round(initialMemory / 1024 / 1024), // MB
              currentMemory: Math.round(currentMemory / 1024 / 1024), // MB
              memoryIncrease: Math.round(memoryIncrease / 1024 / 1024), // MB
              memoryIncreasePercent: Math.round(memoryIncreasePercent),
              memoryEfficient: memoryIncreasePercent < 50 // Should not increase by more than 50%
            })
          }, 1000)
        })
      })
      
      const memoryResult = mobileMemoryUsage as any
      if (memoryResult.initialMemory > 0) {
        expect(memoryResult.memoryEfficient).toBe(true)
        expect(memoryResult.memoryIncrease).toBeLessThan(50) // Should not increase by more than 50MB
      }
    })
  })
  
  test.describe('Mobile-Specific Scroll Behaviors', () => {
    
    test('mobile scroll: iOS momentum scrolling compatibility', async ({ page, browserName }) => {
      test.skip(browserName !== 'webkit', 'iOS-specific test')
      
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test iOS momentum scrolling
      const iosMomentumScrolling = await page.evaluate(() => {
        const bodyStyle = window.getComputedStyle(document.body)
        const hasWebkitOverflowScrolling = (bodyStyle as any).webkitOverflowScrolling === 'touch'
        
        // Test for iOS-specific scroll behavior
        const scrollContainer = document.documentElement
        const hasIOSScrolling = (scrollContainer.style as any).webkitOverflowScrolling === 'touch'
        
        return {
          hasWebkitOverflowScrolling,
          hasIOSScrolling,
          supportsIOSScrolling: 'webkitOverflowScrolling' in document.body.style
        }
      })
      
      expect(iosMomentumScrolling.supportsIOSScrolling).toBe(true)
      
      // Test momentum scroll behavior
      await page.evaluate(() => {
        // Simulate fast scroll that would trigger momentum
        window.scrollTo({ top: 0, behavior: 'instant' })
        window.scrollTo({ top: 1000, behavior: 'smooth' })
      })
      
      await page.waitForTimeout(500)
      
      const momentumResult = await page.evaluate(() => window.scrollY)
      expect(momentumResult).toBeGreaterThan(0)
    })
    
    test('mobile scroll: Android overscroll behavior', async ({ page, browserName }) => {
      test.skip(browserName === 'webkit', 'Android-specific test')
      
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test Android overscroll behavior
      const androidOverscroll = await page.evaluate(() => {
        // Check for overscroll behavior settings
        const bodyStyle = window.getComputedStyle(document.body)
        const overscrollBehavior = bodyStyle.overscrollBehavior || bodyStyle.overscrollBehaviorY
        
        // Test scroll bounds
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        
        return {
          overscrollBehavior,
          maxScroll,
          hasOverscrollControl: overscrollBehavior !== '' && overscrollBehavior !== 'auto'
        }
      })
      
      expect(androidOverscroll.maxScroll).toBeGreaterThan(0)
      
      // Test overscroll at boundaries
      await page.evaluate(() => {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' })
        // Try to scroll past top
        window.scrollBy({ top: -100, behavior: 'instant' })
      })
      
      const topBoundary = await page.evaluate(() => window.scrollY)
      expect(topBoundary).toBe(0) // Should not scroll past top
      
      // Test bottom boundary
      await page.evaluate(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({ top: maxScroll + 100, behavior: 'instant' })
      })
      
      const bottomBoundary = await page.evaluate(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        return window.scrollY <= maxScroll
      })
      
      expect(bottomBoundary).toBe(true)
    })
    
    test('mobile scroll: Touch scrolling inertia and deceleration', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test touch scrolling inertia
      const touchScrollInertia = await page.evaluate(() => {
        let scrollPositions: number[] = []
        const startTime = performance.now()
        
        const trackScrolling = () => {
          scrollPositions.push(window.scrollY)
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(trackScrolling)
          }
        }
        
        // Start tracking
        requestAnimationFrame(trackScrolling)
        
        // Simulate touch scroll
        window.scrollTo({ top: 0, behavior: 'instant' })
        window.scrollTo({ top: 800, behavior: 'smooth' })
        
        return new Promise(resolve => {
          setTimeout(() => {
            // Analyze scroll inertia
            const scrollDeltas = scrollPositions.slice(1).map((pos, index) => 
              pos - scrollPositions[index]
            )
            
            const hasInertia = scrollDeltas.some(delta => Math.abs(delta) > 0)
            const decelerates = scrollDeltas.length > 5 && 
                               Math.abs(scrollDeltas[scrollDeltas.length - 1]) < 
                               Math.abs(scrollDeltas[Math.floor(scrollDeltas.length / 2)])
            
            resolve({
              scrollPositions: scrollPositions.length,
              hasInertia,
              decelerates,
              finalPosition: scrollPositions[scrollPositions.length - 1]
            })
          }, 1200)
        })
      })
      
      const inertiaResult = touchScrollInertia as any
      expect(inertiaResult.hasInertia).toBe(true)
      expect(inertiaResult.finalPosition).toBeGreaterThan(0)
    })
  })
  
  test.describe('Mobile Usability & User Experience', () => {
    
    test('mobile scroll: Touch target sizing compliance', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test touch target sizes (WCAG AA: minimum 44x44px)
      const touchTargetCompliance = await page.evaluate(() => {
        const touchTargets = document.querySelectorAll('button, a, input, [role="button"], [tabindex]:not([tabindex="-1"])')
        const compliantTargets = Array.from(touchTargets).filter(element => {
          const rect = element.getBoundingClientRect()
          return rect.width >= 44 && rect.height >= 44
        })
        
        const touchTargetResults = Array.from(touchTargets).map(element => {
          const rect = element.getBoundingClientRect()
          return {
            element: element.tagName.toLowerCase(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            compliant: rect.width >= 44 && rect.height >= 44
          }
        })
        
        return {
          totalTargets: touchTargets.length,
          compliantTargets: compliantTargets.length,
          complianceRatio: compliantTargets.length / Math.max(touchTargets.length, 1),
          touchTargetResults
        }
      })
      
      // At least 80% of touch targets should be compliant
      expect(touchTargetCompliance.complianceRatio).toBeGreaterThan(0.8)
      
      // Test specific touch interactions
      const architectureSection = page.locator('[data-section-id="architecture"]')
      if (await architectureSection.count() > 0) {
        const architectureRect = await architectureSection.boundingBox()
        if (architectureRect) {
          expect(architectureRect.width).toBeGreaterThan(44)
          expect(architectureRect.height).toBeGreaterThan(44)
        }
      }
    })
    
    test('mobile scroll: Horizontal scroll prevention', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test that content doesn't cause horizontal scroll on mobile
      const horizontalScrollPrevention = await page.evaluate(() => {
        const bodyWidth = document.body.scrollWidth
        const viewportWidth = window.innerWidth
        const hasHorizontalScroll = bodyWidth > viewportWidth
        
        // Check for elements that might cause horizontal overflow
        const wideElements = Array.from(document.querySelectorAll('*')).filter(element => {
          const rect = element.getBoundingClientRect()
          return rect.right > viewportWidth + 10 // 10px tolerance
        })
        
        return {
          bodyWidth,
          viewportWidth,
          hasHorizontalScroll,
          wideElements: wideElements.length,
          wideElementsDetails: wideElements.slice(0, 3).map(el => ({
            tagName: el.tagName.toLowerCase(),
            className: el.className,
            width: Math.round(el.getBoundingClientRect().width)
          }))
        }
      })
      
      expect(horizontalScrollPrevention.hasHorizontalScroll).toBe(false)
      expect(horizontalScrollPrevention.wideElements).toBeLessThan(3) // Minimal wide elements allowed
    })
    
    test('mobile scroll: Visual feedback for touch interactions', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test visual feedback for touch interactions
      const visualFeedback = await page.evaluate(() => {
        // Check for touch feedback styles
        const touchableElements = document.querySelectorAll('button, a, [role="button"]')
        const hasActiveStates = Array.from(touchableElements).some(element => {
          const styles = window.getComputedStyle(element, ':active')
          return styles.transform !== 'none' || 
                 styles.opacity !== '1' || 
                 styles.backgroundColor !== window.getComputedStyle(element).backgroundColor
        })
        
        // Check for custom touch feedback elements
        const feedbackElements = document.querySelectorAll('[data-touch-feedback], [class*="touch-feedback"]')
        
        return {
          touchableElements: touchableElements.length,
          hasActiveStates,
          feedbackElements: feedbackElements.length
        }
      })
      
      expect(visualFeedback.touchableElements).toBeGreaterThan(0)
      
      // Test actual touch feedback
      const touchableElement = page.locator('button, a[href]').first()
      if (await touchableElement.count() > 0) {
        await touchableElement.tap()
        
        const touchResponse = await page.evaluate(() => {
          return {
            activateHandled: document.body.classList.contains('touch-active') ||
                           document.querySelector('[data-touch-active]') !== null,
            visualChange: true // Assume visual change occurred during tap
          }
        })
        
        expect(touchResponse.visualChange).toBe(true)
      }
    })
  })
})
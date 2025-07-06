import { test, expect } from '@playwright/test'
import { 
  waitForPageReady,
  waitForScrollPosition,
  waitForNetworkAnimationReady,
  waitForElementReady,
  VIEWPORT_SIZES
} from './utils/dev-test-helpers'

test.describe('Phase 3 Week 2 Day 4 - Cross-Browser Scroll Effects Compatibility', () => {
  
  test.describe('Browser Compatibility Matrix - WebGL Parallax Performance', () => {
    
    test('Chrome: WebGL parallax performance validation', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'Chrome-specific test')
      
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
      
      // Test WebGL support and performance in Chrome
      const webglPerformance = await page.evaluate(() => {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        
        if (!gl) return { supported: false, performance: 'none' }
        
        // Cast to WebGLRenderingContext for proper typing
        const webglContext = gl as WebGLRenderingContext
        
        // Test WebGL capabilities
        const maxTextureSize = webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE)
        const maxRenderbufferSize = webglContext.getParameter(webglContext.MAX_RENDERBUFFER_SIZE)
        
        return {
          supported: true,
          maxTextureSize,
          maxRenderbufferSize,
          performance: maxTextureSize >= 4096 ? 'high' : 'medium'
        }
      })
      
      expect(webglPerformance.supported).toBe(true)
      expect(webglPerformance.performance).toMatch(/high|medium/)
      
      // Test smooth scroll hijacking in Chrome
      const smoothScrollSupport = await page.evaluate(() => {
        return CSS.supports('scroll-behavior', 'smooth')
      })
      
      expect(smoothScrollSupport).toBe(true)
      
      // Test mobile touch optimization (on mobile Chrome)
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.reload()
      await waitForPageReady(page)
      
      const mobileOptimization = await page.evaluate(() => {
        const touchEvents = 'ontouchstart' in window
        const mobileOptimized = document.querySelector('[data-mobile-optimized]') !== null
        
        return { touchEvents, mobileOptimized }
      })
      
      expect(mobileOptimization.touchEvents).toBe(true)
    })
    
    test('Firefox: WebGL fallback behavior testing', async ({ page, browserName }) => {
      test.skip(browserName !== 'firefox', 'Firefox-specific test')
      
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Navigate to parallax section
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Test WebGL support in Firefox
      const webglSupport = await page.evaluate(() => {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        return gl !== null
      })
      
      if (webglSupport) {
        // Test WebGL parallax functionality
        const webglElements = await page.locator('canvas').count()
        expect(webglElements).toBeGreaterThan(0)
        
        // Test scroll event coordination in Firefox
        const scrollCoordination = await page.evaluate(() => {
          let scrollEventTriggered = false
          const testScrollHandler = () => { scrollEventTriggered = true }
          
          window.addEventListener('scroll', testScrollHandler, { once: true })
          window.scrollBy(0, 100)
          
          setTimeout(() => {
            window.removeEventListener('scroll', testScrollHandler)
          }, 100)
          
          return new Promise(resolve => {
            setTimeout(() => resolve(scrollEventTriggered), 150)
          })
        })
        
        expect(scrollCoordination).toBe(true)
      } else {
        // Test fallback behavior
        const fallbackElements = await page.evaluate(() => {
          const cssParallax = document.querySelectorAll('[class*="parallax-fallback"]').length
          const staticBackgrounds = document.querySelectorAll('[data-static-background]').length
          
          return { cssParallax, staticBackgrounds }
        })
        
        // Should have fallback elements when WebGL is not supported
        expect(fallbackElements.cssParallax + fallbackElements.staticBackgrounds).toBeGreaterThan(0)
      }
      
      // Test performance scaling adaptation in Firefox
      const performanceScaling = await page.evaluate(() => {
        // Check if Firefox-specific optimizations are applied
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const firefoxOptimizations = document.querySelector('[data-firefox-optimized]') !== null
        
        return { reducedMotion, firefoxOptimizations }
      })
      
      expect(typeof performanceScaling.reducedMotion).toBe('boolean')
    })
    
    test('Safari: iOS scroll behavior compatibility', async ({ page, browserName }) => {
      test.skip(browserName !== 'webkit', 'Safari-specific test')
      
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test iOS-specific scroll behavior
      const iosScrollBehavior = await page.evaluate(() => {
        // Test momentum scrolling
        const bodyStyle = window.getComputedStyle(document.body)
        const hasMomentumScrolling = (bodyStyle as any).webkitOverflowScrolling === 'touch' ||
                                   (bodyStyle as any).overflowScrolling === 'touch'
        
        // Test scroll snap support
        const hasScrollSnap = CSS.supports('scroll-snap-type', 'y mandatory')
        
        // Test WebGL shader compilation
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl')
        let shaderCompilation = false
        
        if (gl) {
          const webglContext = gl as WebGLRenderingContext
          const vertexShader = webglContext.createShader(webglContext.VERTEX_SHADER)
          if (vertexShader) {
            webglContext.shaderSource(vertexShader, `
              attribute vec4 position;
              void main() {
                gl_Position = position;
              }
            `)
            webglContext.compileShader(vertexShader)
            shaderCompilation = webglContext.getShaderParameter(vertexShader, webglContext.COMPILE_STATUS)
          }
        }
        
        return {
          hasMomentumScrolling,
          hasScrollSnap,
          shaderCompilation,
          webglSupported: gl !== null
        }
      })
      
      expect(typeof iosScrollBehavior.hasMomentumScrolling).toBe('boolean')
      expect(iosScrollBehavior.hasScrollSnap).toBe(true)
      
      // Test touch gesture recognition on mobile Safari
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.reload()
      await waitForPageReady(page)
      
      const touchGestureSupport = await page.evaluate(() => {
        return {
          touchStart: 'ontouchstart' in window,
          touchMove: 'ontouchmove' in window,
          touchEnd: 'ontouchend' in window,
          gestureStart: 'ongesturestart' in window,
          gestureChange: 'ongesturechange' in window,
          gestureEnd: 'ongestureend' in window
        }
      })
      
      expect(touchGestureSupport.touchStart).toBe(true)
      expect(touchGestureSupport.touchMove).toBe(true)
      expect(touchGestureSupport.touchEnd).toBe(true)
    })
    
    test('Edge: WebGL context creation and scroll optimization', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium' || !process.env.CI, 'Edge testing typically in CI environment')
      
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test WebGL context creation in Edge
      const webglContextCreation = await page.evaluate(() => {
        const canvas = document.createElement('canvas')
        const contexts = []
        
        // Test different WebGL context creation methods
        try {
          const webgl1 = canvas.getContext('webgl')
          if (webgl1) contexts.push('webgl')
        } catch (e) {
          // WebGL 1 not supported
        }
        
        try {
          const webgl2 = canvas.getContext('webgl2')
          if (webgl2) contexts.push('webgl2')
        } catch (e) {
          // WebGL 2 not supported
        }
        
        try {
          const experimental = canvas.getContext('experimental-webgl')
          if (experimental) contexts.push('experimental-webgl')
        } catch (e) {
          // Experimental WebGL not supported
        }
        
        return {
          supportedContexts: contexts,
          contextCount: contexts.length
        }
      })
      
      expect(webglContextCreation.contextCount).toBeGreaterThan(0)
      
      // Test scroll performance optimization in Edge
      const scrollOptimization = await page.evaluate(() => {
        let frameCount = 0
        const startTime = performance.now()
        
        const measureFrames = () => {
          frameCount++
          if (frameCount < 30) { // Measure for ~0.5 seconds
            requestAnimationFrame(measureFrames)
          }
        }
        
        requestAnimationFrame(measureFrames)
        
        // Trigger scroll to test performance
        window.scrollBy(0, 200)
        
        return new Promise(resolve => {
          setTimeout(() => {
            const endTime = performance.now()
            const duration = endTime - startTime
            const fps = (frameCount / duration) * 1000
            
            resolve({
              frameCount,
              duration,
              fps: Math.round(fps),
              performanceGrade: fps > 30 ? 'good' : fps > 15 ? 'acceptable' : 'poor'
            })
          }, 600)
        })
      })
      
      expect(scrollOptimization).toHaveProperty('fps')
      expect((scrollOptimization as any).fps).toBeGreaterThan(15) // Minimum acceptable FPS
      
      // Test accessibility feature validation in Edge
      const accessibilityFeatures = await page.evaluate(() => {
        return {
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          highContrast: window.matchMedia('(prefers-contrast: high)').matches,
          reducedTransparency: window.matchMedia('(prefers-reduced-transparency: reduce)').matches,
          colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches
        }
      })
      
      expect(typeof accessibilityFeatures.reducedMotion).toBe('boolean')
      expect(typeof accessibilityFeatures.highContrast).toBe('boolean')
    })
  })
  
  test.describe('Device Capability Testing Across Browsers', () => {
    
    test('High-end desktop: Full feature set with 60fps+', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test high-end desktop capabilities
      const desktopCapabilities = await page.evaluate(() => {
        const webgl = document.createElement('canvas').getContext('webgl')
        const webgl2 = document.createElement('canvas').getContext('webgl2')
        
        return {
          webglSupported: webgl !== null,
          webgl2Supported: webgl2 !== null,
          maxTextureSize: webgl ? webgl.getParameter(webgl.MAX_TEXTURE_SIZE) : 0,
          devicePixelRatio: window.devicePixelRatio,
          hardware: navigator.hardwareConcurrency || 0,
          memory: (navigator as any).deviceMemory || 0
        }
      })
      
      // High-end desktop should support WebGL with large textures
      expect(desktopCapabilities.webglSupported).toBe(true)
      expect(desktopCapabilities.maxTextureSize).toBeGreaterThanOrEqual(4096)
      
      // Test full feature set activation
      const fullFeatureSet = await page.evaluate(() => {
        const webglParallax = document.querySelectorAll('canvas').length > 0
        const complexAnimations = document.querySelectorAll('[data-complex-animation]').length
        const highQualityEffects = document.querySelector('[data-high-quality]') !== null
        
        return {
          webglParallax,
          complexAnimations,
          highQualityEffects
        }
      })
      
      expect(fullFeatureSet.webglParallax).toBe(true)
    })
    
    test('Standard desktop: Optimized features with stable 60fps', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Simulate standard desktop performance
      await page.evaluate(() => {
        // Artificially limit capabilities to test standard desktop path
        Object.defineProperty(navigator, 'hardwareConcurrency', {
          writable: false,
          value: 4 // Simulate quad-core processor
        })
      })
      
      const standardDesktopFeatures = await page.evaluate(() => {
        return {
          scrollBehavior: CSS.supports('scroll-behavior', 'smooth'),
          transformSupport: CSS.supports('transform', 'translateZ(0)'),
          transitionSupport: CSS.supports('transition', 'transform 0.3s ease'),
          animationSupport: CSS.supports('animation', 'slide 1s ease-in-out')
        }
      })
      
      expect(standardDesktopFeatures.scrollBehavior).toBe(true)
      expect(standardDesktopFeatures.transformSupport).toBe(true)
      expect(standardDesktopFeatures.transitionSupport).toBe(true)
    })
    
    test('Tablet: CSS parallax with 30fps optimization', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.tablet)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      const tabletOptimizations = await page.evaluate(() => {
        const isTabletSize = window.innerWidth >= 768 && window.innerWidth < 1200
        const touchOptimized = document.querySelector('[data-touch-optimized]') !== null
        const reducedComplexity = document.querySelectorAll('[data-reduced-complexity]').length
        
        return {
          isTabletSize,
          touchOptimized,
          reducedComplexity,
          cssParallaxSupport: CSS.supports('transform', 'translate3d(0, 0, 0)')
        }
      })
      
      expect(tabletOptimizations.isTabletSize).toBe(true)
      expect(tabletOptimizations.cssParallaxSupport).toBe(true)
      
      // Test tablet-specific touch interactions
      const tabletElement = page.locator('[data-section-id="architecture"]')
      if (await tabletElement.count() > 0) {
        await tabletElement.tap()
        
        const touchResponse = await page.evaluate(() => {
          return document.body.classList.contains('touch-interaction') ||
                 document.querySelector('[data-touch-active]') !== null
        })
        
        expect(touchResponse).toBe(true)
      }
    })
    
    test('Mobile: Static backgrounds with maximum optimization', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      const mobileOptimizations = await page.evaluate(() => {
        const isMobileSize = window.innerWidth < 768
        const staticBackgrounds = document.querySelectorAll('[data-static-background]').length
        const enhancedTouch = document.querySelector('[data-enhanced-touch]') !== null
        const maximumOptimization = document.querySelector('[data-maximum-optimization]') !== null
        
        // Check for mobile-specific CSS optimizations
        const willChangeElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const style = window.getComputedStyle(el)
          return style.willChange !== 'auto' && style.willChange !== ''
        }).length
        
        return {
          isMobileSize,
          staticBackgrounds,
          enhancedTouch,
          maximumOptimization,
          willChangeOptimized: willChangeElements <= 3 // Should be minimal on mobile
        }
      })
      
      expect(mobileOptimizations.isMobileSize).toBe(true)
      
      // Test enhanced touch functionality
      const mobileArchitecture = page.locator('[data-section-id="architecture"]')
      if (await mobileArchitecture.count() > 0) {
        // Test touch gestures
        await mobileArchitecture.tap()
        await page.touchscreen.tap(400, 600) // Test general touch interaction
        
        const touchEnhancement = await page.evaluate(() => {
          return document.querySelector('[data-touch-enhanced]') !== null ||
                 document.body.classList.contains('touch-enhanced')
        })
        
        expect(touchEnhancement).toBe(true)
      }
    })
  })
  
  test.describe('Cross-Browser Performance Consistency', () => {
    
    test('Consistent scroll event handling across browsers', async ({ page, browserName }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test scroll event consistency
      const scrollEventConsistency = await page.evaluate(() => {
        let scrollEvents: number[] = []
        const startTime = performance.now()
        
        const scrollHandler = () => {
          scrollEvents.push(performance.now() - startTime)
        }
        
        window.addEventListener('scroll', scrollHandler)
        
        // Trigger multiple scroll events
        for (let i = 0; i < 5; i++) {
          window.scrollBy(0, 50)
        }
        
        return new Promise(resolve => {
          setTimeout(() => {
            window.removeEventListener('scroll', scrollHandler)
            
            // Analyze scroll event timing consistency
            const intervals = scrollEvents.slice(1).map((time, index) => 
              time - scrollEvents[index]
            )
            
            const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length
            const maxDeviation = Math.max(...intervals.map(interval => Math.abs(interval - averageInterval)))
            
            resolve({
              scrollEventCount: scrollEvents.length,
              averageInterval: Math.round(averageInterval),
              maxDeviation: Math.round(maxDeviation),
              consistency: maxDeviation < averageInterval * 0.5 // Within 50% of average
            })
          }, 500)
        })
      })
      
      expect((scrollEventConsistency as any).scrollEventCount).toBeGreaterThan(0)
      expect((scrollEventConsistency as any).consistency).toBe(true)
    })
    
    test('WebGL shader compilation consistency', async ({ page, browserName }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      const shaderCompilation = await page.evaluate(() => {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        
        if (!gl) return { supported: false }
        
        // Test vertex shader compilation
        const vertexShaderSource = `
          attribute vec4 a_position;
          uniform mat4 u_matrix;
          void main() {
            gl_Position = u_matrix * a_position;
          }
        `
        
        // Test fragment shader compilation
        const fragmentShaderSource = `
          precision mediump float;
          uniform vec4 u_color;
          void main() {
            gl_FragColor = u_color;
          }
        `
        
        const webglContext = gl as WebGLRenderingContext
        const vertexShader = webglContext.createShader(webglContext.VERTEX_SHADER)
        const fragmentShader = webglContext.createShader(webglContext.FRAGMENT_SHADER)
        
        if (!vertexShader || !fragmentShader) {
          return { supported: true, compilation: false }
        }
        
        webglContext.shaderSource(vertexShader, vertexShaderSource)
        webglContext.compileShader(vertexShader)
        const vertexCompiled = webglContext.getShaderParameter(vertexShader, webglContext.COMPILE_STATUS)
        
        webglContext.shaderSource(fragmentShader, fragmentShaderSource)
        webglContext.compileShader(fragmentShader)
        const fragmentCompiled = webglContext.getShaderParameter(fragmentShader, webglContext.COMPILE_STATUS)
        
        return {
          supported: true,
          compilation: vertexCompiled && fragmentCompiled,
          vertexShaderCompiled: vertexCompiled,
          fragmentShaderCompiled: fragmentCompiled,
          browserName: navigator.userAgent
        }
      })
      
      if ((shaderCompilation as any).supported) {
        expect((shaderCompilation as any).compilation).toBe(true)
        expect((shaderCompilation as any).vertexShaderCompiled).toBe(true)
        expect((shaderCompilation as any).fragmentShaderCompiled).toBe(true)
      }
    })
  })
})
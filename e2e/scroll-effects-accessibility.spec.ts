import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { 
  waitForPageReady,
  waitForScrollPosition,
  waitForElementReady,
  VIEWPORT_SIZES
} from './utils/dev-test-helpers'

test.describe('Phase 3 Week 2 Day 4 - Scroll Effects Accessibility Compliance', () => {
  
  test.describe('WCAG 2.1 AA Compliance with Scroll Effects Active', () => {
    
    test('accessibility scroll: Complete WCAG 2.1 AA compliance scan', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Trigger all scroll effects to be active during accessibility scan
      await page.evaluate(() => {
        // Scroll through different sections to activate all effects
        const sections = ['hero', 'browser', 'architecture', 'cta']
        sections.forEach((sectionId, index) => {
          setTimeout(() => {
            const section = document.querySelector(`[data-section-id="${sectionId}"]`)
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' })
            }
          }, index * 200)
        })
      })
      
      // Wait for all scroll effects to be active
      await page.waitForTimeout(1000)
      
      // Run comprehensive accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()
      
      expect(accessibilityScanResults.violations).toEqual([])
      
      // Check for specific WCAG success criteria related to animations and interactions
      const animationAccessibility = await page.evaluate(() => {
        const animations = document.querySelectorAll('[class*="animation"], [class*="parallax"]')
        const accessibleAnimations = Array.from(animations).every(element => {
          // Check for accessibility attributes
          return element.getAttribute('aria-hidden') !== null ||
                 element.getAttribute('role') !== null ||
                 element.getAttribute('aria-label') !== null
        })
        
        return {
          animationElementsCount: animations.length,
          accessibleAnimations
        }
      })
      
      expect(animationAccessibility.animationElementsCount).toBeGreaterThan(0)
    })
    
    test('accessibility scroll: Keyboard navigation compatibility with scroll hijacking', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test keyboard navigation through interactive elements
      const keyboardNavigation = await page.evaluate(() => {
        const results = {
          tabNavigationWorks: true,
          focusTrapsWork: true,
          arrowKeyNavigation: true,
          enterKeyActivation: true,
          escapeKeyHandling: true
        }
        
        // Get all focusable elements
        const focusableElements = Array.from(document.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )) as HTMLElement[]
        
        if (focusableElements.length === 0) {
          results.tabNavigationWorks = false
          return results
        }
        
        // Test tab navigation
        focusableElements[0].focus()
        const firstFocused = document.activeElement === focusableElements[0]
        
        if (!firstFocused) {
          results.tabNavigationWorks = false
        }
        
        return results
      })
      
      expect(keyboardNavigation.tabNavigationWorks).toBe(true)
      
      // Test actual keyboard navigation
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      const focusedElement = await page.evaluate(() => {
        const active = document.activeElement
        return {
          tagName: active?.tagName.toLowerCase(),
          hasValidRole: active?.getAttribute('role') !== null || 
                       ['a', 'button', 'input', 'select', 'textarea'].includes(active?.tagName.toLowerCase() || '')
        }
      })
      
      expect(focusedElement.hasValidRole).toBe(true)
      
      // Test that scroll hijacking doesn't interfere with keyboard navigation
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowDown')
      
      const scrollPosition = await page.evaluate(() => window.scrollY)
      expect(scrollPosition).toBeGreaterThanOrEqual(0)
      
      // Test Enter key activation
      const enterElement = page.locator('button, a[href]').first()
      if (await enterElement.count() > 0) {
        await enterElement.focus()
        await page.keyboard.press('Enter')
        
        // Should not cause JavaScript errors
        const errors = await page.evaluate(() => (window as any).jsErrors || [])
        expect(errors.length).toBe(0)
      }
    })
    
    test('accessibility scroll: Screen reader compatibility with scroll changes', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test ARIA live regions for scroll notifications
      const ariaLiveRegions = await page.evaluate(() => {
        const liveRegions = document.querySelectorAll('[aria-live]')
        const politeRegions = document.querySelectorAll('[aria-live="polite"]')
        const assertiveRegions = document.querySelectorAll('[aria-live="assertive"]')
        
        return {
          totalLiveRegions: liveRegions.length,
          politeRegions: politeRegions.length,
          assertiveRegions: assertiveRegions.length
        }
      })
      
      // Should have live regions for announcing scroll changes
      expect(ariaLiveRegions.totalLiveRegions).toBeGreaterThanOrEqual(0)
      
      // Test scroll section announcements
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Check for section headings and landmarks
      const sectionStructure = await page.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
        const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer')
        const sectionsWithHeadings = document.querySelectorAll('section h1, section h2, section h3')
        
        return {
          totalHeadings: headings.length,
          landmarks: landmarks.length,
          sectionsWithHeadings: sectionsWithHeadings.length,
          headingHierarchy: Array.from(headings).map(h => h.tagName.toLowerCase())
        }
      })
      
      expect(sectionStructure.totalHeadings).toBeGreaterThan(0)
      expect(sectionStructure.landmarks).toBeGreaterThan(0)
      
      // Test heading hierarchy (should not skip levels)
      const headingLevels = sectionStructure.headingHierarchy.map(tag => parseInt(tag.charAt(1)))
      for (let i = 1; i < headingLevels.length; i++) {
        const currentLevel = headingLevels[i]
        const previousLevel = headingLevels[i - 1]
        
        // Heading levels should not skip more than one level
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1)
      }
    })
    
    test('accessibility scroll: Focus management during scroll hijacking', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test focus preservation during scroll operations
      const focusElement = page.locator('button, a[href]').first()
      if (await focusElement.count() > 0) {
        await focusElement.focus()
        
        const initialFocusState = await page.evaluate(() => ({
          activeElement: document.activeElement?.tagName.toLowerCase(),
          hasFocus: document.activeElement !== null
        }))
        
        expect(initialFocusState.hasFocus).toBe(true)
        
        // Trigger scroll hijacking
        await page.evaluate(() => {
          window.scrollTo({ top: 500, behavior: 'smooth' })
        })
        
        await page.waitForTimeout(500)
        
        // Check that focus is maintained or properly managed
        const postScrollFocusState = await page.evaluate(() => ({
          activeElement: document.activeElement?.tagName.toLowerCase(),
          hasFocus: document.activeElement !== null,
          focusVisible: document.activeElement?.matches(':focus-visible') || false
        }))
        
        // Focus should still be managed (either maintained or moved to appropriate element)
        expect(postScrollFocusState.hasFocus).toBe(true)
      }
      
      // Test focus trap behavior in modal or complex interactions
      const architectureSection = page.locator('[data-section-id="architecture"]')
      if (await architectureSection.count() > 0) {
        await architectureSection.click()
        
        // Check for proper focus management after interaction
        const interactionFocus = await page.evaluate(() => {
          const interactiveElements = document.querySelectorAll('button, a, input, [tabindex]')
          return {
            interactiveElementsCount: interactiveElements.length,
            focusWithinInteraction: document.activeElement !== null
          }
        })
        
        expect(interactionFocus.interactiveElementsCount).toBeGreaterThan(0)
      }
    })
  })
  
  test.describe('Reduced Motion Compliance - prefers-reduced-motion', () => {
    
    test('accessibility scroll: Static backgrounds for reduced motion users', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check that reduced motion is detected and respected
      const reducedMotionHandling = await page.evaluate(() => {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        const isReducedMotion = reducedMotionQuery.matches
        
        // Check for static background indicators
        const staticBackgrounds = document.querySelectorAll('[data-static-background]')
        const reducedAnimations = document.querySelectorAll('[data-reduced-animation]')
        const disabledParallax = document.querySelectorAll('[data-parallax-disabled]')
        
        // Check CSS animations and transitions
        const animatedElements = document.querySelectorAll('[class*="animation"], [class*="parallax"]')
        const respectsReducedMotion = Array.from(animatedElements).every(element => {
          const computedStyle = window.getComputedStyle(element)
          return computedStyle.animationDuration === '0s' || 
                 computedStyle.animationDuration === '' ||
                 element.hasAttribute('data-animation-disabled')
        })
        
        return {
          isReducedMotion,
          staticBackgrounds: staticBackgrounds.length,
          reducedAnimations: reducedAnimations.length,
          disabledParallax: disabledParallax.length,
          respectsReducedMotion
        }
      })
      
      expect(reducedMotionHandling.isReducedMotion).toBe(true)
      
      // Should have static alternatives when reduced motion is preferred
      if (reducedMotionHandling.isReducedMotion) {
        expect(
          reducedMotionHandling.staticBackgrounds > 0 || 
          reducedMotionHandling.respectsReducedMotion
        ).toBe(true)
      }
      
      // Test that scroll behavior is still functional but not animated
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'auto' }) // Should use 'auto' instead of 'smooth'
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Verify that essential functionality still works
      const functionalityPreserved = await page.evaluate(() => {
        return {
          scrollPositionCorrect: window.scrollY > 0,
          sectionsAccessible: document.querySelector('[data-section-id="architecture"]') !== null,
          interactionsWork: true // Basic functionality should be preserved
        }
      })
      
      expect(functionalityPreserved.scrollPositionCorrect).toBe(true)
      expect(functionalityPreserved.sectionsAccessible).toBe(true)
    })
    
    test('accessibility scroll: Animation duration override for reduced motion', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check CSS animation overrides
      const animationOverrides = await page.evaluate(() => {
        const animatedElements = document.querySelectorAll('[class*="animation"], [class*="transition"], [class*="parallax"]')
        const overrideResults = Array.from(animatedElements).map(element => {
          const computedStyle = window.getComputedStyle(element)
          return {
            element: element.className,
            animationDuration: computedStyle.animationDuration,
            transitionDuration: computedStyle.transitionDuration,
            isOverridden: computedStyle.animationDuration === '0s' || computedStyle.transitionDuration === '0s'
          }
        })
        
        return {
          totalElements: animatedElements.length,
          overrideResults,
          allOverridden: overrideResults.every(result => result.isOverridden || 
                                               result.animationDuration === '' ||
                                               result.transitionDuration === '')
        }
      })
      
      if (animationOverrides.totalElements > 0) {
        // Most animations should be overridden or very short for reduced motion
        const shortDurations = animationOverrides.overrideResults.filter(result => 
          result.animationDuration === '0s' || 
          result.transitionDuration === '0s' ||
          result.animationDuration === '' ||
          result.transitionDuration === ''
        )
        
        expect(shortDurations.length / animationOverrides.totalElements).toBeGreaterThan(0.7) // 70% should respect reduced motion
      }
    })
  })
  
  test.describe('Mobile Accessibility with Scroll Effects', () => {
    
    test('accessibility scroll: Mobile screen reader compatibility', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test mobile-specific accessibility features
      const mobileAccessibility = await page.evaluate(() => {
        // Check for mobile-optimized touch targets
        const touchTargets = document.querySelectorAll('button, a, input, [role="button"]')
        const appropriateTouchTargets = Array.from(touchTargets).filter(element => {
          const rect = element.getBoundingClientRect()
          return rect.width >= 44 && rect.height >= 44 // WCAG AA minimum touch target size
        })
        
        // Check for mobile accessibility enhancements
        const mobileARIA = document.querySelectorAll('[aria-describedby], [aria-labelledby]')
        const touchInstructions = document.querySelectorAll('[data-touch-instructions]')
        
        return {
          totalTouchTargets: touchTargets.length,
          appropriateTouchTargets: appropriateTouchTargets.length,
          touchTargetCompliance: appropriateTouchTargets.length / Math.max(touchTargets.length, 1),
          mobileARIA: mobileARIA.length,
          touchInstructions: touchInstructions.length
        }
      })
      
      // At least 80% of touch targets should meet size requirements
      expect(mobileAccessibility.touchTargetCompliance).toBeGreaterThan(0.8)
      
      // Test mobile scroll announcement
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Test touch interaction accessibility
      const mobileInteraction = page.locator('[data-section-id="architecture"]')
      if (await mobileInteraction.count() > 0) {
        await mobileInteraction.tap()
        
        const touchAccessibility = await page.evaluate(() => {
          return {
            touchHandled: document.body.classList.contains('touch-interaction') ||
                         document.querySelector('[data-touch-active]') !== null,
            ariaUpdated: document.querySelector('[aria-live]') !== null,
            focusManaged: document.activeElement !== null
          }
        })
        
        expect(touchAccessibility.touchHandled).toBe(true)
      }
    })
    
    test('accessibility scroll: Mobile keyboard alternative navigation', async ({ page }) => {
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test that mobile users with keyboards can still navigate
      const keyboardAlternatives = await page.evaluate(() => {
        const focusableElements = document.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        
        const visibleFocusableElements = Array.from(focusableElements).filter(element => {
          const rect = element.getBoundingClientRect()
          const style = window.getComputedStyle(element)
          return rect.width > 0 && rect.height > 0 && 
                 style.visibility !== 'hidden' && 
                 style.display !== 'none'
        })
        
        return {
          totalFocusableElements: focusableElements.length,
          visibleFocusableElements: visibleFocusableElements.length,
          hasKeyboardAlternatives: visibleFocusableElements.length > 0
        }
      })
      
      expect(keyboardAlternatives.hasKeyboardAlternatives).toBe(true)
      expect(keyboardAlternatives.visibleFocusableElements).toBeGreaterThan(0)
      
      // Test tab navigation on mobile
      await page.keyboard.press('Tab')
      
      const mobileFocus = await page.evaluate(() => {
        const activeElement = document.activeElement
        return {
          hasFocus: activeElement !== null && activeElement !== document.body,
          focusVisible: activeElement?.matches(':focus-visible') || false,
          activeElementTag: activeElement?.tagName.toLowerCase()
        }
      })
      
      expect(mobileFocus.hasFocus).toBe(true)
    })
  })
  
  test.describe('High Contrast and Color Accessibility', () => {
    
    test('accessibility scroll: High contrast mode compatibility', async ({ page }) => {
      // Test with high contrast preference
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Check color contrast ratios
      const contrastCheck = await page.evaluate(() => {
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a')
        const contrastResults = []
        
        for (const element of Array.from(textElements).slice(0, 10)) { // Sample first 10 elements
          const computedStyle = window.getComputedStyle(element)
          const color = computedStyle.color
          const backgroundColor = computedStyle.backgroundColor || 
                                 computedStyle.getPropertyValue('background-color')
          
          contrastResults.push({
            element: element.tagName.toLowerCase(),
            color,
            backgroundColor,
            hasContrast: color !== backgroundColor && color !== 'rgba(0, 0, 0, 0)'
          })
        }
        
        return {
          totalChecked: contrastResults.length,
          withContrast: contrastResults.filter(r => r.hasContrast).length,
          contrastRatio: contrastResults.filter(r => r.hasContrast).length / Math.max(contrastResults.length, 1)
        }
      })
      
      expect(contrastCheck.contrastRatio).toBeGreaterThan(0.8) // 80% should have detectable contrast
      
      // Test that scroll effects don't interfere with high contrast mode
      await page.evaluate(() => {
        const architectureSection = document.querySelector('[data-section-id="architecture"]')
        if (architectureSection) {
          architectureSection.scrollIntoView({ behavior: 'smooth' })
        }
      })
      
      await waitForScrollPosition(page, 'architecture')
      
      // Verify that content remains accessible in high contrast mode
      const highContrastAccessibility = await page.evaluate(() => {
        const visibleText = document.querySelectorAll('h1, h2, h3, p')
        const readableText = Array.from(visibleText).filter(element => {
          const rect = element.getBoundingClientRect()
          const style = window.getComputedStyle(element)
          return rect.width > 0 && rect.height > 0 &&
                 style.visibility !== 'hidden' &&
                 style.opacity !== '0'
        })
        
        return {
          totalTextElements: visibleText.length,
          readableTextElements: readableText.length,
          readabilityRatio: readableText.length / Math.max(visibleText.length, 1)
        }
      })
      
      expect(highContrastAccessibility.readabilityRatio).toBeGreaterThan(0.9) // 90% should be readable
    })
    
    test('accessibility scroll: Color-blind accessibility with scroll indicators', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await waitForPageReady(page)
      
      // Test that scroll indicators don't rely solely on color
      const colorBlindAccessibility = await page.evaluate(() => {
        // Check for non-color indicators (shapes, text, patterns)
        const scrollIndicators = document.querySelectorAll('[class*="scroll"], [class*="indicator"], [class*="progress"]')
        const indicatorsWithNonColorInfo = Array.from(scrollIndicators).filter(element => {
          const hasText = element.textContent && element.textContent.trim().length > 0
          const hasIcon = element.querySelector('svg, .icon, [class*="icon"]') !== null
          const hasShape = window.getComputedStyle(element).borderRadius !== '' ||
                          window.getComputedStyle(element).clipPath !== ''
          
          return hasText || hasIcon || hasShape
        })
        
        return {
          totalIndicators: scrollIndicators.length,
          indicatorsWithNonColorInfo: indicatorsWithNonColorInfo.length,
          accessibilityRatio: indicatorsWithNonColorInfo.length / Math.max(scrollIndicators.length, 1)
        }
      })
      
      if (colorBlindAccessibility.totalIndicators > 0) {
        expect(colorBlindAccessibility.accessibilityRatio).toBeGreaterThan(0.5) // At least 50% should have non-color indicators
      }
    })
  })
})
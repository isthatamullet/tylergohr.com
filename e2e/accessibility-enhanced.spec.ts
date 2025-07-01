import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Enhanced Accessibility Testing - /2 Enterprise Portfolio', () => {
  
  test.describe('WCAG 2.1 AA Compliance - Homepage Sections', () => {
    test('hero section passes comprehensive accessibility audit', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#hero')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
      
      // Additional checks for enterprise accessibility standards
      const violations = accessibilityScanResults.violations
      if (violations.length > 0) {
        console.log('Accessibility violations found in hero section:')
        violations.forEach(violation => {
          console.log(`- ${violation.id}: ${violation.description}`)
          console.log(`  Impact: ${violation.impact}`)
          console.log(`  Help: ${violation.helpUrl}`)
        })
      }
    })

    test('about section with network animation passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to about section and wait for animations
      await page.getByRole('heading', { name: /About Tyler Gohr/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#about')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('results section with animated metrics passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to results section and wait for counter animations
      await page.getByRole('heading', { name: /Results & Impact/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(2000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#results')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('case studies section passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#work')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('how i work section passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      await page.getByRole('heading', { name: /How I Work/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#process')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('technical expertise section passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      await page.getByRole('heading', { name: /Technical Expertise/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#skills')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('contact section with form passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#contact')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('WCAG 2.1 AA Compliance - Detail Pages', () => {
    test('case studies browser tabs page passes accessibility audit', async ({ page }) => {
      await page.goto('/2/case-studies')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('technical expertise browser tabs page passes accessibility audit', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('how i work methodology page passes accessibility audit', async ({ page }) => {
      await page.goto('/2/how-i-work')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  })

  test.describe('Keyboard Navigation Accessibility', () => {
    test('complete keyboard navigation flow works on homepage', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Start from the top of the page
      await page.keyboard.press('Home')
      
      // Tab through all interactive elements
      let tabCount = 0
      const maxTabs = 50 // Prevent infinite loop
      
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab')
        tabCount++
        
        const focusedElement = page.locator(':focus')
        const isVisible = await focusedElement.isVisible().catch(() => false)
        
        if (isVisible) {
          // Check that focused element has proper focus indicators
          const element = focusedElement.first()
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el)
            return {
              outline: computed.outline,
              outlineColor: computed.outlineColor,
              outlineWidth: computed.outlineWidth,
              boxShadow: computed.boxShadow
            }
          })
          
          // Should have some kind of focus indicator
          const hasFocusIndicator = 
            styles.outline !== 'none' || 
            styles.outlineWidth !== '0px' || 
            styles.boxShadow.includes('0 0') || 
            styles.boxShadow.includes('inset')
          
          expect(hasFocusIndicator).toBeTruthy()
        }
        
        // Check if we've reached the end (focus might cycle back to start)
        const currentUrl = page.url()
        if (currentUrl !== '/2' && !currentUrl.includes('#')) {
          break // Navigation occurred, which is expected
        }
      }
      
      expect(tabCount).toBeGreaterThan(5) // Should have at least 5 tabbable elements
    })

    test('keyboard navigation works on case studies page with browser tabs', async ({ page }) => {
      await page.goto('/2/case-studies')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      // Find the browser tabs
      const tabs = page.getByRole('tab')
      const tabCount = await tabs.count()
      
      if (tabCount > 0) {
        // Focus first tab
        await tabs.first().focus()
        
        // Navigate through tabs with arrow keys
        for (let i = 0; i < tabCount - 1; i++) {
          await page.keyboard.press('ArrowRight')
          await page.waitForTimeout(200)
          
          // Check that the next tab is focused and selected
          const focusedTab = page.locator('[role="tab"]:focus')
          await expect(focusedTab).toBeVisible()
          
          // Tab should be marked as selected
          await expect(focusedTab).toHaveAttribute('aria-selected', 'true')
        }
        
        // Test wrapping (should go back to first tab)
        await page.keyboard.press('ArrowRight')
        const firstTab = tabs.first()
        await expect(firstTab).toHaveAttribute('aria-selected', 'true')
      }
    })

    test('skip links work correctly for efficient navigation', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Check for skip links (they might be visually hidden)
      await page.keyboard.press('Tab')
      
      const skipLink = page.locator('a[href^="#"]').filter({ hasText: /skip/i }).first()
      if (await skipLink.isVisible()) {
        // Skip link should be functional
        await skipLink.click()
        
        // Should move focus to main content
        const mainContent = page.locator('main, [role="main"], #main, .main-content')
        if (await mainContent.count() > 0) {
          // Check that we've moved past navigation
          const focusedElement = page.locator(':focus')
          const isAfterNav = await focusedElement.evaluate(el => {
            const nav = document.querySelector('nav')
            if (!nav || !el) return true
            return nav.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING
          })
          expect(isAfterNav).toBeTruthy()
        }
      }
    })
  })

  test.describe('Screen Reader Compatibility', () => {
    test('proper heading hierarchy is maintained', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Get all headings and check hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      
      let previousLevel = 0
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
        const currentLevel = parseInt(tagName.charAt(1))
        
        // Check that heading levels don't skip (e.g., h1 to h3)
        if (previousLevel > 0) {
          const levelDiff = currentLevel - previousLevel
          expect(levelDiff).toBeLessThanOrEqual(1)
        }
        
        previousLevel = currentLevel
      }
      
      // Should have at least one h1
      const h1Count = await page.locator('h1').count()
      expect(h1Count).toBeGreaterThanOrEqual(1)
    })

    test('ARIA landmarks are properly implemented', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Check for essential landmarks
      const landmarks = {
        navigation: page.locator('[role="navigation"], nav'),
        main: page.locator('[role="main"], main'),
        region: page.locator('[role="region"]'),
        banner: page.locator('[role="banner"], header'),
        contentinfo: page.locator('[role="contentinfo"], footer')
      }
      
      // Navigation should exist
      await expect(landmarks.navigation).toHaveCount(1)
      
      // Main content should exist
      const mainCount = await landmarks.main.count()
      if (mainCount === 0) {
        // If no explicit main, check for main-like content
        const hasMainContent = await page.locator('section, article, .main, .content').count()
        expect(hasMainContent).toBeGreaterThan(0)
      } else {
        expect(mainCount).toBe(1)
      }
      
      // Regions should have accessible names
      const regions = await landmarks.region.all()
      for (const region of regions) {
        const hasLabel = await region.evaluate(el => {
          return el.hasAttribute('aria-label') || 
                 el.hasAttribute('aria-labelledby') || 
                 el.hasAttribute('title')
        })
        expect(hasLabel).toBeTruthy()
      }
    })

    test('form controls have proper labels and descriptions', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Navigate to contact form
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Check all form inputs have labels
      const inputs = page.locator('input, textarea, select')
      const inputCount = await inputs.count()
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i)
        const type = await input.getAttribute('type')
        
        // Skip hidden inputs
        if (type === 'hidden') continue
        
        // Check for proper labeling
        const hasLabel = await input.evaluate(el => {
          const id = el.id
          if (id && document.querySelector(`label[for="${id}"]`)) return true
          
          const ariaLabel = el.getAttribute('aria-label')
          if (ariaLabel) return true
          
          const ariaLabelledBy = el.getAttribute('aria-labelledby')
          if (ariaLabelledBy && document.getElementById(ariaLabelledBy)) return true
          
          // Check if wrapped in label
          const parentLabel = el.closest('label')
          if (parentLabel) return true
          
          return false
        })
        
        expect(hasLabel).toBeTruthy()
      }
    })

    test('error messages are properly announced', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Navigate to contact form
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Trigger validation errors
      const emailField = page.getByLabel('Email')
      await emailField.fill('invalid-email')
      await emailField.blur()
      
      // Check that error message has proper ARIA attributes
      await page.waitForTimeout(500) // Wait for validation
      
      const errorMessage = page.getByText(/Please enter a valid email address/)
      if (await errorMessage.isVisible()) {
        // Error should be associated with the field
        const errorId = await errorMessage.getAttribute('id')
        if (errorId) {
          const fieldAriaDescribedBy = await emailField.getAttribute('aria-describedby')
          expect(fieldAriaDescribedBy).toContain(errorId)
        }
        
        // Field should be marked as invalid
        await expect(emailField).toHaveAttribute('aria-invalid', 'true')
      }
    })
  })

  test.describe('Color Contrast and Visual Accessibility', () => {
    test('text has sufficient color contrast', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test color contrast using axe-core
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .withRules(['color-contrast'])
        .analyze()

      const contrastViolations = accessibilityScanResults.violations.filter(
        violation => violation.id === 'color-contrast'
      )
      
      expect(contrastViolations).toEqual([])
    })

    test('focus indicators have sufficient contrast', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test focus on various interactive elements
      const interactiveElements = page.locator('button, a, input, textarea, select')
      const elementCount = await interactiveElements.count()
      
      // Test first few elements for focus contrast
      const elementsToTest = Math.min(5, elementCount)
      
      for (let i = 0; i < elementsToTest; i++) {
        const element = interactiveElements.nth(i)
        
        // Focus the element
        await element.focus()
        
        // Check that focus creates a visible indicator
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el)
          return {
            outline: computed.outline,
            outlineColor: computed.outlineColor,
            boxShadow: computed.boxShadow,
            backgroundColor: computed.backgroundColor,
            borderColor: computed.borderColor
          }
        })
        
        // Should have some kind of visible focus indicator
        const hasVisibleFocus = 
          styles.outline !== 'none' ||
          styles.boxShadow !== 'none' ||
          styles.borderColor !== 'rgba(0, 0, 0, 0)' ||
          styles.backgroundColor !== 'rgba(0, 0, 0, 0)'
        
        expect(hasVisibleFocus).toBeTruthy()
      }
    })
  })

  test.describe('Motion and Animation Accessibility', () => {
    test('respects reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to about section with network animation
      await page.getByRole('heading', { name: /About Tyler Gohr/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      
      // Check that animations are disabled/reduced
      const animatedElements = page.locator('[class*="animate"], [class*="transition"]')
      const elementCount = await animatedElements.count()
      
      if (elementCount > 0) {
        for (let i = 0; i < Math.min(3, elementCount); i++) {
          const element = animatedElements.nth(i)
          const styles = await element.evaluate(el => {
            const computed = window.getComputedStyle(el)
            return {
              animationDuration: computed.animationDuration,
              transitionDuration: computed.transitionDuration
            }
          })
          
          // Animations should be very fast or disabled
          expect(styles.animationDuration).toMatch(/0s|0.01s/)
          expect(styles.transitionDuration).toMatch(/0s|0.01s/)
        }
      }
    })

    test('no essential content depends on motion', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test with reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Essential content should still be accessible
      await expect(page.getByRole('heading', { name: /Tyler Gohr/ })).toBeVisible()
      await expect(page.getByRole('heading', { name: /Enterprise Solutions Architect/ })).toBeVisible()
      
      // Navigation should work
      const aboutButton = page.getByRole('button', { name: /Navigate to About section/ })
      await aboutButton.click()
      
      // Should be able to reach all sections
      await page.getByRole('heading', { name: /About Tyler Gohr/ }).scrollIntoViewIfNeeded()
      await expect(page.getByRole('heading', { name: /About Tyler Gohr/ })).toBeVisible()
    })
  })

  test.describe('Mobile Accessibility', () => {
    test('mobile navigation is accessible with assistive technology', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test mobile menu button
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      await expect(menuButton).toHaveAttribute('aria-controls', 'mobile-navigation')
      
      // Open mobile menu
      await menuButton.click()
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      
      // Check mobile navigation is properly labeled
      const mobileNav = page.locator('#mobile-navigation')
      await expect(mobileNav).toHaveAttribute('aria-hidden', 'false')
      
      // Test mobile dropdown accessibility
      const workButton = page.getByRole('button', { name: /Navigate to Work section/ })
      const dropdownToggle = page.getByRole('button', { name: /Expand Work menu/ })
      
      await expect(dropdownToggle).toHaveAttribute('aria-label', /Expand Work menu/)
      
      await dropdownToggle.click()
      await expect(dropdownToggle).toHaveAttribute('aria-label', /Collapse Work menu/)
    })

    test('touch targets meet minimum size requirements', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Check mobile menu button
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      const menuButtonBox = await menuButton.boundingBox()
      
      if (menuButtonBox) {
        expect(menuButtonBox.width).toBeGreaterThanOrEqual(44)
        expect(menuButtonBox.height).toBeGreaterThanOrEqual(44)
      }
      
      // Open mobile menu and check navigation buttons
      await menuButton.click()
      
      const mobileNavButtons = page.locator('#mobile-navigation button')
      const buttonCount = await mobileNavButtons.count()
      
      for (let i = 0; i < Math.min(5, buttonCount); i++) {
        const button = mobileNavButtons.nth(i)
        const boundingBox = await button.boundingBox()
        
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })

  test.describe('Enterprise Accessibility Standards', () => {
    test('meets WCAG 2.1 AAA standards where feasible', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test with AAA standards (stricter)
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aaa'])
        .analyze()

      // AAA might have violations, but we should check for critical ones
      const criticalViolations = accessibilityScanResults.violations.filter(
        violation => violation.impact === 'critical'
      )
      
      expect(criticalViolations).toEqual([])
      
      // Log AAA violations for review (not failures)
      if (accessibilityScanResults.violations.length > 0) {
        console.log('WCAG 2.1 AAA considerations:')
        accessibilityScanResults.violations.forEach(violation => {
          console.log(`- ${violation.id}: ${violation.description} (Impact: ${violation.impact})`)
        })
      }
    })

    test('section 508 compliance check', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test with Section 508 rules
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['section508'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('enterprise-level accessibility documentation', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Check for accessibility statement or documentation
      const a11yLinks = page.locator('a').filter({ hasText: /accessibility|a11y/i })
      
      // Check document language is set
      const htmlLang = await page.locator('html').getAttribute('lang')
      expect(htmlLang).toBeTruthy()
      expect(htmlLang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/) // Valid language code format
      
      // Check page has title
      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)
      expect(title.length).toBeLessThan(60) // Good SEO practice
    })
  })
})
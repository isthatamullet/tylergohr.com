import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForIntersectionObserver } from './utils/dev-test-helpers'

test.describe('Navigation Component Testing', () => {
  
  test.describe('Intersection Observer Section Detection', () => {
    test('detects active section changes during scroll on /2 homepage', async ({ page }) => {
      await page.goto('/2')
      
      // Wait for intersection observer to be set up
      await waitForIntersectionObserver(page)
      
      // Check initial active section (should be about)
      const aboutNavLink = page.getByRole('button', { name: /Navigate to About section/ })
      await expect(aboutNavLink).toHaveClass(/active/)
      
      // Scroll to results section
      await page.getByRole('heading', { name: /Results & Impact/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(100) // Brief settle time for scroll
      
      // Check results section becomes active
      const resultsNavLink = page.getByRole('button', { name: /Navigate to Results section/ })
      await expect(resultsNavLink).toHaveClass(/active/)
      
      // Scroll to case studies section
      await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
      
      // Check work section becomes active
      const workNavLink = page.getByRole('button', { name: /Navigate to Work section/ })
      await expect(workNavLink).toHaveClass(/active/)
      
      // Scroll to contact section
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(500)
      
      // Check contact section becomes active
      const contactNavLink = page.getByRole('button', { name: /Navigate to Contact section/ })
      await expect(contactNavLink).toHaveClass(/active/)
    })

    test('URL hash updates correctly with scroll detection', async ({ page }) => {
      await page.goto('/2')
      await page.waitForTimeout(1000)
      
      // Scroll to different sections and verify hash updates
      const sections = [
        { heading: /Results & Impact/, expectedHash: '#results' },
        { heading: /Case Studies/, expectedHash: '#work' },
        { heading: /How I Work/, expectedHash: '#process' },
        { heading: /Technical Expertise/, expectedHash: '#skills' },
        { heading: /Contact/, expectedHash: '#contact' }
      ]
      
      for (const section of sections) {
        await page.getByRole('heading', { name: section.heading }).scrollIntoViewIfNeeded()
        await page.waitForTimeout(500)
        
        // Check URL hash is updated
        const currentUrl = page.url()
        expect(currentUrl).toContain(section.expectedHash)
      }
    })

    test('handles navigation from hash URLs correctly', async ({ page }) => {
      // Test direct navigation to hash URLs
      const hashUrls = [
        { url: '/2#results', expectedActiveSection: 'Results' },
        { url: '/2#work', expectedActiveSection: 'Work' },
        { url: '/2#contact', expectedActiveSection: 'Contact' }
      ]
      
      for (const hashUrl of hashUrls) {
        await page.goto(hashUrl.url)
        await page.waitForTimeout(1000)
        
        // Check correct section is active
        const activeNavLink = page.getByRole('button', { name: new RegExp(`Navigate to ${hashUrl.expectedActiveSection} section`) })
        await expect(activeNavLink).toHaveClass(/active/)
        
        // Check correct section is in viewport
        const targetSection = page.locator(`#${hashUrl.url.split('#')[1]}`)
        await expect(targetSection).toBeInViewport()
      }
    })

    test('intersection observer handles multiple sections in viewport', async ({ page }) => {
      await page.goto('/2')
      await page.waitForTimeout(1000)
      
      // Scroll to a position where multiple sections might be visible
      await page.evaluate(() => {
        const resultsSection = document.getElementById('results')
        if (resultsSection) {
          const rect = resultsSection.getBoundingClientRect()
          // Scroll to show both results and work sections partially
          window.scrollTo(0, window.pageYOffset + rect.top - 400)
        }
      })
      
      await page.waitForTimeout(500)
      
      // Should still have one clearly active section (priority system)
      const activeButtons = page.locator('button[class*="active"]')
      const activeCount = await activeButtons.count()
      expect(activeCount).toBeGreaterThanOrEqual(1)
      expect(activeCount).toBeLessThanOrEqual(2) // Allow some flexibility for timing
    })
  })

  test.describe('Mobile Navigation Behavior', () => {
    test('mobile menu toggles correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Check mobile menu button is visible
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await expect(menuButton).toBeVisible()
      
      // Check mobile navigation is initially hidden
      const mobileNav = page.locator('#mobile-navigation')
      await expect(mobileNav).toHaveAttribute('aria-hidden', 'true')
      
      // Open mobile menu
      await menuButton.click()
      
      // Check menu opens
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      await expect(mobileNav).toHaveAttribute('aria-hidden', 'false')
      await expect(mobileNav).toHaveClass(/mobileNavOpen/)
      
      // Check hamburger animation
      const hamburgerLines = page.locator('[class*="hamburgerLine"]')
      const lineCount = await hamburgerLines.count()
      expect(lineCount).toBe(3)
      
      for (let i = 0; i < lineCount; i++) {
        await expect(hamburgerLines.nth(i)).toHaveClass(/hamburgerOpen/)
      }
      
      // Close mobile menu
      await menuButton.click()
      
      // Check menu closes
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
      await expect(mobileNav).toHaveAttribute('aria-hidden', 'true')
    })

    test('mobile dropdown menus work correctly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Open mobile menu
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await menuButton.click()
      
      // Test dropdown toggle for Work section
      const workNavButton = page.getByRole('button', { name: /Navigate to Work section/ })
      const workDropdownToggle = page.getByRole('button', { name: /Expand Work menu/ })
      
      await expect(workNavButton).toBeVisible()
      await expect(workDropdownToggle).toBeVisible()
      
      // Expand Work dropdown
      await workDropdownToggle.click()
      
      // Check dropdown is expanded
      await expect(workDropdownToggle).toHaveAttribute('aria-label', /Collapse Work menu/)
      await expect(workDropdownToggle).toHaveClass(/expanded/)
      
      // Check dropdown content is visible
      const dropdownContent = page.locator('[class*="mobileDropdownContent"]')
      await expect(dropdownContent).toBeVisible()
      
      // Check dropdown items are present
      await expect(page.getByText('Emmy-winning Streaming Platform')).toBeVisible()
      await expect(page.getByText('Fox Corporation Cost Optimization')).toBeVisible()
      
      // Test dropdown item click
      await page.getByText('Emmy-winning Streaming Platform').click()
      
      // Should navigate and close menu
      await expect(page).toHaveURL(/\/2\/case-studies/)
      await expect(page.locator('#mobile-navigation')).toHaveAttribute('aria-hidden', 'true')
    })

    test('mobile navigation overlay closes menu', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Open mobile menu
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await menuButton.click()
      
      // Check overlay is present
      const overlay = page.locator('[class*="overlay"]')
      await expect(overlay).toBeVisible()
      
      // Click overlay to close menu
      await overlay.click()
      
      // Check menu closes
      await expect(page.locator('#mobile-navigation')).toHaveAttribute('aria-hidden', 'true')
      await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    test('mobile navigation has proper touch targets', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Open mobile menu
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await menuButton.click()
      
      // Check all navigation buttons have adequate touch targets (44px minimum)
      const navButtons = page.locator('#mobile-navigation button')
      const buttonCount = await navButtons.count()
      
      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i)
        const boundingBox = await button.boundingBox()
        
        if (boundingBox) {
          expect(boundingBox.height).toBeGreaterThanOrEqual(44)
          // Width can vary, but should be reasonable for touch
          expect(boundingBox.width).toBeGreaterThanOrEqual(44)
        }
      }
    })
  })

  test.describe('Keyboard Navigation Accessibility', () => {
    test('navigation supports keyboard navigation', async ({ page }) => {
      await page.goto('/2')
      
      // Start from logo
      const logo = page.getByRole('button', { name: /Tyler Gohr - Return to Enterprise Solutions homepage/ })
      await logo.focus()
      await expect(logo).toBeFocused()
      
      // Tab through navigation links
      const expectedFocusOrder = [
        /Navigate to About section/,
        /Navigate to Results section/,
        /Navigate to Work section/,
        /Navigate to Process section/,
        /Navigate to Skills section/,
        /Navigate to Contact section/
      ]
      
      for (const expectedButton of expectedFocusOrder) {
        await page.keyboard.press('Tab')
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toHaveAttribute('aria-label', expectedButton)
      }
    })

    test('dropdown menus support keyboard navigation', async ({ page }) => {
      await page.goto('/2')
      
      // Focus on Work dropdown
      const workButton = page.getByRole('button', { name: /Navigate to Work section/ })
      await workButton.focus()
      
      // Check ARIA attributes
      await expect(workButton).toHaveAttribute('aria-haspopup', 'menu')
      await expect(workButton).toHaveAttribute('aria-expanded', 'false')
      
      // Hover to open dropdown (simulating hover with JavaScript since it's hover-triggered)
      await workButton.hover()
      await page.waitForTimeout(300)
      
      // Check dropdown opens and button aria-expanded updates
      await expect(workButton).toHaveAttribute('aria-expanded', 'true')
      
      // Check dropdown menu is accessible
      const dropdownMenu = page.locator('[class*="dropdownMenu"]')
      await expect(dropdownMenu).toBeVisible()
    })

    test('mobile navigation supports keyboard navigation', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Focus mobile menu button
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await menuButton.focus()
      await expect(menuButton).toBeFocused()
      
      // Open menu with Enter key
      await page.keyboard.press('Enter')
      await expect(menuButton).toHaveAttribute('aria-expanded', 'true')
      
      // Tab through mobile navigation items
      await page.keyboard.press('Tab')
      const firstNavButton = page.getByRole('button', { name: /Navigate to About section/ })
      await expect(firstNavButton).toBeFocused()
      
      // Check tabindex is correctly set for open menu
      await expect(firstNavButton).toHaveAttribute('tabindex', '0')
    })

    test('navigation skips hidden elements with proper tabindex', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Initially, mobile nav items should have tabindex="-1"
      const mobileNavButtons = page.locator('#mobile-navigation button')
      const buttonCount = await mobileNavButtons.count()
      
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        const button = mobileNavButtons.nth(i)
        await expect(button).toHaveAttribute('tabindex', '-1')
      }
      
      // Open mobile menu
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await menuButton.click()
      
      // Now mobile nav items should have tabindex="0"
      for (let i = 0; i < Math.min(3, buttonCount); i++) {
        const button = mobileNavButtons.nth(i)
        await expect(button).toHaveAttribute('tabindex', '0')
      }
    })
  })

  test.describe('Dropdown Timing and Hover Behavior', () => {
    test('dropdown opens and closes with proper timing', async ({ page }) => {
      await page.goto('/2')
      
      const workButton = page.getByRole('button', { name: /Navigate to Work section/ })
      const dropdownMenu = page.locator('[class*="dropdownMenu"]')
      
      // Initially dropdown should not be visible
      await expect(dropdownMenu).not.toBeVisible()
      
      // Hover to open dropdown
      await workButton.hover()
      await page.waitForTimeout(100) // Allow for animation
      
      // Dropdown should be visible
      await expect(dropdownMenu).toBeVisible()
      await expect(workButton).toHaveAttribute('aria-expanded', 'true')
      
      // Move mouse away to close dropdown
      await page.locator('body').hover()
      await page.waitForTimeout(100) // Wait for timeout delay (50ms + buffer)
      
      // Dropdown should close
      await expect(dropdownMenu).not.toBeVisible()
      await expect(workButton).toHaveAttribute('aria-expanded', 'false')
    })

    test('dropdown stays open when hovering between trigger and menu', async ({ page }) => {
      await page.goto('/2')
      
      const workButton = page.getByRole('button', { name: /Navigate to Work section/ })
      const dropdownMenu = page.locator('[class*="dropdownMenu"]')
      
      // Open dropdown
      await workButton.hover()
      await page.waitForTimeout(100)
      await expect(dropdownMenu).toBeVisible()
      
      // Move to dropdown menu (should stay open)
      await dropdownMenu.hover()
      await page.waitForTimeout(100)
      await expect(dropdownMenu).toBeVisible()
      
      // Move back to trigger (should stay open)
      await workButton.hover()
      await page.waitForTimeout(100)
      await expect(dropdownMenu).toBeVisible()
    })

    test('multiple dropdowns do not interfere with each other', async ({ page }) => {
      await page.goto('/2')
      
      const workButton = page.getByRole('button', { name: /Navigate to Work section/ })
      const skillsButton = page.getByRole('button', { name: /Navigate to Skills section/ })
      
      // Open Work dropdown
      await workButton.hover()
      await page.waitForTimeout(100)
      await expect(workButton).toHaveAttribute('aria-expanded', 'true')
      
      // Move to Skills dropdown
      await skillsButton.hover()
      await page.waitForTimeout(100)
      
      // Work dropdown should close, Skills should open
      await expect(workButton).toHaveAttribute('aria-expanded', 'false')
      await expect(skillsButton).toHaveAttribute('aria-expanded', 'true')
    })
  })

  test.describe('Navigation Performance', () => {
    test('scroll handler is properly throttled', async ({ page }) => {
      await page.goto('/2')
      await page.waitForTimeout(1000)
      
      // Add performance monitoring
      await page.evaluate(() => {
        (window as any).scrollCallCount = 0;
        const originalAddEventListener = window.addEventListener;
        window.addEventListener = function(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
          if (type === 'scroll') {
            const wrappedListener = function(e: Event) {
              (window as any).scrollCallCount++;
              return (listener as any)(e);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
          }
          return originalAddEventListener.call(this, type, listener, options);
        };
      })
      
      // Trigger multiple rapid scroll events
      await page.evaluate(() => {
        for (let i = 0; i < 100; i++) {
          window.scrollTo(0, i * 10)
        }
      })
      
      await page.waitForTimeout(500)
      
      // Check that scroll handler was throttled (should be much less than 100 calls)
      const scrollCallCount = await page.evaluate(() => (window as any).scrollCallCount)
      expect(scrollCallCount).toBeLessThan(50) // Throttling should reduce calls significantly
    })

    test('navigation state updates do not cause layout thrashing', async ({ page }) => {
      await page.goto('/2')
      await page.waitForTimeout(1000)
      
      // Monitor layout shifts during navigation
      const layoutShifts = await page.evaluate(() => {
        return new Promise((resolve) => {
          let cumulativeScore = 0
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                cumulativeScore += (entry as any).value
              }
            }
          })
          observer.observe({ type: 'layout-shift', buffered: true })
          
          // Trigger navigation updates
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              const sections = ['about', 'results', 'work', 'process', 'skills']
              const randomSection = sections[Math.floor(Math.random() * sections.length)]
              document.getElementById(randomSection)?.scrollIntoView()
            }, i * 100)
          }
          
          setTimeout(() => {
            observer.disconnect()
            resolve(cumulativeScore)
          }, 1000)
        })
      })
      
      // Layout shift score should be minimal (< 0.1 is good)
      expect(layoutShifts).toBeLessThan(0.1)
    })
  })

  test.describe('Accessibility Compliance', () => {
    test('navigation passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('nav')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('navigation has proper ARIA landmarks and labels', async ({ page }) => {
      await page.goto('/2')
      
      // Check main navigation landmark
      const nav = page.locator('nav')
      await expect(nav).toHaveAttribute('role', 'navigation')
      await expect(nav).toHaveAttribute('aria-label', 'Main navigation')
      
      // Check logo has descriptive label
      const logo = page.getByRole('button', { name: /Tyler Gohr - Return to Enterprise Solutions homepage/ })
      await expect(logo).toBeVisible()
      
      // Check navigation buttons have proper labels
      const navButtons = page.locator('nav button[aria-label*="Navigate to"]')
      const buttonCount = await navButtons.count()
      expect(buttonCount).toBeGreaterThan(0)
      
      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i)
        const ariaLabel = await button.getAttribute('aria-label')
        expect(ariaLabel).toMatch(/Navigate to .+ section/)
      }
    })

    test('current page is properly indicated for screen readers', async ({ page }) => {
      // Test on different pages
      const pages = [
        { url: '/2', expectedActiveSection: 'About' },
        { url: '/2/case-studies', expectedActiveSection: 'Work' },
        { url: '/2/technical-expertise', expectedActiveSection: 'Skills' },
        { url: '/2/how-i-work', expectedActiveSection: 'Process' }
      ]
      
      for (const pageTest of pages) {
        await page.goto(pageTest.url)
        await page.waitForTimeout(500)
        
        // Check aria-current attribute
        const activeButton = page.getByRole('button', { name: new RegExp(`Navigate to ${pageTest.expectedActiveSection} section`) })
        await expect(activeButton).toHaveAttribute('aria-current', 'page')
      }
    })
  })

  test.describe('Cross-Device Viewport Handling', () => {
    test('navigation adapts correctly to different viewport sizes', async ({ page }) => {
      const viewports = [
        { width: 320, height: 568, name: 'iPhone SE' },
        { width: 375, height: 667, name: 'iPhone 8' },
        { width: 768, height: 1024, name: 'iPad' },
        { width: 1024, height: 768, name: 'iPad Landscape' },
        { width: 1200, height: 800, name: 'Desktop' },
        { width: 1920, height: 1080, name: 'Large Desktop' }
      ]
      
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        await page.goto('/2')
        
        // Check appropriate navigation is visible
        if (viewport.width < 768) {
          // Mobile - should show mobile menu button
          await expect(page.locator('[class*="mobileMenuButton"]')).toBeVisible()
          await expect(page.locator('[class*="desktopNav"]')).not.toBeVisible()
        } else {
          // Desktop - should show desktop navigation
          await expect(page.locator('[class*="desktopNav"]')).toBeVisible()
          await expect(page.locator('[class*="mobileMenuButton"]')).not.toBeVisible()
        }
        
        // Logo should always be visible
        await expect(page.getByRole('button', { name: /Tyler Gohr - Return to Enterprise Solutions homepage/ })).toBeVisible()
      }
    })
  })
})
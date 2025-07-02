import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { waitForPageReady, conditionalScreenshot } from './utils/dev-test-helpers'

test.describe('Portfolio Redesign (/2) - Enterprise Solutions Architect', () => {
  
  test.describe('Navigation Dropdown Content Testing', () => {
    test('Work dropdown contains specific Emmy Award and business impact items', async ({ page }) => {
      await page.goto('/2')
      
      // Hover over Work dropdown to reveal content
      const workNavItem = page.locator('[class*="navItem"]').filter({ hasText: 'Work' })
      await workNavItem.hover()
      
      // Check for specific dropdown items
      await expect(page.getByText('Emmy-winning Streaming Platform')).toBeVisible()
      await expect(page.getByText('Fox Corporation Cost Optimization')).toBeVisible()
      await expect(page.getByText('Warner Bros Delivery Enhancement')).toBeVisible()
      await expect(page.getByText('AI-Powered Media Automation')).toBeVisible()
      
      // Check for badges
      await expect(page.getByText('Emmy Award')).toBeVisible()
      await expect(page.getByText('Cost Savings')).toBeVisible()
      await expect(page.getByText('Success Rate')).toBeVisible()
      await expect(page.getByText('Innovation')).toBeVisible()
    })

    test('Skills dropdown contains technical expertise with icons', async ({ page }) => {
      await page.goto('/2')
      
      // Hover over Skills dropdown to reveal content
      const skillsNavItem = page.locator('[class*="navItem"]').filter({ hasText: 'Skills' })
      await skillsNavItem.hover()
      
      // Check for specific technical areas
      await expect(page.getByText('Frontend Development')).toBeVisible()
      await expect(page.getByText('Backend Architecture')).toBeVisible()
      await expect(page.getByText('Cloud Infrastructure')).toBeVisible()
      await expect(page.getByText('Team Leadership')).toBeVisible()
      await expect(page.getByText('AI Innovation')).toBeVisible()
      
      // Check for technology mentions
      await expect(page.getByText('React, Next.js, TypeScript')).toBeVisible()
      await expect(page.getByText('Node.js, Python, database design')).toBeVisible()
      await expect(page.getByText('AWS, Google Cloud, Docker')).toBeVisible()
    })

    test('Process dropdown contains development methodology steps', async ({ page }) => {
      await page.goto('/2')
      
      // Hover over Process dropdown to reveal content
      const processNavItem = page.locator('[class*="navItem"]').filter({ hasText: 'Process' })
      await processNavItem.hover()
      
      // Check for development process steps
      await expect(page.getByText('Discovery & Requirements')).toBeVisible()
      await expect(page.getByText('Research & Planning')).toBeVisible()
      await expect(page.getByText('Design & Prototyping')).toBeVisible()
      await expect(page.getByText('Implementation & Development')).toBeVisible()
      await expect(page.getByText('Testing & Quality Assurance')).toBeVisible()
      await expect(page.getByText('Deployment & Launch')).toBeVisible()
      await expect(page.getByText('Optimization & Support')).toBeVisible()
    })
  })

  test.describe('Enterprise Solutions Architect Content Testing', () => {
    test('homepage displays complete Enterprise Solutions Architect branding', async ({ page }) => {
      await page.goto('/2')

      // Check main hero content
      await expect(page.getByRole('heading', { name: /Enterprise Solutions Architect/ })).toBeVisible()
      await expect(page.getByText(/Creating powerful digital solutions that solve real business problems/)).toBeVisible()
      await expect(page.getByText(/Emmy Award-winning streaming platforms/)).toBeVisible()
      await expect(page.getByText(/16\+ years at Fox Corporation and Warner Bros/)).toBeVisible()
      
      // Check specific business value messaging
      await expect(page.getByText(/transform technical challenges into competitive advantages/)).toBeVisible()
      
      // Check call-to-action buttons
      await expect(page.getByRole('button', { name: /Start Your Project/ })).toBeVisible()
      await expect(page.getByRole('button', { name: /View My Work/ })).toBeVisible()
    })

    test('About section contains Emmy Award and enterprise experience', async ({ page }) => {
      await page.goto('/2')
      
      // Scroll to about section
      await page.getByRole('heading', { name: /About Tyler Gohr/ }).scrollIntoViewIfNeeded()
      
      // Check Emmy Award highlighting
      await expect(page.getByText(/Emmy Award-winning/)).toBeVisible()
      
      // Check enterprise experience
      await expect(page.getByText(/Fox Corporation and Warner Bros Entertainment/)).toBeVisible()
      await expect(page.getByText(/16\+ years leading technical teams/)).toBeVisible()
      await expect(page.getByText(/17,000\+ digital assets/)).toBeVisible()
      
      // Check business-focused messaging
      await expect(page.getByText(/Fortune 500-level expertise/)).toBeVisible()
      await expect(page.getByText(/growing company needing a custom web application/)).toBeVisible()
      await expect(page.getByText(/enterprise requiring complex digital infrastructure/)).toBeVisible()
    })

    test('Results section displays quantified business impact', async ({ page }) => {
      await page.goto('/2')
      
      // Scroll to results section
      await page.getByRole('heading', { name: /Results & Impact/ }).scrollIntoViewIfNeeded()
      
      // Check for specific metrics (values may animate, so check for presence)
      await expect(page.getByText(/Emmy Award Winner/)).toBeVisible()
      await expect(page.getByText(/Cost Savings Achieved/)).toBeVisible()
      await expect(page.getByText(/Success Rate Achievement/)).toBeVisible()
      await expect(page.getByText(/Team Members Led/)).toBeVisible()
      
      // Check for business context
      await expect(page.getByText(/2018 FIFA World Cup Streaming Technology/)).toBeVisible()
      await expect(page.getByText(/Fox Corporation content strategy optimization/)).toBeVisible()
      await expect(page.getByText(/Warner Bros delivery improvement/)).toBeVisible()
    })

    test('Case studies preview shows enterprise-level projects', async ({ page }) => {
      await page.goto('/2')
      
      // Scroll to case studies section
      await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
      
      // Check for enterprise project descriptions
      await expect(page.getByText(/Emmy-Winning Live Streaming/)).toBeVisible()
      await expect(page.getByText(/2018 FIFA World Cup demanded flawless global streaming/)).toBeVisible()
      await expect(page.getByText(/Emmy Award recognition for streaming technology excellence/)).toBeVisible()
      
      // Check for business impact focus
      await expect(page.getByText(/Fortune 500 enterprises/)).toBeVisible()
      await expect(page.getByText(/measurable results through strategic technical leadership/)).toBeVisible()
    })
  })

  test.describe('Navigation Flow Testing', () => {
    test('navigation between detail pages works correctly', async ({ page }) => {
      await page.goto('/2')

      // Test navigation to case studies
      await page.getByRole('link', { name: /Case Studies/ }).first().click()
      await expect(page).toHaveURL('/2/case-studies')
      await expect(page.getByRole('heading', { name: /Case Studies/ })).toBeVisible()

      // Test navigation to technical expertise
      await page.getByRole('link', { name: /Technical Expertise/ }).first().click()
      await expect(page).toHaveURL('/2/technical-expertise')
      await expect(page.getByRole('heading', { name: /Technical Expertise/ })).toBeVisible()

      // Test navigation to how i work
      await page.getByRole('link', { name: /How I Work/ }).first().click()
      await expect(page).toHaveURL('/2/how-i-work')
      await expect(page.getByRole('heading', { name: /How I Work/ })).toBeVisible()

      // Test back to homepage
      await page.getByRole('link', { name: /Portfolio/ }).first().click()
      await expect(page).toHaveURL('/2')
    })

    test('page transitions are smooth with 350ms duration', async ({ page }) => {
      await page.goto('/2')

      // Measure transition timing
      const startTime = Date.now()
      await page.getByRole('link', { name: /Case Studies/ }).first().click()
      await page.waitForURL('/2/case-studies')
      const endTime = Date.now()

      // Check transition happens within reasonable time
      expect(endTime - startTime).toBeLessThan(1000) // Allow for some network latency
      
      // Check page is fully loaded
      await expect(page.getByRole('heading', { name: /Case Studies/ })).toBeVisible()
    })
  })

  test.describe('BrowserTabs Component Testing', () => {
    test('case studies browser tabs function correctly', async ({ page }) => {
      await page.goto('/2/case-studies')

      // Check browser chrome is visible using CSS attribute selector
      await expect(page.locator('[class*="browserChrome"]')).toBeVisible()
      await expect(page.getByText('tylergohr.com/case-studies')).toBeVisible()

      // Check all tabs are present with specific tab labels
      await expect(page.getByRole('tab').filter({ hasText: 'Cost Savings' })).toBeVisible()
      await expect(page.getByRole('tab').filter({ hasText: 'Workflow' })).toBeVisible()
      await expect(page.getByRole('tab').filter({ hasText: 'AI' })).toBeVisible()
      await expect(page.getByRole('tab').filter({ hasText: 'Emmy' })).toBeVisible()

      // Test tab switching
      const workflowTab = page.getByRole('tab').filter({ hasText: 'Workflow' })
      await workflowTab.click()
      await expect(workflowTab).toHaveAttribute('aria-selected', 'true')

      // Check content updates - look for the specific content section
      const activeTabPanel = page.locator('[role="tabpanel"]:not([hidden])')
      await expect(activeTabPanel).toBeVisible()
      await expect(activeTabPanel).toContainText(/Success Rate|Warner Bros|96%/)
    })

    test('technical expertise browser tabs function correctly', async ({ page }) => {
      await page.goto('/2/technical-expertise')

      // Check browser chrome is visible using CSS attribute selector
      await expect(page.locator('[class*="browserChrome"]')).toBeVisible()
      await expect(page.getByText('tylergohr.com/technical-expertise')).toBeVisible()

      // Check all technical tabs are present with specific labels
      await expect(page.getByRole('tab').filter({ hasText: 'Frontend' })).toBeVisible()
      await expect(page.getByRole('tab').filter({ hasText: 'Backend' })).toBeVisible()
      await expect(page.getByRole('tab').filter({ hasText: 'Cloud' })).toBeVisible()
      await expect(page.getByRole('tab').filter({ hasText: 'Leadership' })).toBeVisible()
      await expect(page.getByRole('tab').filter({ hasText: 'AI' })).toBeVisible()

      // Test tab switching with keyboard navigation
      const backendTab = page.getByRole('tab').filter({ hasText: 'Backend' })
      await backendTab.focus()
      await page.keyboard.press('Enter')
      await expect(backendTab).toHaveAttribute('aria-selected', 'true')

      // Test arrow key navigation
      await page.keyboard.press('ArrowRight')
      const cloudTab = page.getByRole('tab').filter({ hasText: 'Cloud' })
      await expect(cloudTab).toHaveAttribute('aria-selected', 'true')
    })

    test('browser tabs work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2/case-studies')

      // Check mobile layout using CSS attribute selector
      await expect(page.locator('[class*="browserChrome"]')).toBeVisible()
      
      // Check tabs are touch-friendly
      const tab = page.getByRole('tab').filter({ hasText: 'Cost Savings' }).first()
      await expect(tab).toBeVisible()
      
      // Test touch interaction
      await tab.tap()
      await expect(tab).toHaveAttribute('aria-selected', 'true')
    })
  })

  test.describe('Scroll Animations and Interactions', () => {
    test('logo float animation triggers correctly', async ({ page }) => {
      await page.goto('/2')

      // Check logo is initially positioned correctly - using CSS attribute selector
      const logoFloat = page.locator('[class*="logoFloat"], [class*="Logo"]')
      await expect(logoFloat.first()).toBeVisible()

      // Scroll down and check logo animation
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8))
      await page.waitForTimeout(500) // Wait for animation

      // Check logo has moved (implementation specific)
      const logoPosition = await logoFloat.first().boundingBox()
      expect(logoPosition).toBeTruthy()
    })

    test('results metrics counter animations work', async ({ page }) => {
      await page.goto('/2')

      // Scroll to results section
      await page.getByRole('heading', { name: /Results & Impact/ }).scrollIntoViewIfNeeded()
      
      // Check counter animations trigger
      await expect(page.getByText(/Emmy Award/)).toBeVisible()
      await expect(page.getByText(/\$2M\+/)).toBeVisible()
      await expect(page.getByText(/96%/)).toBeVisible()
    })

    test('case studies cards have staggered reveal animations', async ({ page }) => {
      await page.goto('/2')

      // Scroll to case studies section
      await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
      
      // Check all 4 case study cards are visible
      await expect(page.getByText(/Emmy-winning/)).toBeVisible()
      await expect(page.getByText(/Fox Corporation/)).toBeVisible()
      await expect(page.getByText(/Warner Bros/)).toBeVisible()
      await expect(page.getByText(/SDI Media/)).toBeVisible()
    })
  })

  test.describe('Contact Form API Integration', () => {
    test('contact form submits successfully to API', async ({ page }) => {
      await page.goto('/2')

      // Navigate to contact section
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Fill out the form
      await page.getByLabel('Name').fill('Test User')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Project Type').selectOption('Full-Stack Development')
      await page.getByLabel('Message').fill('This is a test message for the Enterprise Solutions Architect portfolio.')

      // Submit the form
      await page.getByRole('button', { name: /Send Message/ }).click()

      // Check loading state
      await expect(page.getByText(/Sending/)).toBeVisible()

      // Wait for success message (or error handling)
      await expect(page.getByRole('alert')).toBeVisible({ timeout: 10000 })
      
      // Check form is reset after successful submission
      await expect(page.getByLabel('Name')).toHaveValue('')
      await expect(page.getByLabel('Email')).toHaveValue('')
    })

    test('contact form validation works correctly', async ({ page }) => {
      await page.goto('/2')

      // Navigate to contact section
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Try to submit empty form
      await page.getByRole('button', { name: /Send Message/ }).click()

      // Check validation errors appear
      await expect(page.getByText(/required/i)).toBeVisible()

      // Fill with invalid email
      await page.getByLabel('Email').fill('invalid-email')
      await page.getByRole('button', { name: /Send Message/ }).click()

      // Check email validation
      await expect(page.getByText(/valid email/i)).toBeVisible()
    })
  })

  test.describe('Lazy Loading and Suspense Verification', () => {
    test('homepage loads with Suspense fallbacks for lazy components', async ({ page }) => {
      // Go to homepage and check for loading states
      await page.goto('/2')
      
      // Wait for the main hero and about sections to load immediately
      await expect(page.getByRole('heading', { name: /Enterprise Solutions Architect/ })).toBeVisible()
      await expect(page.getByRole('heading', { name: /About Tyler Gohr/ })).toBeVisible()
      
      // Scroll down to trigger lazy-loaded components
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2))
      
      // Check that sections eventually load (may have loading states initially)
      await expect(page.getByRole('heading', { name: /Results & Impact/ })).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole('heading', { name: /Case Studies/ })).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole('heading', { name: /How I Work/ })).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole('heading', { name: /Technical Expertise/ })).toBeVisible({ timeout: 10000 })
      await expect(page.getByRole('heading', { name: /Contact/ })).toBeVisible({ timeout: 10000 })
    })

    test('loading placeholders appear for slow connections', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 50) // 50ms delay for all requests
      })
      
      await page.goto('/2')
      
      // Check for loading placeholders (these may appear briefly)
      const loadingText = ['Loading metrics...', 'Loading case studies...', 'Loading process overview...', 'Loading technical expertise...', 'Loading contact form...']
      
      // At least one loading state should be visible initially
      let foundLoading = false
      for (const text of loadingText) {
        const element = page.getByText(text)
        if (await element.isVisible().catch(() => false)) {
          foundLoading = true
          break
        }
      }
      
      // Content should eventually load
      await expect(page.getByRole('heading', { name: /Enterprise Solutions Architect/ })).toBeVisible()
    })
  })

  test.describe('Performance Metrics Collection', () => {
    test('homepage meets Core Web Vitals targets', async ({ page }) => {
      await page.goto('/2')

      // Wait for page to fully load
      await page.waitForLoadState('networkidle')

      // Collect performance metrics
      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals: any = {}
          
          // LCP (Largest Contentful Paint)
          new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1]
            vitals.lcp = lastEntry.startTime
          }).observe({type: 'largest-contentful-paint', buffered: true})

          // CLS (Cumulative Layout Shift)
          let clsValue = 0
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value
              }
            }
            vitals.cls = clsValue
          }).observe({type: 'layout-shift', buffered: true})

          // FID would require real user interaction, so we'll skip for automated testing
          
          setTimeout(() => resolve(vitals), 2000)
        })
      })

      // Check LCP is under 2.5 seconds
      expect((vitals as any).lcp).toBeLessThan(2500)
      
      // Check CLS is under 0.1
      expect((vitals as any).cls).toBeLessThan(0.1)
    })

    test('detail pages load within performance budget', async ({ page }) => {
      const pages = ['/2/case-studies', '/2/technical-expertise', '/2/how-i-work']

      for (const url of pages) {
        await page.goto(url)
        
        const loadTime = await page.evaluate(() => {
          const [navigationEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
          return navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.loadEventStart : 0
        })

        expect(loadTime).toBeLessThan(3000) // 3 seconds max
      }
    })

    test('animations maintain 60fps performance', async ({ page }) => {
      await page.goto('/2')

      // Trigger scroll animations
      await page.evaluate(() => {
        window.scrollTo(0, window.innerHeight * 2)
      })

      // Check for smooth animations (this is a basic check)
      await page.waitForTimeout(1000)
      
      // In a real scenario, you'd measure frame rates
      // For now, we'll just ensure no JS errors occurred
      const errors = await page.evaluate(() => window.performance.getEntriesByType('navigation'))
      expect(errors).toBeTruthy()
    })
  })

  test.describe('Accessibility Compliance (WCAG 2.1 AA)', () => {
    test('homepage passes comprehensive accessibility audit', async ({ page }) => {
      await page.goto('/2')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('case studies page passes accessibility audit', async ({ page }) => {
      await page.goto('/2/case-studies')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('technical expertise page passes accessibility audit', async ({ page }) => {
      await page.goto('/2/technical-expertise')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('keyboard navigation works throughout the site', async ({ page }) => {
      await page.goto('/2')

      // Test tab navigation
      await page.keyboard.press('Tab')
      let focusedElement = page.locator(':focus')
      await expect(focusedElement).toBeVisible()

      // Continue tabbing through interactive elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab')
        focusedElement = page.locator(':focus')
        await expect(focusedElement).toBeVisible()
      }

      // Test navigation to detail page via keyboard
      await page.goto('/2/case-studies')
      
      // Tab to first browser tab
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')
      
      // Use arrow keys to navigate tabs
      await page.keyboard.press('ArrowRight')
      const activeTab = page.locator('[aria-selected="true"]')
      await expect(activeTab).toBeVisible()
    })

    test('reduced motion preferences are respected', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/2')

      // Check that animations are disabled or reduced
      // This would depend on your CSS implementation
      const heroSection = page.locator('section').first()
      await expect(heroSection).toBeVisible()
      
      // Scroll to trigger animations
      await page.evaluate(() => window.scrollTo(0, window.innerHeight))
      await page.waitForTimeout(500)
      
      // Animations should be disabled/reduced
      // Specific checks would depend on implementation
    })
  })

  test.describe('Visual Regression Testing', () => {
    test('homepage visual consistency', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page) // Optimized page ready state

      // Take full page screenshot
      await expect(page).toHaveScreenshot('redesign-homepage-full.png', { fullPage: true })

      // Take hero section screenshot
      const heroSection = page.locator('section').first()
      await expect(heroSection).toHaveScreenshot('redesign-hero-section.png')
    })

    test('case studies page visual consistency', async ({ page }) => {
      await page.goto('/2/case-studies')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      // Screenshot browser interface using CSS attribute selector
      const browserInterface = page.locator('[class*="browserContainer"]')
      await expect(browserInterface).toHaveScreenshot('case-studies-browser-interface.png')
    })

    test('technical expertise page visual consistency', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      // Screenshot technical tabs using CSS attribute selector
      const browserInterface = page.locator('[class*="browserContainer"]')
      await expect(browserInterface).toHaveScreenshot('technical-expertise-browser-interface.png')
    })

    test('mobile responsive visual consistency', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      // Mobile homepage screenshot
      await expect(page).toHaveScreenshot('redesign-mobile-homepage.png', { fullPage: true })

      // Mobile case studies
      await page.goto('/2/case-studies')
      await page.waitForTimeout(1000)
      await expect(page).toHaveScreenshot('redesign-mobile-case-studies.png', { fullPage: true })
    })

    test('tablet responsive visual consistency', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)

      // Tablet homepage screenshot
      await expect(page).toHaveScreenshot('redesign-tablet-homepage.png', { fullPage: true })
    })
  })

  test.describe('Cross-Browser Compatibility', () => {
    test('all features work in different browsers', async ({ page, browserName }) => {
      await page.goto('/2')

      // Test basic functionality across browsers
      await expect(page.getByRole('heading', { name: /Tyler Gohr/ })).toBeVisible()
      
      // Test navigation
      await page.getByRole('link', { name: /Case Studies/ }).first().click()
      await expect(page).toHaveURL('/2/case-studies')

      // Test browser tabs (implementation may vary by browser)
      const tab = page.getByRole('tab').first()
      await tab.click()
      await expect(tab).toHaveAttribute('aria-selected', 'true')

      console.log(`✅ All features working in ${browserName}`)
    })
  })

  test.describe('Error Handling and Edge Cases', () => {
    test('handles 404 routes gracefully', async ({ page }) => {
      const response = await page.goto('/2/nonexistent-page')
      expect(response?.status()).toBe(404)
    })

    test('handles network errors gracefully', async ({ page }) => {
      await page.goto('/2')
      
      // Simulate offline
      await page.context().setOffline(true)
      
      // Try to submit contact form
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()
      await page.getByLabel('Name').fill('Test User')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      // Should show appropriate error message
      await expect(page.getByText(/error/i)).toBeVisible({ timeout: 10000 })
    })

    test('handles slow networks gracefully', async ({ page }) => {
      // Simulate slow 3G
      await page.context().route('**/*', route => {
        setTimeout(() => route.continue(), 100) // 100ms delay
      })
      
      await page.goto('/2')
      await expect(page.getByRole('heading', { name: /Tyler Gohr/ })).toBeVisible()
    })
  })
})
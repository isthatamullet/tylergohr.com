import { test, expect } from '@playwright/test'
import { waitForCounterAnimationsComplete, waitForNetworkAnimationReady, conditionalScreenshot } from './utils/dev-test-helpers'

test.describe('Visual Regression Testing - /2 Redesign', () => {
  
  test.describe('Homepage Component Visual Consistency', () => {
    test('hero section visual consistency across viewports', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000) // Wait for animations to settle
      
      // Desktop viewport
      await page.setViewportSize({ width: 1200, height: 800 })
      const heroSection = page.locator('section').first()
      await expect(heroSection).toHaveScreenshot('hero-section-desktop.png')
      
      // Tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 })
      await page.waitForTimeout(500)
      await expect(heroSection).toHaveScreenshot('hero-section-tablet.png')
      
      // Mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(heroSection).toHaveScreenshot('hero-section-mobile.png')
    })

    test('about section with network animation visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to about section
      await page.getByRole('heading', { name: /About Tyler Gohr/ }).scrollIntoViewIfNeeded()
      await waitForNetworkAnimationReady(page) // Deterministic wait for network animation
      
      const aboutSection = page.locator('#about')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      if (process.env.SKIP_VISUAL !== 'true') {
        await expect(aboutSection).toHaveScreenshot('about-section-desktop.png')
      }
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(100)
      if (process.env.SKIP_VISUAL !== 'true') {
        await expect(aboutSection).toHaveScreenshot('about-section-mobile.png')
      }
    })

    test('results section with animated metrics visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to results section
      await page.getByRole('heading', { name: /Results & Impact/ }).scrollIntoViewIfNeeded()
      await waitForCounterAnimationsComplete(page) // Deterministic wait for counter animations
      
      const resultsSection = page.locator('#results')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      if (process.env.SKIP_VISUAL !== 'true') {
        await expect(resultsSection).toHaveScreenshot('results-section-desktop.png')
      }
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(resultsSection).toHaveScreenshot('results-section-mobile.png')
    })

    test('case studies preview cards visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to case studies section
      await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000) // Wait for card animations
      
      const caseStudiesSection = page.locator('#work')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(caseStudiesSection).toHaveScreenshot('case-studies-section-desktop.png')
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(caseStudiesSection).toHaveScreenshot('case-studies-section-mobile.png')
    })

    test('how i work process steps visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to how i work section
      await page.getByRole('heading', { name: /How I Work/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000) // Wait for staircase animation
      
      const processSection = page.locator('#process')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(processSection).toHaveScreenshot('process-section-desktop.png')
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(processSection).toHaveScreenshot('process-section-mobile.png')
    })

    test('technical expertise glassmorphism cards visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to technical expertise section
      await page.getByRole('heading', { name: /Technical Expertise/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000) // Wait for glassmorphism effects
      
      const skillsSection = page.locator('#skills')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(skillsSection).toHaveScreenshot('skills-section-desktop.png')
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(skillsSection).toHaveScreenshot('skills-section-mobile.png')
    })

    test('contact section dual-column layout visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Scroll to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000) // Wait for form animations
      
      const contactSection = page.locator('#contact')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(contactSection).toHaveScreenshot('contact-section-desktop.png')
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(contactSection).toHaveScreenshot('contact-section-mobile.png')
    })
  })

  test.describe('Navigation Component Visual Consistency', () => {
    test('navigation bar states across scroll positions', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Initial state (top of page)
      const navigation = page.locator('nav')
      await expect(navigation).toHaveScreenshot('navigation-top-desktop.png')
      
      // Scrolled state
      await page.evaluate(() => window.scrollTo(0, 300))
      await page.waitForTimeout(500)
      await expect(navigation).toHaveScreenshot('navigation-scrolled-desktop.png')
      
      // Mobile navigation
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2') // Reset scroll position
      await page.waitForTimeout(500)
      await expect(navigation).toHaveScreenshot('navigation-mobile.png')
      
      // Mobile menu open
      const menuButton = page.getByRole('button', { name: /Open navigation menu/ })
      await menuButton.click()
      await page.waitForTimeout(300)
      const mobileNav = page.locator('#mobile-navigation')
      await expect(mobileNav).toHaveScreenshot('navigation-mobile-open.png')
    })

    test('dropdown menu visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test Work dropdown
      const workButton = page.getByRole('button', { name: /Navigate to Work section/ })
      await workButton.hover()
      await page.waitForTimeout(300)
      
      const workDropdown = page.locator('[class*="dropdownMenu"]').first()
      await expect(workDropdown).toHaveScreenshot('work-dropdown-desktop.png')
      
      // Test Skills dropdown
      await page.locator('body').hover() // Close previous dropdown
      await page.waitForTimeout(100)
      
      const skillsButton = page.getByRole('button', { name: /Navigate to Skills section/ })
      await skillsButton.hover()
      await page.waitForTimeout(300)
      
      const skillsDropdown = page.locator('[class*="dropdownMenu"]').first()
      await expect(skillsDropdown).toHaveScreenshot('skills-dropdown-desktop.png')
      
      // Test Process dropdown
      await page.locator('body').hover() // Close previous dropdown
      await page.waitForTimeout(100)
      
      const processButton = page.getByRole('button', { name: /Navigate to Process section/ })
      await processButton.hover()
      await page.waitForTimeout(300)
      
      const processDropdown = page.locator('[class*="dropdownMenu"]').first()
      await expect(processDropdown).toHaveScreenshot('process-dropdown-desktop.png')
    })
  })

  test.describe('Detail Pages Visual Consistency', () => {
    test('case studies browser tabs interface visual consistency', async ({ page }) => {
      await page.goto('/2/case-studies')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000) // Wait for browser tabs to load
      
      const browserContainer = page.locator('[class*="browserContainer"]')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(browserContainer).toHaveScreenshot('case-studies-browser-desktop.png')
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(browserContainer).toHaveScreenshot('case-studies-browser-mobile.png')
      
      // Test different tab states
      await page.setViewportSize({ width: 1200, height: 800 })
      
      // Click different tabs and capture states
      const tabs = ['Cost Savings', 'Workflow', 'AI', 'Emmy']
      for (const tabName of tabs) {
        const tab = page.getByRole('tab', { name: tabName })
        if (await tab.isVisible()) {
          await tab.click()
          await page.waitForTimeout(500)
          await expect(browserContainer).toHaveScreenshot(`case-studies-tab-${tabName.toLowerCase().replace(' ', '-')}.png`)
        }
      }
    })

    test('technical expertise browser tabs interface visual consistency', async ({ page }) => {
      await page.goto('/2/technical-expertise')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      const browserContainer = page.locator('[class*="browserContainer"]')
      
      // Desktop
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(browserContainer).toHaveScreenshot('technical-expertise-browser-desktop.png')
      
      // Mobile
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(browserContainer).toHaveScreenshot('technical-expertise-browser-mobile.png')
      
      // Test different tab states
      await page.setViewportSize({ width: 1200, height: 800 })
      
      const tabs = ['Frontend', 'Backend', 'Cloud', 'Leadership', 'AI']
      for (const tabName of tabs) {
        const tab = page.getByRole('tab', { name: tabName })
        if (await tab.isVisible()) {
          await tab.click()
          await page.waitForTimeout(500)
          await expect(browserContainer).toHaveScreenshot(`technical-expertise-tab-${tabName.toLowerCase()}.png`)
        }
      }
    })

    test('how i work methodology page visual consistency', async ({ page }) => {
      await page.goto('/2/how-i-work')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      // Full page screenshot
      await page.setViewportSize({ width: 1200, height: 800 })
      await expect(page).toHaveScreenshot('how-i-work-full-desktop.png', { fullPage: true })
      
      // Mobile full page
      await page.setViewportSize({ width: 375, height: 667 })
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot('how-i-work-full-mobile.png', { fullPage: true })
    })
  })

  test.describe('Responsive Design Breakpoints', () => {
    test('visual consistency at critical breakpoints', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(1000)
      
      const breakpoints = [
        { width: 320, height: 568, name: 'mobile-small' },
        { width: 375, height: 667, name: 'mobile-medium' },
        { width: 414, height: 896, name: 'mobile-large' },
        { width: 768, height: 1024, name: 'tablet-portrait' },
        { width: 1024, height: 768, name: 'tablet-landscape' },
        { width: 1200, height: 800, name: 'desktop-small' },
        { width: 1440, height: 900, name: 'desktop-medium' },
        { width: 1920, height: 1080, name: 'desktop-large' }
      ]
      
      for (const breakpoint of breakpoints) {
        await page.setViewportSize({ width: breakpoint.width, height: breakpoint.height })
        await page.waitForTimeout(500) // Wait for responsive layout
        
        // Take full page screenshot at each breakpoint
        await expect(page).toHaveScreenshot(`homepage-${breakpoint.name}.png`, { 
          fullPage: true,
          threshold: 0.3 // Allow some flexibility for font rendering differences
        })
      }
    })

    test('component isolation at different breakpoints', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      const components = [
        { selector: 'nav', name: 'navigation' },
        { selector: '#about', name: 'about-section' },
        { selector: '#results', name: 'results-section' },
        { selector: '#work', name: 'case-studies-section' },
        { selector: '#contact', name: 'contact-section' }
      ]
      
      const viewports = [
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1200, height: 800, name: 'desktop' }
      ]
      
      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
        
        for (const component of components) {
          if (component.selector !== 'nav') {
            // Scroll to component for sections
            await page.locator(component.selector).scrollIntoViewIfNeeded()
            await page.waitForTimeout(1000) // Wait for animations
          }
          
          const element = page.locator(component.selector)
          await expect(element).toHaveScreenshot(`${component.name}-${viewport.name}.png`)
        }
      }
    })
  })

  test.describe('Brand Color Consistency', () => {
    test('section-specific background colors visual verification', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Check each section's brand color implementation
      const sections = [
        { id: '#hero', name: 'hero-black-bg' },
        { id: '#about', name: 'about-dark-grey-bg' },
        { id: '#results', name: 'results-green-bg' },
        { id: '#work', name: 'case-studies-blue-bg' },
        { id: '#process', name: 'how-i-work-pink-bg' },
        { id: '#contact', name: 'contact-yellow-bg' }
      ]
      
      for (const section of sections) {
        await page.locator(section.id).scrollIntoViewIfNeeded()
        await page.waitForTimeout(1000)
        
        const sectionElement = page.locator(section.id)
        await expect(sectionElement).toHaveScreenshot(`${section.name}.png`)
      }
    })
  })

  test.describe('Animation States', () => {
    test('components in loading vs settled states', async ({ page }) => {
      // Test with network delay to capture loading states
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 50) // 50ms delay
      })
      
      await page.goto('/2')
      
      // Try to capture loading state (may be brief)
      await page.waitForTimeout(200)
      const heroSection = page.locator('section').first()
      await expect(heroSection).toHaveScreenshot('hero-loading-state.png')
      
      // Wait for full load and capture settled state
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(2000) // Wait for all animations to complete
      await expect(heroSection).toHaveScreenshot('hero-settled-state.png')
    })

    test('hover states for interactive elements', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Test case study card hover states
      await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      
      const caseStudyCards = page.locator('[class*="case-study-card"], [class*="caseStudyCard"]')
      const cardCount = await caseStudyCards.count()
      
      if (cardCount > 0) {
        const firstCard = caseStudyCards.first()
        
        // Normal state
        await expect(firstCard).toHaveScreenshot('case-study-card-normal.png')
        
        // Hover state
        await firstCard.hover()
        await page.waitForTimeout(300)
        await expect(firstCard).toHaveScreenshot('case-study-card-hover.png')
      }
      
      // Test button hover states
      const buttons = page.locator('button').filter({ hasText: /Start Your Project|View My Work/ })
      const buttonCount = await buttons.count()
      
      if (buttonCount > 0) {
        const firstButton = buttons.first()
        
        // Normal state
        await expect(firstButton).toHaveScreenshot('cta-button-normal.png')
        
        // Hover state
        await firstButton.hover()
        await page.waitForTimeout(300)
        await expect(firstButton).toHaveScreenshot('cta-button-hover.png')
      }
    })
  })

  test.describe('Form States Visual Testing', () => {
    test('contact form states visual consistency', async ({ page }) => {
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      
      // Navigate to contact form
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(1000)
      
      const contactForm = page.locator('[class*="contactForm"]')
      
      // Empty form state
      await expect(contactForm).toHaveScreenshot('contact-form-empty.png')
      
      // Filled form state
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john@example.com')
      await page.getByLabel('Message').fill('This is a test message for visual consistency testing.')
      await expect(contactForm).toHaveScreenshot('contact-form-filled.png')
      
      // Error state
      await page.getByLabel('Email').fill('invalid-email')
      await page.getByLabel('Name').click() // Trigger validation
      await page.waitForTimeout(500)
      await expect(contactForm).toHaveScreenshot('contact-form-error.png')
    })
  })
})
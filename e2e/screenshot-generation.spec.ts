import { test, expect } from '@playwright/test'
import { 
  generateClaudeReviewScreenshots, 
  captureComponentScreenshot,
  waitForPageReady,
  waitForNetworkAnimationReady,
  waitForCounterAnimationsComplete,
  getViewportSize,
  VIEWPORT_SIZES
} from './utils/dev-test-helpers'

/**
 * Screenshot Generation for Visual Review
 * Provides fast screenshot capture for Claude analysis and development workflow
 * Usage: npm run test:e2e:screenshot
 */

test.describe('Screenshot Generation for Claude Review', () => {
  
  test.describe('Full Page Screenshots', () => {
    test('generate comprehensive page screenshots for Claude analysis', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      const outputDir = await generateClaudeReviewScreenshots(page, {
        viewports: ['mobile', 'tablet', 'desktop'],
        sections: ['hero', 'about', 'results', 'case-studies', 'contact']
      })
      
      console.log(`📸 Full page screenshots ready for Claude review: ${outputDir}`)
    })

    test('generate mobile-focused screenshots', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Mobile viewport only
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.waitForTimeout(200) // Brief settle
      
      await page.screenshot({ 
        path: 'screenshots/claude-review/mobile-focus/full-page-mobile.png',
        fullPage: true 
      })
      
      console.log('📱 Mobile-focused screenshot generated')
    })

    test('generate desktop-focused screenshots', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Desktop viewport
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.waitForTimeout(200) // Brief settle
      
      await page.screenshot({ 
        path: 'screenshots/claude-review/desktop-focus/full-page-desktop.png',
        fullPage: true 
      })
      
      console.log('🖥️ Desktop-focused screenshot generated')
    })
  })

  test.describe('Section-Specific Screenshots', () => {
    test('hero section screenshots', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Mobile hero
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.waitForTimeout(100)
      
      const heroSection = page.locator('#hero, [data-section="hero"], [class*="hero"]').first()
      if (await heroSection.count() > 0) {
        await heroSection.screenshot({ 
          path: 'screenshots/sections/hero-mobile.png' 
        })
      }
      
      // Desktop hero
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.waitForTimeout(100)
      
      if (await heroSection.count() > 0) {
        await heroSection.screenshot({ 
          path: 'screenshots/sections/hero-desktop.png' 
        })
      }
      
      console.log('🦸 Hero section screenshots generated')
    })

    test('about section with network animation', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Scroll to about section
      await page.getByRole('heading', { name: /About/ }).scrollIntoViewIfNeeded()
      
      // Wait for network animation to be ready
      await waitForNetworkAnimationReady(page)
      
      const aboutSection = page.locator('#about, [data-section="about"], [class*="about"]').first()
      
      // Mobile about
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.waitForTimeout(100)
      
      if (await aboutSection.count() > 0) {
        await aboutSection.screenshot({ 
          path: 'screenshots/sections/about-mobile.png' 
        })
      }
      
      // Desktop about
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.waitForTimeout(100)
      
      if (await aboutSection.count() > 0) {
        await aboutSection.screenshot({ 
          path: 'screenshots/sections/about-desktop.png' 
        })
      }
      
      console.log('ℹ️ About section screenshots generated')
    })

    test('results section with animated metrics', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Scroll to results section
      await page.getByRole('heading', { name: /Results/ }).scrollIntoViewIfNeeded()
      
      // Wait for counter animations
      await waitForCounterAnimationsComplete(page)
      
      const resultsSection = page.locator('#results, [data-section="results"], [class*="results"]').first()
      
      if (await resultsSection.count() > 0) {
        await resultsSection.screenshot({ 
          path: 'screenshots/sections/results-desktop.png' 
        })
      }
      
      console.log('📊 Results section screenshot generated')
    })

    test('contact section screenshots', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Scroll to contact section
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      
      const contactSection = page.locator('#contact, [data-section="contact"], [class*="contact"]').first()
      
      // Mobile contact
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.waitForTimeout(100)
      
      if (await contactSection.count() > 0) {
        await contactSection.screenshot({ 
          path: 'screenshots/sections/contact-mobile.png' 
        })
      }
      
      // Desktop contact
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.waitForTimeout(100)
      
      if (await contactSection.count() > 0) {
        await contactSection.screenshot({ 
          path: 'screenshots/sections/contact-desktop.png' 
        })
      }
      
      console.log('📧 Contact section screenshots generated')
    })
  })

  test.describe('Component-Specific Screenshots', () => {
    test('navigation component screenshots', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Navigation at top
      const navigation = page.locator('nav, [role="navigation"], [class*="nav"]').first()
      
      if (await navigation.count() > 0) {
        await navigation.screenshot({ 
          path: 'screenshots/components/navigation-top.png' 
        })
      }
      
      // Scroll down to see navigation in scrolled state
      await page.getByRole('heading', { name: /Results/ }).scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
      
      if (await navigation.count() > 0) {
        await navigation.screenshot({ 
          path: 'screenshots/components/navigation-scrolled.png' 
        })
      }
      
      console.log('🧭 Navigation component screenshots generated')
    })

    test('browser tabs component screenshots', async ({ page }) => {
      await page.goto('/2/case-studies')
      await waitForPageReady(page)
      
      // Look for browser tabs component
      const browserTabs = page.locator('[class*="browserTabs"], [class*="browserChrome"], [data-testid*="browser"]').first()
      
      if (await browserTabs.count() > 0) {
        await browserTabs.screenshot({ 
          path: 'screenshots/components/browser-tabs-desktop.png' 
        })
        
        // Mobile version
        await page.setViewportSize(VIEWPORT_SIZES.mobile)
        await page.waitForTimeout(100)
        
        await browserTabs.screenshot({ 
          path: 'screenshots/components/browser-tabs-mobile.png' 
        })
      }
      
      console.log('🖥️ Browser tabs component screenshots generated')
    })

    test('metrics cards screenshots', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Scroll to results section
      await page.getByRole('heading', { name: /Results/ }).scrollIntoViewIfNeeded()
      await waitForCounterAnimationsComplete(page)
      
      // Look for metrics/cards
      const metricsCards = page.locator('[class*="metric"], [class*="card"], [data-testid*="metric"]')
      
      if (await metricsCards.count() > 0) {
        await metricsCards.first().screenshot({ 
          path: 'screenshots/components/metrics-cards.png' 
        })
      }
      
      console.log('📈 Metrics cards screenshots generated')
    })
  })

  test.describe('State-Specific Screenshots', () => {
    test('mobile navigation menu open state', async ({ page }) => {
      await page.goto('/2')
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await waitForPageReady(page)
      
      // Try to open mobile menu
      const menuButton = page.locator('button[aria-label*="menu"], button[class*="hamburger"], [data-testid*="menu"]').first()
      
      if (await menuButton.count() > 0) {
        await menuButton.click()
        await page.waitForTimeout(300) // Menu animation
        
        await page.screenshot({ 
          path: 'screenshots/states/mobile-menu-open.png' 
        })
      }
      
      console.log('📱 Mobile menu open state screenshot generated')
    })

    test('form focus states', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Scroll to contact form
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()
      
      // Focus on form fields
      const nameField = page.locator('input[name="name"], input[placeholder*="name"]').first()
      
      if (await nameField.count() > 0) {
        await nameField.focus()
        await page.waitForTimeout(200)
        
        const contactSection = page.locator('#contact, [data-section="contact"], [class*="contact"]').first()
        if (await contactSection.count() > 0) {
          await contactSection.screenshot({ 
            path: 'screenshots/states/contact-form-focused.png' 
          })
        }
      }
      
      console.log('📝 Form focus state screenshot generated')
    })
  })

  test.describe('Quick Preview Generation', () => {
    test('generate quick preview for pre-commit review', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      // Quick mobile preview
      await page.setViewportSize(VIEWPORT_SIZES.mobile)
      await page.waitForTimeout(100)
      await page.screenshot({ 
        path: 'screenshots/preview/mobile-preview.png',
        fullPage: true 
      })
      
      // Quick desktop preview
      await page.setViewportSize(VIEWPORT_SIZES.desktop)
      await page.waitForTimeout(100)
      await page.screenshot({ 
        path: 'screenshots/preview/desktop-preview.png',
        fullPage: true 
      })
      
      console.log('⚡ Quick preview screenshots generated for pre-commit review')
    })
  })

  test.describe('Responsive Comparison Screenshots', () => {
    test('generate cross-viewport comparison set', async ({ page }) => {
      await page.goto('/2')
      await waitForPageReady(page)
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      
      // Generate same view across all viewports
      for (const [name, size] of Object.entries(VIEWPORT_SIZES)) {
        await page.setViewportSize(size)
        await page.waitForTimeout(100)
        
        await page.screenshot({ 
          path: `screenshots/responsive/${timestamp}/homepage-${name}.png`,
          fullPage: true 
        })
      }
      
      console.log(`📱💻 Responsive comparison set generated: screenshots/responsive/${timestamp}/`)
    })
  })
})

/**
 * Development helper test - can be run standalone for quick screenshots
 */
test.describe('Quick Development Screenshots', () => {
  test('current state capture for Claude review', async ({ page }) => {
    await page.goto('/2')
    await waitForPageReady(page)
    
    // Single comprehensive screenshot for immediate Claude review
    await page.setViewportSize(VIEWPORT_SIZES.desktop)
    await page.screenshot({ 
      path: 'screenshots/claude-review/current-state.png',
      fullPage: true 
    })
    
    console.log('📸 Current state captured for Claude review: screenshots/claude-review/current-state.png')
  })
})
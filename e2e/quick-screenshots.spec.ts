import { test } from '@playwright/test'

/**
 * Quick Screenshots for Visual Review
 * Purpose: Fast, reliable screenshot generation for immediate visual review
 * Usage: npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
 */

test.describe('Quick Screenshots for Visual Review', () => {
  const pages = [
    { route: '/2', name: 'homepage' },
    { route: '/2/case-studies', name: 'case-studies' },
    { route: '/2/how-i-work', name: 'how-i-work' },
    { route: '/2/technical-expertise', name: 'technical-expertise' }
  ]
  
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1200, height: 800 }
  ]

  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} - ${viewport.name}`, async ({ page: browserPage }) => {
        // Set viewport
        await browserPage.setViewportSize(viewport)
        
        // Navigate to page
        await browserPage.goto(page.route)
        
        // Wait for page to be ready (simplified waiting)
        await browserPage.waitForLoadState('networkidle')
        await browserPage.waitForTimeout(1000) // Brief settle time
        
        // Take screenshot
        const filename = `${page.name}-${viewport.name}.png`
        await browserPage.screenshot({ 
          path: `screenshots/quick-review/${filename}`,
          fullPage: true 
        })
        
        console.log(`📸 Quick screenshot saved: ${filename}`)
      })
    }
  }
})

/**
 * Single Page Quick Screenshots
 * For when you only need specific pages
 */
test.describe('Single Page Screenshots', () => {
  test('homepage only - both viewports', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'desktop', width: 1200, height: 800 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('/2')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
      
      await page.screenshot({ 
        path: `screenshots/quick-review/homepage-${viewport.name}.png`,
        fullPage: true 
      })
    }
  })

  test('case studies only - both viewports', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'desktop', width: 1200, height: 800 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('/2/case-studies')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
      
      await page.screenshot({ 
        path: `screenshots/quick-review/case-studies-${viewport.name}.png`,
        fullPage: true 
      })
    }
  })

  test('how i work only - both viewports', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'desktop', width: 1200, height: 800 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('/2/how-i-work')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
      
      await page.screenshot({ 
        path: `screenshots/quick-review/how-i-work-${viewport.name}.png`,
        fullPage: true 
      })
    }
  })

  test('technical expertise only - both viewports', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'desktop', width: 1200, height: 800 }
    ]

    for (const viewport of viewports) {
      await page.setViewportSize(viewport)
      await page.goto('/2/technical-expertise')
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)
      
      await page.screenshot({ 
        path: `screenshots/quick-review/technical-expertise-${viewport.name}.png`,
        fullPage: true 
      })
    }
  })
})
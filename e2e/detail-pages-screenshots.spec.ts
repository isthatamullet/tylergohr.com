import { test } from '@playwright/test'

/**
 * Simple screenshot capture for the 3 /2 detail pages
 * Purpose: Generate visual references for Claude analysis
 */

test.describe('Detail Pages Screenshots - Visual Review', () => {
  const detailPages = [
    { route: '/2/case-studies', name: 'case-studies' },
    { route: '/2/how-i-work', name: 'how-i-work' },
    { route: '/2/technical-expertise', name: 'technical-expertise' }
  ]

  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1200, height: 800 }
  ]

  for (const page of detailPages) {
    for (const viewport of viewports) {
      test(`${page.name} - ${viewport.name} screenshot`, async ({ page: browserPage }) => {
        // Set viewport
        await browserPage.setViewportSize({ width: viewport.width, height: viewport.height })
        
        // Navigate to page
        await browserPage.goto(page.route)
        
        // Wait for page to be ready
        await browserPage.waitForLoadState('networkidle')
        await browserPage.waitForTimeout(1000) // Brief settle time
        
        // Take screenshot
        await browserPage.screenshot({ 
          path: `screenshots/detail-pages/${page.name}-${viewport.name}.png`,
          fullPage: true 
        })
        
        console.log(`📸 Screenshot saved: ${page.name}-${viewport.name}.png`)
      })
    }
  }
})
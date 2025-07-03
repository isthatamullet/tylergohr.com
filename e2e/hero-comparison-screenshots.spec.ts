import { test } from '@playwright/test'

/**
 * Hero Section Comparison Screenshots
 * Purpose: Capture just the nav and hero sections for visual comparison
 */

test.describe('Hero Section Comparison Screenshots', () => {
  const pages = [
    { route: '/2/case-studies', name: 'case-studies' },
    { route: '/2/how-i-work', name: 'how-i-work' }
  ]
  
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'desktop', width: 1200, height: 800 }
  ]

  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} hero section - ${viewport.name}`, async ({ page: browserPage }) => {
        // Set viewport
        await browserPage.setViewportSize(viewport)
        
        // Navigate to page
        await browserPage.goto(page.route, { waitUntil: 'networkidle' })
        
        // Wait for page transition and hero content to load
        await browserPage.waitForTimeout(2000)
        
        // Wait for hero section to be visible
        await browserPage.waitForSelector('section', { state: 'visible' })
        
        // Take a cropped screenshot of just the hero area
        // Height of 400px should capture nav + hero on both mobile and desktop
        const screenshotHeight = viewport.name === 'mobile' ? 350 : 500
        
        await browserPage.screenshot({
          path: `screenshots/hero-comparison/${page.name}-hero-${viewport.name}.png`,
          clip: {
            x: 0,
            y: 0,
            width: viewport.width,
            height: screenshotHeight
          }
        })
        
        console.log(`📸 Hero screenshot saved: ${page.name}-hero-${viewport.name}.png`)
      })
    }
  }
})
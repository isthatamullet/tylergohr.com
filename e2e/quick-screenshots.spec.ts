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
        await browserPage.goto(page.route, { waitUntil: 'networkidle' })
        
        // CRITICAL: Wait for Framer Motion page transition to complete
        // The template.tsx uses duration: 0.35s, so wait for animation + buffer
        await browserPage.waitForTimeout(2000); // Extended wait for animation + lazy components
        
        // Ensure main content and footer are visible
        // Detail pages use sections instead of main elements
        await browserPage.waitForSelector('section, main', { state: 'visible' });
        await browserPage.waitForSelector('footer', { state: 'visible', timeout: 5000 });
        
        // Take screenshot without disabling animations since they should be complete
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
      await page.goto('/2', { waitUntil: 'networkidle' })
      
      // Wait for Framer Motion page transition and lazy components
      await page.waitForTimeout(2000);
      await page.waitForSelector('section, main', { state: 'visible' });
      await page.waitForSelector('footer', { state: 'visible', timeout: 5000 });
      
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
      await page.goto('/2/case-studies', { waitUntil: 'networkidle' })
      
      // Wait for Framer Motion page transition and lazy components
      await page.waitForTimeout(2000);
      await page.waitForSelector('section, main', { state: 'visible' });
      await page.waitForSelector('footer', { state: 'visible', timeout: 5000 });
      
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
      await page.goto('/2/how-i-work', { waitUntil: 'networkidle' })
      
      // Wait for Framer Motion page transition and lazy components
      await page.waitForTimeout(2000);
      await page.waitForSelector('section, main', { state: 'visible' });
      await page.waitForSelector('footer', { state: 'visible', timeout: 5000 });
      
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
      await page.goto('/2/technical-expertise', { waitUntil: 'networkidle' })
      
      // Wait for Framer Motion page transition and lazy components
      await page.waitForTimeout(2000);
      await page.waitForSelector('section, main', { state: 'visible' });
      await page.waitForSelector('footer', { state: 'visible', timeout: 5000 });
      
      await page.screenshot({ 
        path: `screenshots/quick-review/technical-expertise-${viewport.name}.png`,
        fullPage: true
      })
    }
  })
})
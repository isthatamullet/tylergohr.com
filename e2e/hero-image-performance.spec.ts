import { test, expect } from '@playwright/test'

test.describe('Hero Image Performance Analysis', () => {
  
  test('measure hero image load times and sizes', async ({ page }) => {
    // Start measuring from page load
    const startTime = Date.now()
    
    // Go to /2 page
    await page.goto('/2')
    
    // Wait for hero images to load
    await page.waitForLoadState('networkidle')
    
    // Collect detailed image loading metrics
    const imageMetrics = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      const heroImages = resources.filter(entry => 
        entry.name.includes('hero-') && 
        (entry.name.includes('.png') || entry.name.includes('.webp') || entry.name.includes('.jpg'))
      )
      
      return heroImages.map(entry => ({
        name: entry.name.split('/').pop(),
        url: entry.name,
        loadTime: Math.round(entry.responseEnd - entry.responseStart),
        downloadTime: Math.round(entry.responseEnd - entry.responseStart),
        transferSize: entry.transferSize,
        decodedBodySize: entry.decodedBodySize,
        startTime: Math.round(entry.startTime),
        fetchStart: Math.round(entry.fetchStart),
        responseEnd: Math.round(entry.responseEnd)
      }))
    })
    
    // Check that we found hero images
    expect(imageMetrics.length).toBeGreaterThan(0)
    
    // Log detailed metrics for analysis
    console.log('\n🖼️ Hero Image Performance Metrics:')
    console.log('='.repeat(50))
    
    let totalTransferSize = 0
    let maxLoadTime = 0
    
    imageMetrics.forEach(img => {
      console.log(`\n📸 ${img.name}:`)
      console.log(`  • Load Time: ${img.loadTime}ms`)
      console.log(`  • Download Time: ${img.downloadTime}ms`) 
      console.log(`  • Transfer Size: ${(img.transferSize / 1024).toFixed(1)}KB`)
      console.log(`  • Decoded Size: ${(img.decodedBodySize / 1024).toFixed(1)}KB`)
      console.log(`  • Start Time: ${img.startTime}ms`)
      
      totalTransferSize += img.transferSize
      maxLoadTime = Math.max(maxLoadTime, img.loadTime)
    })
    
    console.log(`\n📊 Summary:`)
    console.log(`  • Total Transfer Size: ${(totalTransferSize / 1024).toFixed(1)}KB`)
    console.log(`  • Slowest Image Load: ${maxLoadTime}ms`)
    console.log(`  • Number of Hero Images: ${imageMetrics.length}`)
    
    // Performance assertions
    const mainHeroImage = imageMetrics.find(img => img.name?.includes('hero-main'))
    if (mainHeroImage) {
      console.log(`\n🎯 Main Hero Image (${mainHeroImage.name}):`)
      console.log(`  • Size: ${(mainHeroImage.transferSize / 1024).toFixed(1)}KB`)
      console.log(`  • Load Time: ${mainHeroImage.loadTime}ms`)
      
      // Target: main hero should load in under 1 second
      expect(mainHeroImage.loadTime).toBeLessThan(1000)
      
      // Target: main hero should be under 500KB
      expect(mainHeroImage.transferSize).toBeLessThan(500 * 1024)
    }
    
    // Overall performance targets
    expect(totalTransferSize).toBeLessThan(600 * 1024) // Total under 600KB
    expect(maxLoadTime).toBeLessThan(1500) // No image takes longer than 1.5s
  })

  test('measure Largest Contentful Paint (LCP) with hero image', async ({ page }) => {
    await page.goto('/2')
    
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle')
    
    // Measure LCP specifically
    const lcpMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let lcpValue = 0
        let lcpElement = ''
        
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          if (lastEntry) {
            lcpValue = lastEntry.startTime
            lcpElement = lastEntry.element?.tagName || 'unknown'
          }
        }).observe({type: 'largest-contentful-paint', buffered: true})
        
        setTimeout(() => resolve({ lcp: lcpValue, element: lcpElement }), 2000)
      })
    })
    
    console.log(`\n⚡ LCP Metrics:`)
    console.log(`  • LCP Time: ${(lcpMetrics as any).lcp}ms`)
    console.log(`  • LCP Element: ${(lcpMetrics as any).element}`)
    
    // Target: LCP should be under 2.5 seconds (2500ms)
    expect((lcpMetrics as any).lcp).toBeLessThan(2500)
  })

  test('verify hero images are properly prioritized', async ({ page }) => {
    await page.goto('/2')
    
    // Check that the main hero image has priority attribute
    const heroImage = page.locator('img[src*="hero-main"]')
    await expect(heroImage).toBeVisible()
    
    // Verify priority is set (this affects loading order)
    const hasPriority = await heroImage.evaluate(img => img.hasAttribute('priority') || img.getAttribute('loading') === 'eager')
    expect(hasPriority).toBeTruthy()
  })
  
  test('analyze image compression opportunities', async ({ page }) => {
    await page.goto('/2')
    await page.waitForLoadState('networkidle')
    
    const compressionAnalysis = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      const heroImages = resources.filter(entry => 
        entry.name.includes('hero-') && entry.name.includes('.png')
      )
      
      return heroImages.map(entry => {
        const compressionRatio = entry.decodedBodySize / entry.transferSize
        return {
          name: entry.name.split('/').pop(),
          transferSize: entry.transferSize,
          decodedSize: entry.decodedBodySize,
          compressionRatio: compressionRatio,
          potentialWebPSavings: Math.round(entry.transferSize * 0.3) // Estimated 30% WebP savings
        }
      })
    })
    
    console.log(`\n🗜️ Compression Analysis:`)
    compressionAnalysis.forEach(img => {
      console.log(`\n${img.name}:`)
      console.log(`  • Current Size: ${(img.transferSize / 1024).toFixed(1)}KB`)
      console.log(`  • Compression Ratio: ${img.compressionRatio.toFixed(2)}x`)
      console.log(`  • Potential WebP Savings: ~${(img.potentialWebPSavings / 1024).toFixed(1)}KB`)
    })
  })
})
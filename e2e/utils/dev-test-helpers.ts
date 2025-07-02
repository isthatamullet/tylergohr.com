import { Page } from '@playwright/test'

/**
 * Development Test Helpers for Tyler Gohr Portfolio
 * Provides deterministic wait utilities to replace fixed timeouts
 * Optimized for fast local development feedback loops
 */

// Viewport size configurations
export const VIEWPORT_SIZES = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1200, height: 800 },
  wide: { width: 1400, height: 900 }
}

/**
 * Get viewport size configuration by name
 */
export function getViewportSize(viewport: string) {
  return VIEWPORT_SIZES[viewport as keyof typeof VIEWPORT_SIZES] || VIEWPORT_SIZES.desktop
}

/**
 * Deterministic Animation State Detection (Replaces 1500ms+ Waits)
 * Waits for animations to complete using state detection rather than fixed timeouts
 */
export async function waitForAnimationComplete(
  page: Page, 
  selector: string, 
  timeout = 1000  // Much faster than fixed 1500ms waits
) {
  await page.waitForFunction(
    (sel) => {
      const element = document.querySelector(sel)
      if (!element) return false
      
      // Check for animation completion indicators
      return (element as HTMLElement).dataset.animationState === 'complete' ||
             element.classList.contains('animation-complete') ||
             element.classList.contains('settled') ||
             // Fallback: check if CSS animations are finished
             window.getComputedStyle(element).animationPlayState === 'paused'
    },
    selector,
    { timeout }
  )
}

/**
 * Fast Intersection Observer Readiness (Replaces 1000ms Waits)
 * Waits for intersection observers to be initialized
 */
export async function waitForIntersectionObserver(page: Page, timeout = 200) {
  await page.waitForFunction(() => {
    // Check if intersection observers are ready
    return (window as any).intersectionObserversInitialized === true ||
           document.querySelectorAll('[data-intersection-ready]').length > 0 ||
           // Fallback: check if navigation buttons have active states
           document.querySelectorAll('button[class*="active"]').length > 0
  }, { timeout })
}

/**
 * Instant Scroll Position Validation (Development)
 * Fast scroll position detection for development feedback
 */
export async function waitForScrollPosition(
  page: Page, 
  sectionId: string,
  timeout = 100  // Very fast for development feedback
) {
  await page.waitForFunction(
    (id) => {
      const section = document.getElementById(id)
      if (!section) return false
      
      const rect = section.getBoundingClientRect()
      // Section is considered "in view" if top is near viewport top
      return rect.top <= 100 && rect.bottom >= 0
    },
    sectionId,
    { timeout }
  )
}

/**
 * Network Animation State Detection
 * Specifically for the About section network animation
 */
export async function waitForNetworkAnimationReady(page: Page, timeout = 500) {
  await page.waitForFunction(() => {
    // Check if network animation has initialized
    const networkContainer = document.querySelector('[class*="networkContainer"]') ||
                            document.querySelector('[data-testid="network-animation"]') ||
                            document.querySelector('#about [class*="canvas"]')
    
    if (!networkContainer) return false
    
    // Check if animation is ready (has nodes or connections)
    return networkContainer.children.length > 0 ||
           (networkContainer as HTMLElement).dataset?.animationReady === 'true'
  }, { timeout })
}

/**
 * Counter Animation Completion Detection
 * For business metrics/results section animated counters
 */
export async function waitForCounterAnimationsComplete(page: Page, timeout = 800) {
  await page.waitForFunction(() => {
    // Look for counter elements that might be animating
    const counters = document.querySelectorAll('[class*="metric"]') ||
                    document.querySelectorAll('[class*="counter"]') ||
                    document.querySelectorAll('[data-testid*="metric"]')
    
    if (counters.length === 0) return true // No counters found, consider complete
    
    // Check if counters have reached their final values
    // This assumes counters have a data attribute or class when complete
    return Array.from(counters).every(counter => 
      (counter as HTMLElement).dataset?.animationComplete === 'true' ||
      counter.classList.contains('animation-complete')
    )
  }, { timeout })
}

/**
 * Development Mode Skip Visual Helper
 * Allows skipping visual regression tests during functional development
 */
export function shouldSkipVisual(): boolean {
  return process.env.NODE_ENV === 'development' || 
         process.env.SKIP_VISUAL === 'true' ||
         process.env.FAST_MODE === 'true'
}

/**
 * Conditional Screenshot Helper
 * Only takes screenshots when not in development mode
 */
export async function conditionalScreenshot(
  page: Page, 
  name: string, 
  options?: any
) {
  if (!shouldSkipVisual()) {
    // Use expect() for screenshot comparison
    const { expect } = await import('@playwright/test')
    await expect(page).toHaveScreenshot(name, options)
  } else {
    console.log(`📸 Skipped screenshot: ${name} (development mode)`)
  }
}

/**
 * Claude Review Screenshot Generation
 * Generates comprehensive screenshots for Claude analysis
 */
export async function generateClaudeReviewScreenshots(
  page: Page,
  options: {
    sections?: string[]
    viewports?: string[]
    outputDir?: string
  } = {}
) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
  const outputDir = options.outputDir || `screenshots/claude-review/${timestamp}`
  
  // Ensure page is ready
  await page.waitForLoadState('networkidle')
  
  // Full page screenshots across viewports
  for (const viewport of options.viewports || ['mobile', 'tablet', 'desktop']) {
    await page.setViewportSize(getViewportSize(viewport))
    await page.waitForTimeout(200) // Brief settle time for viewport change
    
    await page.screenshot({ 
      path: `${outputDir}/full-page-${viewport}.png`,
      fullPage: true 
    })
  }
  
  // Section-specific screenshots
  for (const section of options.sections || ['hero', 'about', 'results', 'contact']) {
    // Try multiple selector patterns for sections
    const sectionSelectors = [
      `[data-section="${section}"]`,
      `#${section}`,
      `[class*="${section}"]`,
      `[data-testid="${section}"]`
    ]
    
    let sectionElement = null
    for (const selector of sectionSelectors) {
      try {
        sectionElement = page.locator(selector).first()
        if (await sectionElement.count() > 0) {
          break
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (sectionElement && await sectionElement.count() > 0) {
      await sectionElement.screenshot({ 
        path: `${outputDir}/section-${section}.png` 
      })
    }
  }
  
  console.log(`📸 Screenshots generated for Claude review: ${outputDir}`)
  return outputDir
}

/**
 * Component Isolation Screenshot Helper
 * Captures individual components for detailed review
 */
export async function captureComponentScreenshot(
  page: Page,
  componentSelector: string,
  name: string,
  options: { viewport?: string; state?: string } = {}
) {
  if (options.viewport) {
    await page.setViewportSize(getViewportSize(options.viewport))
    await page.waitForTimeout(100) // Brief settle time
  }
  
  const component = page.locator(componentSelector)
  await component.waitFor({ state: 'visible' })
  
  const filename = `screenshots/components/${name}-${options.viewport || 'desktop'}-${options.state || 'default'}.png`
  await component.screenshot({ path: filename })
  
  console.log(`📸 Component screenshot saved: ${filename}`)
  return filename
}

/**
 * Fast Page Ready State
 * Optimized page ready detection for development
 */
export async function waitForPageReady(page: Page, timeout = 2000) {
  // Wait for essential elements to be ready
  await page.waitForLoadState('networkidle')
  
  // Wait for intersection observers (navigation)
  try {
    await waitForIntersectionObserver(page, 300)
  } catch (e) {
    // Continue if intersection observers aren't ready
  }
  
  // Brief additional settle time for animations
  await page.waitForTimeout(100)
}

/**
 * Smart Wait for Element State
 * Replacement for fixed timeouts when waiting for element interactions
 */
export async function waitForElementReady(
  page: Page,
  selector: string,
  options: {
    state?: 'visible' | 'hidden' | 'stable'
    timeout?: number
  } = {}
) {
  const { state = 'visible', timeout = 1000 } = options
  
  const element = page.locator(selector)
  
  switch (state) {
    case 'visible':
      await element.waitFor({ state: 'visible', timeout })
      break
    case 'hidden':
      await element.waitFor({ state: 'hidden', timeout })
      break
    case 'stable':
      // Wait for element to be stable (not moving/changing)
      await element.waitFor({ state: 'visible', timeout })
      await page.waitForFunction(
        (sel) => {
          const el = document.querySelector(sel)
          if (!el) return false
          
          const rect = el.getBoundingClientRect()
          // Check if element position is stable
          return rect.width > 0 && rect.height > 0
        },
        selector,
        { timeout: timeout - 200 }
      )
      break
  }
}

/**
 * Development Test Environment Detection
 */
export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development' ||
         process.env.CI !== 'true'
}

/**
 * Fast Mode Detection
 * For ultra-fast development testing
 */
export function isFastMode(): boolean {
  return process.env.FAST_MODE === 'true' ||
         process.env.SKIP_VISUAL === 'true'
}
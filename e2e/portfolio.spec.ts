import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Portfolio E2E Tests', () => {
  test('homepage loads correctly and displays hero section', async ({ page }) => {
    await page.goto('/')

    // Check hero title
    await expect(page.getByRole('heading', { name: 'Tyler Gohr' })).toBeVisible()
    
    // Check hero subtitle
    await expect(page.getByText('Full-Stack Developer & Creative Problem Solver')).toBeVisible()
    
    // Check hero description
    await expect(page.getByText(/Crafting innovative digital experiences/)).toBeVisible()
  })

  test('navigation and section visibility', async ({ page }) => {
    await page.goto('/')

    // Check all main sections are present
    await expect(page.getByRole('heading', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Technical Expertise' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Featured Projects' })).toBeVisible()
    await expect(page.getByRole('heading', { name: "Let's Connect" })).toBeVisible()
  })

  test('skills section interactivity', async ({ page }) => {
    await page.goto('/')

    // Navigate to skills section
    await page.getByRole('heading', { name: 'Technical Expertise' }).scrollIntoViewIfNeeded()

    // Check default tab (Frontend) is active
    const frontendTab = page.getByRole('tab', { name: /Frontend/ })
    await expect(frontendTab).toHaveAttribute('aria-selected', 'true')

    // Click on Backend tab
    const backendTab = page.getByRole('tab', { name: /Backend/ })
    await backendTab.click()

    // Check Backend tab is now active
    await expect(backendTab).toHaveAttribute('aria-selected', 'true')
    await expect(frontendTab).toHaveAttribute('aria-selected', 'false')

    // Check skills content updates
    await expect(page.getByText('Node.js')).toBeVisible()
  })

  test('contact form functionality', async ({ page }) => {
    await page.goto('/')

    // Navigate to contact section
    await page.getByRole('heading', { name: "Let's Connect" }).scrollIntoViewIfNeeded()

    // Fill out the form
    await page.getByLabel('Name').fill('Test User')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Subject').selectOption('project-inquiry')
    await page.getByLabel('Message').fill('This is a test message for the portfolio contact form.')

    // Submit the form
    await page.getByRole('button', { name: 'Send Message' }).click()

    // Check loading state
    await expect(page.getByText('Sending...')).toBeVisible()

    // Wait for success message
    await expect(page.getByRole('alert')).toContainText('Message sent successfully!')

    // Check form is reset
    await expect(page.getByLabel('Name')).toHaveValue('')
    await expect(page.getByLabel('Email')).toHaveValue('')
  })

  test('project showcase interaction', async ({ page }) => {
    await page.goto('/')

    // Navigate to projects section
    await page.getByRole('heading', { name: 'Featured Projects' }).scrollIntoViewIfNeeded()

    // Check for project cards
    const projectCards = page.locator('[data-testid="project-card"]').or(page.getByText('Invoice Chaser'))
    await expect(projectCards.first()).toBeVisible()

    // Click on a project (if interactive)
    if (await projectCards.first().isVisible()) {
      await projectCards.first().click()
      
      // Wait for project deep dive or modal to appear
      // This depends on your implementation
      await page.waitForTimeout(1000)
    }
  })

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Check hero section is visible on mobile
    await expect(page.getByRole('heading', { name: 'Tyler Gohr' })).toBeVisible()

    // Check mobile navigation (if applicable)
    // This would depend on if you have a mobile menu

    // Check contact form is usable on mobile
    await page.getByRole('heading', { name: "Let's Connect" }).scrollIntoViewIfNeeded()
    await expect(page.getByLabel('Name')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
  })

  test('keyboard navigation', async ({ page }) => {
    await page.goto('/')

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    
    // Check focus is visible on interactive elements
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()

    // Continue tabbing to verify focus management
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check that focus moves logically through the page
    await expect(page.locator(':focus')).toBeVisible()
  })

  test('external links open correctly', async ({ page, context }) => {
    await page.goto('/')

    // Navigate to contact section
    await page.getByRole('heading', { name: "Let's Connect" }).scrollIntoViewIfNeeded()

    // Check GitHub link
    const githubLink = page.getByRole('link', { name: /GitHub/ })
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/isthatamullet')
    await expect(githubLink).toHaveAttribute('target', '_blank')

    // Check LinkedIn link
    const linkedinLink = page.getByRole('link', { name: /LinkedIn/ })
    await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/tyler-gohr')
    await expect(linkedinLink).toHaveAttribute('target', '_blank')
  })

  test('page performance metrics', async ({ page }) => {
    await page.goto('/')

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Check for Web Vitals (basic check)
    const performanceEntries = await page.evaluate(() => {
      return JSON.stringify(performance.getEntriesByType('navigation'))
    })

    expect(performanceEntries).toBeTruthy()

    // Check that page loads within reasonable time
    const loadTime = await page.evaluate(() => {
      const [navigationEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
      return navigationEntry ? navigationEntry.loadEventEnd - navigationEntry.loadEventStart : 0
    })

    expect(loadTime).toBeLessThan(5000) // 5 seconds max load time
  })

  test('accessibility compliance', async ({ page }) => {
    await page.goto('/')

    // Run axe accessibility tests
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('visual regression (screenshot)', async ({ page }) => {
    await page.goto('/')

    // Wait for animations to complete
    await page.waitForTimeout(1000)

    // Take screenshot of hero section
    await expect(page.getByRole('banner')).toHaveScreenshot('hero-section.png')

    // Take screenshot of skills section
    await page.getByRole('heading', { name: 'Technical Expertise' }).scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.locator('section').filter({ hasText: 'Technical Expertise' })).toHaveScreenshot('skills-section.png')

    // Take screenshot of contact section
    await page.getByRole('heading', { name: "Let's Connect" }).scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await expect(page.locator('section').filter({ hasText: "Let's Connect" })).toHaveScreenshot('contact-section.png')
  })
})
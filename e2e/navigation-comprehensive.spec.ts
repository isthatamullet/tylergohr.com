import { test, expect } from '@playwright/test'

test.describe('Comprehensive Navigation Testing - /2 Portfolio', () => {
  
  test.describe('Top Navigation Bar Consistency', () => {
    test('new /2 top nav bar is used on all FOUR pages of the site', async ({ page }) => {
      const pages = ['/2', '/2/case-studies', '/2/technical-expertise', '/2/how-i-work']
      
      for (const url of pages) {
        await page.goto(url)
        
        // Check that the /2 navigation component is present
        await expect(page.locator('nav')).toBeVisible()
        await expect(page.getByRole('link', { name: /Portfolio/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Case Studies/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /Technical Expertise/ })).toBeVisible()
        await expect(page.getByRole('link', { name: /How I Work/ })).toBeVisible()
        
        console.log(`✅ Navigation confirmed on ${url}`)
      }
    })

    test('correct top nav link appears active when displaying homepage sections', async ({ page }) => {
      await page.goto('/2')
      
      // Test portfolio/home link is active on homepage
      const portfolioLink = page.getByRole('link', { name: /Portfolio/ }).first()
      await expect(portfolioLink).toHaveAttribute('aria-current', 'page')
      
      // Scroll to different sections and check if nav updates
      // This depends on your intersection observer implementation
      
      // Navigate to other pages and check active states
      await page.getByRole('link', { name: /Case Studies/ }).first().click()
      await expect(page).toHaveURL('/2/case-studies')
      const caseStudiesLink = page.getByRole('link', { name: /Case Studies/ }).first()
      await expect(caseStudiesLink).toHaveAttribute('aria-current', 'page')
      
      await page.getByRole('link', { name: /Technical Expertise/ }).first().click()
      await expect(page).toHaveURL('/2/technical-expertise')
      const technicalLink = page.getByRole('link', { name: /Technical Expertise/ }).first()
      await expect(technicalLink).toHaveAttribute('aria-current', 'page')
      
      await page.getByRole('link', { name: /How I Work/ }).first().click()
      await expect(page).toHaveURL('/2/how-i-work')
      const howIWorkLink = page.getByRole('link', { name: /How I Work/ }).first()
      await expect(howIWorkLink).toHaveAttribute('aria-current', 'page')
    })
  })

  test.describe('Top Navigation Dropdown Menu Testing', () => {
    test('enhanced dropdown hover effects work correctly on all pages', async ({ page }) => {
      const pages = ['/2', '/2/case-studies', '/2/how-i-work', '/2/technical-expertise']
      const dropdownButtons = ['Work', 'Process', 'Skills']
      
      for (const url of pages) {
        await page.goto(url)
        console.log(`\n🧪 Testing dropdown hover effects on ${url}`)
        
        for (const buttonText of dropdownButtons) {
          // Find the dropdown trigger button
          const dropdownButton = page.locator(`button:has-text("${buttonText}")`)
          
          if (await dropdownButton.isVisible()) {
            console.log(`  📋 Testing ${buttonText} dropdown`)
            
            // Hover over button to open dropdown
            await dropdownButton.hover()
            await page.waitForTimeout(300) // Wait for dropdown to appear
            
            // Find all dropdown items
            const dropdownItems = page.locator('.dropdownItem')
            const itemCount = await dropdownItems.count()
            
            if (itemCount > 0) {
              console.log(`    Found ${itemCount} dropdown items`)
              
              for (let i = 0; i < itemCount; i++) {
                const item = dropdownItems.nth(i)
                
                // Get initial styles before hover
                const initialTransform = await item.evaluate(el => 
                  window.getComputedStyle(el).transform
                )
                
                // Hover over the dropdown item
                await item.hover()
                await page.waitForTimeout(100) // Wait for transition
                
                // Check enhanced hover effects
                const hoverStyles = await item.evaluate(el => {
                  const styles = window.getComputedStyle(el)
                  return {
                    transform: styles.transform,
                    background: styles.background,
                    borderLeft: styles.borderLeft,
                    boxShadow: styles.boxShadow
                  }
                })
                
                // Validate transform effect (should include scale and translateX)
                expect(hoverStyles.transform).not.toBe(initialTransform)
                expect(hoverStyles.transform).toContain('matrix') // CSS transforms become matrix
                
                // Validate gradient background (should contain green accent)
                expect(hoverStyles.background).toMatch(/rgba\(22,\s*163,\s*74|#16a34a/i)
                
                // Validate left border accent (should be 3px green)
                expect(hoverStyles.borderLeft).toMatch(/3px.*rgb\(22,\s*163,\s*74\)|3px.*#16a34a/i)
                
                console.log(`    ✅ Item ${i + 1}: Hover effects applied correctly`)
                
                // Test content-specific effects based on dropdown type
                if (buttonText === 'Work') {
                  // Test Work dropdown badge effects
                  const badge = item.locator('.badge')
                  if (await badge.isVisible()) {
                    const badgeStyles = await badge.evaluate(el => {
                      const styles = window.getComputedStyle(el)
                      return {
                        transform: styles.transform,
                        boxShadow: styles.boxShadow
                      }
                    })
                    
                    // Badge should have scale transform
                    expect(badgeStyles.transform).toContain('matrix') // scale(1.05) becomes matrix
                    console.log(`      ✅ Badge scaling effect applied`)
                  }
                } else if (buttonText === 'Skills') {
                  // Test Skills dropdown icon effects
                  const icon = item.locator('.itemIcon')
                  if (await icon.isVisible()) {
                    const iconStyles = await icon.evaluate(el => {
                      const styles = window.getComputedStyle(el)
                      return {
                        transform: styles.transform,
                        filter: styles.filter
                      }
                    })
                    
                    // Icon should have scale transform and drop shadow
                    expect(iconStyles.transform).toContain('matrix') // scale(1.1) becomes matrix
                    expect(iconStyles.filter).toMatch(/drop-shadow/i)
                    console.log(`      ✅ Icon scaling and drop shadow applied`)
                  }
                } else if (buttonText === 'Process') {
                  // Test Process dropdown text enhancement
                  const title = item.locator('.dropdownTitle')
                  const description = item.locator('.dropdownDescription')
                  
                  if (await title.isVisible()) {
                    const titleColor = await title.evaluate(el => 
                      window.getComputedStyle(el).color
                    )
                    // Title should be brightened (close to white: rgb(255, 255, 255))
                    expect(titleColor).toMatch(/rgb\(255,\s*255,\s*255\)|rgba\(255,\s*255,\s*255/i)
                    console.log(`      ✅ Title color enhancement applied`)
                  }
                  
                  if (await description.isVisible()) {
                    const descColor = await description.evaluate(el => 
                      window.getComputedStyle(el).color
                    )
                    // Description should be brighter than default
                    expect(descColor).toMatch(/rgba\(255,\s*255,\s*255,\s*0\.8\)/i)
                    console.log(`      ✅ Description color enhancement applied`)
                  }
                }
              }
            }
            
            // Move mouse away to close dropdown
            await page.locator('body').hover()
            await page.waitForTimeout(200)
          }
        }
      }
    })

    test('reduced motion preferences are respected in dropdown hover effects', async ({ page }) => {
      // Test with reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/2')
      
      const dropdownButton = page.locator('button:has-text("Work")')
      
      if (await dropdownButton.isVisible()) {
        await dropdownButton.hover()
        await page.waitForTimeout(300)
        
        const dropdownItems = page.locator('.dropdownItem')
        const firstItem = dropdownItems.first()
        
        if (await firstItem.isVisible()) {
          // Hover over dropdown item
          await firstItem.hover()
          await page.waitForTimeout(100)
          
          // Check that transforms are disabled for reduced motion
          const styles = await firstItem.evaluate(el => {
            const computedStyles = window.getComputedStyle(el)
            return {
              transform: computedStyles.transform,
              transition: computedStyles.transition
            }
          })
          
          // With reduced motion, transform should be none or identity matrix
          expect(styles.transform).toMatch(/none|matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*0\)/)
          console.log('✅ Reduced motion preferences respected - transforms disabled')
          
          // Color transitions should still work
          const backgroundStyle = await firstItem.evaluate(el => 
            window.getComputedStyle(el).background
          )
          expect(backgroundStyle).toMatch(/rgba\(22,\s*163,\s*74|#16a34a/i)
          console.log('✅ Color transitions preserved with reduced motion')
        }
      }
    })

    test('deep links from top nav dropdown menu work correctly', async ({ page }) => {
      await page.goto('/2')
      
      // Test dropdown navigation if present
      const dropdownTrigger = page.locator('[data-testid="dropdown-trigger"]').or(
        page.locator('button').filter({ hasText: /Menu|More/ })
      )
      
      if (await dropdownTrigger.isVisible()) {
        await dropdownTrigger.click()
        
        // Test deep links to specific sections
        const deepLinks = [
          { text: /About/, expectedUrl: '/2#about' },
          { text: /Results/, expectedUrl: '/2#results' },
          { text: /Case Studies/, expectedUrl: '/2#case-studies' },
          { text: /How I Work/, expectedUrl: '/2#how-i-work' },
          { text: /Technical/, expectedUrl: '/2#technical-expertise' },
          { text: /Contact/, expectedUrl: '/2#contact' }
        ]
        
        for (const link of deepLinks) {
          const dropdownLink = page.getByRole('link', { name: link.text })
          if (await dropdownLink.isVisible()) {
            await dropdownLink.click()
            
            // Check URL or scroll position
            if (link.expectedUrl.includes('#')) {
              const currentUrl = page.url()
              expect(currentUrl).toContain(link.expectedUrl.split('#')[1])
            }
            
            // Re-open dropdown for next test
            if (await dropdownTrigger.isVisible()) {
              await dropdownTrigger.click()
            }
          }
        }
      }
    })
  })

  test.describe('Homepage Section Cards to Browser Tabs Navigation', () => {
    test('homepage case study cards link to specific browser tabs on case studies page', async ({ page }) => {
      await page.goto('/2')
      
      // Scroll to case studies section
      await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
      
      // Find case study cards
      const caseStudyCards = [
        { cardText: /Emmy-winning|Cost Savings/, expectedTab: /Cost Savings/ },
        { cardText: /Fox Corporation|Workflow/, expectedTab: /Workflow/ },
        { cardText: /Warner Bros|AI/, expectedTab: /AI/ },
        { cardText: /SDI Media|Emmy/, expectedTab: /Emmy/ }
      ]
      
      for (const card of caseStudyCards) {
        await page.goto('/2') // Reset to homepage
        await page.getByRole('heading', { name: /Case Studies/ }).scrollIntoViewIfNeeded()
        
        // Find and click the specific case study card
        const cardElement = page.getByText(card.cardText).first().or(
          page.locator('.case-study-card').filter({ hasText: card.cardText })
        )
        
        if (await cardElement.isVisible()) {
          await cardElement.click()
          
          // Should navigate to case studies page
          await expect(page).toHaveURL('/2/case-studies')
          
          // Check that the specific tab is active
          const targetTab = page.getByRole('tab', { name: card.expectedTab })
          await expect(targetTab).toHaveAttribute('aria-selected', 'true')
          
          console.log(`✅ Case study card correctly links to ${card.expectedTab} tab`)
        }
      }
    })

    test('homepage technical expertise cards link to specific browser tabs on technical expertise page', async ({ page }) => {
      await page.goto('/2')
      
      // Scroll to technical expertise section
      await page.getByRole('heading', { name: /Technical Expertise/ }).scrollIntoViewIfNeeded()
      
      // Find technical expertise cards
      const technicalCards = [
        { cardText: /Frontend|React|JavaScript/, expectedTab: /Frontend/ },
        { cardText: /Backend|Node\.js|API/, expectedTab: /Backend/ },
        { cardText: /Cloud|AWS|Infrastructure/, expectedTab: /Cloud/ },
        { cardText: /Leadership|Team|Management/, expectedTab: /Leadership/ },
        { cardText: /AI|Machine Learning|Automation/, expectedTab: /AI/ }
      ]
      
      for (const card of technicalCards) {
        await page.goto('/2') // Reset to homepage
        await page.getByRole('heading', { name: /Technical Expertise/ }).scrollIntoViewIfNeeded()
        
        // Find and click the specific technical card
        const cardElement = page.getByText(card.cardText).first().or(
          page.locator('.technical-card').filter({ hasText: card.cardText })
        )
        
        if (await cardElement.isVisible()) {
          await cardElement.click()
          
          // Should navigate to technical expertise page
          await expect(page).toHaveURL('/2/technical-expertise')
          
          // Check that the specific tab is active
          const targetTab = page.getByRole('tab', { name: card.expectedTab })
          await expect(targetTab).toHaveAttribute('aria-selected', 'true')
          
          console.log(`✅ Technical card correctly links to ${card.expectedTab} tab`)
        }
      }
    })
  })

  test.describe('All Navigation Elements Testing', () => {
    test('all buttons work correctly across all pages', async ({ page }) => {
      const pages = ['/2', '/2/case-studies', '/2/technical-expertise', '/2/how-i-work']
      
      for (const url of pages) {
        await page.goto(url)
        
        // Find all buttons on the page
        const buttons = page.getByRole('button')
        const buttonCount = await buttons.count()
        
        console.log(`Testing ${buttonCount} buttons on ${url}`)
        
        for (let i = 0; i < buttonCount; i++) {
          const button = buttons.nth(i)
          
          if (await button.isVisible() && await button.isEnabled()) {
            const buttonText = await button.textContent()
            
            // Test button hover
            await button.hover()
            
            // Test button focus
            await button.focus()
            await expect(button).toBeFocused()
            
            // For non-submit buttons, test click
            if (!buttonText?.includes('Send') && !buttonText?.includes('Submit')) {
              await button.click()
              // Wait for any resulting animations or state changes
              await page.waitForTimeout(200)
            }
            
            console.log(`✅ Button "${buttonText}" tested successfully`)
          }
        }
      }
    })

    test('all links work correctly across all pages', async ({ page }) => {
      const pages = ['/2', '/2/case-studies', '/2/technical-expertise', '/2/how-i-work']
      
      for (const url of pages) {
        await page.goto(url)
        
        // Find all internal links (not external)
        const internalLinks = page.getByRole('link').filter({ hasNot: page.locator('[target="_blank"]') })
        const linkCount = await internalLinks.count()
        
        console.log(`Testing ${linkCount} internal links on ${url}`)
        
        for (let i = 0; i < linkCount; i++) {
          const link = internalLinks.nth(i)
          
          if (await link.isVisible()) {
            const linkText = await link.textContent()
            const href = await link.getAttribute('href')
            
            // Test link hover
            await link.hover()
            
            // Test link focus
            await link.focus()
            await expect(link).toBeFocused()
            
            // Check href is valid
            if (href) {
              expect(href).not.toBe('')
              expect(href).not.toBe('#')
              
              // For internal links, ensure they're valid routes
              if (href.startsWith('/')) {
                expect(href).toMatch(/^\/2/)
              }
            }
            
            console.log(`✅ Link "${linkText}" (${href}) tested successfully`)
          }
        }
      }
    })

    test('external links open in new tabs correctly', async ({ page, context }) => {
      await page.goto('/2')
      
      // Find external links (should have target="_blank")
      const externalLinks = page.locator('a[target="_blank"]')
      const linkCount = await externalLinks.count()
      
      for (let i = 0; i < linkCount; i++) {
        const link = externalLinks.nth(i)
        
        if (await link.isVisible()) {
          const href = await link.getAttribute('href')
          const linkText = await link.textContent()
          
          // Verify external link attributes
          await expect(link).toHaveAttribute('target', '_blank')
          await expect(link).toHaveAttribute('rel', /noopener|noreferrer/)
          
          // Test hover effect
          await link.hover()
          
          // Verify href is external
          if (href) {
            expect(href).toMatch(/^https?:\/\//)
            expect(href).not.toContain('tylergohr.com')
          }
          
          console.log(`✅ External link "${linkText}" (${href}) configured correctly`)
        }
      }
    })
  })

  test.describe('Navigation Accessibility', () => {
    test('all navigation elements are keyboard accessible', async ({ page }) => {
      await page.goto('/2')
      
      // Tab through all interactive elements
      let tabCount = 0
      const maxTabs = 50 // Prevent infinite loop
      
      while (tabCount < maxTabs) {
        await page.keyboard.press('Tab')
        tabCount++
        
        const focusedElement = page.locator(':focus')
        
        if (await focusedElement.isVisible()) {
          const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase())
          const role = await focusedElement.getAttribute('role')
          
          // Verify focus is visible
          await expect(focusedElement).toBeFocused()
          
          // For interactive elements, test Enter/Space activation
          if (['button', 'a', 'input', 'select', 'textarea'].includes(tagName) || 
              ['button', 'link', 'tab'].includes(role || '')) {
            
            const elementText = await focusedElement.textContent()
            
            // Test activation with Enter (for non-input elements)
            if (!['input', 'textarea', 'select'].includes(tagName)) {
              // Some elements might navigate away, so we'll be careful
              if (!elementText?.includes('Case Studies') && !elementText?.includes('Technical Expertise')) {
                await page.keyboard.press('Enter')
                await page.waitForTimeout(100)
              }
            }
            
            console.log(`✅ Keyboard accessible: ${tagName}${role ? ` (role: ${role})` : ''} - "${elementText}"`)
          }
        } else {
          break // No more focusable elements
        }
      }
      
      expect(tabCount).toBeGreaterThan(5) // Should have at least 5 focusable elements
    })

    test('navigation has proper ARIA labels and roles', async ({ page }) => {
      await page.goto('/2')
      
      // Check main navigation
      const nav = page.locator('nav').first()
      await expect(nav).toBeVisible()
      
      // Check for proper roles
      const navigationRole = await nav.getAttribute('role')
      if (navigationRole) {
        expect(navigationRole).toBe('navigation')
      }
      
      // Check for aria-labels
      const ariaLabel = await nav.getAttribute('aria-label')
      if (ariaLabel) {
        expect(ariaLabel).toBeTruthy()
      }
      
      // Check dropdown elements if present
      const dropdownButtons = page.locator('button[aria-haspopup]')
      const dropdownCount = await dropdownButtons.count()
      
      for (let i = 0; i < dropdownCount; i++) {
        const dropdown = dropdownButtons.nth(i)
        await expect(dropdown).toHaveAttribute('aria-haspopup', 'true')
        
        // Check for aria-expanded
        const ariaExpanded = await dropdown.getAttribute('aria-expanded')
        expect(['true', 'false']).toContain(ariaExpanded || 'false')
      }
    })
  })

  test.describe('Navigation Performance', () => {
    test('navigation transitions are smooth and fast', async ({ page }) => {
      await page.goto('/2')
      
      const navigationTests = [
        { from: '/2', to: '/2/case-studies', link: /Case Studies/ },
        { from: '/2/case-studies', to: '/2/technical-expertise', link: /Technical Expertise/ },
        { from: '/2/technical-expertise', to: '/2/how-i-work', link: /How I Work/ },
        { from: '/2/how-i-work', to: '/2', link: /Portfolio/ }
      ]
      
      for (const test of navigationTests) {
        await page.goto(test.from)
        
        const startTime = Date.now()
        await page.getByRole('link', { name: test.link }).first().click()
        await page.waitForURL(test.to)
        const endTime = Date.now()
        
        const transitionTime = endTime - startTime
        expect(transitionTime).toBeLessThan(2000) // 2 seconds max
        
        console.log(`✅ Navigation ${test.from} → ${test.to}: ${transitionTime}ms`)
      }
    })

    test('browser tab switching is responsive', async ({ page }) => {
      await page.goto('/2/case-studies')
      
      const tabs = page.getByRole('tab')
      const tabCount = await tabs.count()
      
      for (let i = 0; i < tabCount; i++) {
        const tab = tabs.nth(i)
        
        const startTime = Date.now()
        await tab.click()
        
        // Wait for tab to become active
        await expect(tab).toHaveAttribute('aria-selected', 'true')
        const endTime = Date.now()
        
        const switchTime = endTime - startTime
        expect(switchTime).toBeLessThan(500) // 500ms max for tab switching
        
        const tabText = await tab.textContent()
        console.log(`✅ Tab switch to "${tabText}": ${switchTime}ms`)
      }
    })
  })
})
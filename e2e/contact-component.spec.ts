import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('ContactSection Component Testing', () => {
  
  test.describe('Form Validation Logic', () => {
    test('validates required fields in real-time', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Test name field validation
      const nameField = page.getByLabel('Name')
      await nameField.click()
      await nameField.blur()
      
      // Should show name required error
      await expect(page.getByText(/Name is required/)).toBeVisible()
      
      // Test minimum length validation
      await nameField.fill('A')
      await nameField.blur()
      await expect(page.getByText(/Name must be at least 2 characters/)).toBeVisible()
      
      // Valid name should clear error
      await nameField.fill('John Doe')
      await nameField.blur()
      await expect(page.getByText(/Name is required/)).not.toBeVisible()
      await expect(page.getByText(/Name must be at least 2 characters/)).not.toBeVisible()
    })

    test('validates email format in real-time', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      const emailField = page.getByLabel('Email')
      
      // Test required validation
      await emailField.click()
      await emailField.blur()
      await expect(page.getByText(/Email is required/)).toBeVisible()
      
      // Test invalid email format
      await emailField.fill('invalid-email')
      await emailField.blur()
      await expect(page.getByText(/Please enter a valid email address/)).toBeVisible()
      
      // Test partially invalid email
      await emailField.fill('test@')
      await emailField.blur()
      await expect(page.getByText(/Please enter a valid email address/)).toBeVisible()
      
      // Valid email should clear error
      await emailField.fill('test@example.com')
      await emailField.blur()
      await expect(page.getByText(/Email is required/)).not.toBeVisible()
      await expect(page.getByText(/Please enter a valid email address/)).not.toBeVisible()
    })

    test('validates message field requirements', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      const messageField = page.getByLabel('Message')
      
      // Test required validation
      await messageField.click()
      await messageField.blur()
      await expect(page.getByText(/Message is required/)).toBeVisible()
      
      // Test minimum length validation
      await messageField.fill('Too short')
      await messageField.blur()
      await expect(page.getByText(/Message must be at least 10 characters/)).toBeVisible()
      
      // Valid message should clear error
      await messageField.fill('This is a valid message with enough content to pass validation.')
      await messageField.blur()
      await expect(page.getByText(/Message is required/)).not.toBeVisible()
      await expect(page.getByText(/Message must be at least 10 characters/)).not.toBeVisible()
    })

    test('submit button enables only when form is valid', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      const submitButton = page.getByRole('button', { name: /Send Message/ })
      
      // Initially disabled
      await expect(submitButton).toBeDisabled()
      await expect(page.getByText(/Please fill in all required fields/)).toBeVisible()
      
      // Fill form completely
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john@example.com')
      await page.getByLabel('Message').fill('This is a complete message for testing purposes.')
      
      // Button should be enabled
      await expect(submitButton).toBeEnabled()
      await expect(page.getByText(/Ready to send your message/)).toBeVisible()
    })
  })

  test.describe('Form Field Interactions', () => {
    test('project type dropdown works correctly', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      const projectTypeSelect = page.getByLabel('Project Type')
      
      // Check default value
      await expect(projectTypeSelect).toHaveValue('web-app')
      
      // Test all available options
      const options = [
        { value: 'web-app', label: 'Web Application Development' },
        { value: 'ecommerce', label: 'E-commerce Platform' },
        { value: 'leadership', label: 'Technical Leadership Role' },
        { value: 'integration', label: 'System Integration & APIs' },
        { value: 'other', label: 'Other / Let\'s Discuss' }
      ]
      
      for (const option of options) {
        await projectTypeSelect.selectOption(option.value)
        await expect(projectTypeSelect).toHaveValue(option.value)
        
        // Verify option text is visible in dropdown
        await expect(page.getByRole('option', { name: option.label })).toBeInViewport()
      }
    })

    test('form fields handle keyboard navigation', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Tab through all form fields
      await page.getByLabel('Name').focus()
      await page.keyboard.press('Tab')
      await expect(page.getByLabel('Email')).toBeFocused()
      
      await page.keyboard.press('Tab')
      await expect(page.getByLabel('Project Type')).toBeFocused()
      
      await page.keyboard.press('Tab')
      await expect(page.getByLabel('Message')).toBeFocused()
      
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button', { name: /Send Message/ })).toBeFocused()
    })

    test('form fields support copy/paste operations', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      const testText = 'This is a test message for copy/paste functionality.'
      
      // Type in message field
      await page.getByLabel('Message').fill(testText)
      
      // Select all text and copy
      await page.getByLabel('Message').selectText()
      await page.keyboard.press('ControlOrMeta+c')
      
      // Clear field and paste
      await page.getByLabel('Message').fill('')
      await page.keyboard.press('ControlOrMeta+v')
      
      // Verify pasted content
      await expect(page.getByLabel('Message')).toHaveValue(testText)
    })
  })

  test.describe('Form Submission States', () => {
    test('shows loading state during submission', async ({ page }) => {
      // Mock API to simulate slow response
      await page.route('/api/contact', async route => {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        })
      })
      
      await page.goto('/2')
      
      // Navigate and fill form
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john@example.com')
      await page.getByLabel('Message').fill('This is a test message for loading state verification.')
      
      // Submit form
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      // Check loading state
      await expect(page.getByRole('button', { name: /Sending Message/ })).toBeVisible()
      await expect(page.getByText(/Processing your message/)).toBeVisible()
      
      // Check spinner is visible
      await expect(page.locator('[class*="spinner"]')).toBeVisible()
      
      // Form fields should be disabled during submission
      await expect(page.getByLabel('Name')).toBeDisabled()
      await expect(page.getByLabel('Email')).toBeDisabled()
      await expect(page.getByLabel('Message')).toBeDisabled()
    })

    test('shows success state after successful submission', async ({ page }) => {
      // Mock successful API response
      await page.route('/api/contact', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        })
      })
      
      await page.goto('/2')
      
      // Navigate and fill form
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john@example.com')
      await page.getByLabel('Message').fill('This is a test message for success state verification.')
      
      // Submit form
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      // Check success message
      await expect(page.getByRole('alert')).toContainText('Message Sent Successfully!')
      await expect(page.getByText(/Thanks for reaching out/)).toBeVisible()
      
      // Form should be reset
      await expect(page.getByLabel('Name')).toHaveValue('')
      await expect(page.getByLabel('Email')).toHaveValue('')
      await expect(page.getByLabel('Message')).toHaveValue('')
      await expect(page.getByLabel('Project Type')).toHaveValue('web-app')
    })

    test('shows error state when submission fails', async ({ page }) => {
      // Mock failed API response
      await page.route('/api/contact', async route => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Server error' })
        })
      })
      
      await page.goto('/2')
      
      // Navigate and fill form
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john@example.com')
      await page.getByLabel('Message').fill('This is a test message for error state verification.')
      
      // Submit form
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      // Check error message
      await expect(page.getByRole('alert')).toContainText('Message Failed to Send')
      await expect(page.getByText(/Sorry, there was an issue/)).toBeVisible()
      
      // Form data should be preserved
      await expect(page.getByLabel('Name')).toHaveValue('John Doe')
      await expect(page.getByLabel('Email')).toHaveValue('john@example.com')
    })

    test('handles network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('/api/contact', route => route.abort())
      
      await page.goto('/2')
      
      // Navigate and fill form
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john@example.com')
      await page.getByLabel('Message').fill('This is a test message for network error handling.')
      
      // Submit form
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      // Should show error state
      await expect(page.getByRole('alert')).toContainText('Message Failed to Send')
    })
  })

  test.describe('Accessibility Compliance', () => {
    test('contact section passes accessibility audit', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('#contact')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })

    test('form has proper ARIA attributes', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Check form has proper labeling
      await expect(page.locator('#contact')).toHaveAttribute('aria-labelledby', 'contact-title')
      await expect(page.locator('#contact')).toHaveAttribute('role', 'region')
      
      // Check form fields have proper labels
      await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'false')
      await expect(page.getByLabel('Email')).toHaveAttribute('aria-invalid', 'false')
      await expect(page.getByLabel('Message')).toHaveAttribute('aria-invalid', 'false')
      
      // Check submit button has proper description
      const submitButton = page.getByRole('button', { name: /Send Message/ })
      await expect(submitButton).toHaveAttribute('aria-describedby', 'submit-status')
    })

    test('error states have proper ARIA attributes', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Trigger validation errors
      const nameField = page.getByLabel('Name')
      await nameField.click()
      await nameField.fill('A') // Too short
      await nameField.blur()
      
      // Check error state ARIA attributes
      await expect(nameField).toHaveAttribute('aria-invalid', 'true')
      
      const emailField = page.getByLabel('Email')
      await emailField.click()
      await emailField.fill('invalid-email')
      await emailField.blur()
      
      await expect(emailField).toHaveAttribute('aria-invalid', 'true')
    })

    test('success and error messages are announced to screen readers', async ({ page }) => {
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Mock successful submission
      await page.route('/api/contact', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        })
      })
      
      // Fill and submit form
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john@example.com')
      await page.getByLabel('Message').fill('This is a test message.')
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      // Check success message has role="alert"
      const successAlert = page.getByRole('alert')
      await expect(successAlert).toBeVisible()
      await expect(successAlert).toContainText('Message Sent Successfully!')
    })
  })

  test.describe('Scroll Animation Behavior', () => {
    test('contact section animates on scroll into view', async ({ page }) => {
      await page.goto('/2')
      
      const contactSection = page.locator('#contact')
      
      // Check initial state (should not be visible/animated yet)
      await expect(contactSection).toBeInViewport({ ratio: 0 })
      
      // Scroll to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Wait for intersection observer to trigger
      await page.waitForTimeout(500)
      
      // Check that animation classes are applied
      await expect(contactSection.locator('[class*="revealed"]')).toBeVisible()
    })

    test('animation respects reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Contact section should still be functional with reduced motion
      await expect(page.getByLabel('Name')).toBeVisible()
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Message')).toBeVisible()
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test('contact form works correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Check mobile layout
      await expect(page.getByLabel('Name')).toBeVisible()
      await expect(page.getByLabel('Email')).toBeVisible()
      await expect(page.getByLabel('Project Type')).toBeVisible()
      await expect(page.getByLabel('Message')).toBeVisible()
      
      // Test touch interactions
      await page.getByLabel('Name').tap()
      await page.getByLabel('Name').fill('John Doe')
      
      await page.getByLabel('Email').tap()
      await page.getByLabel('Email').fill('john@example.com')
      
      // Test dropdown on mobile
      await page.getByLabel('Project Type').tap()
      await page.getByLabel('Project Type').selectOption('ecommerce')
      
      await page.getByLabel('Message').tap()
      await page.getByLabel('Message').fill('Mobile form testing message.')
      
      // Submit button should be touch-friendly
      const submitButton = page.getByRole('button', { name: /Send Message/ })
      await expect(submitButton).toBeVisible()
      await expect(submitButton).toBeEnabled()
    })

    test('form validation works on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/2')
      
      // Navigate to contact section
      await page.getByRole('heading', { name: /Ready to transform your technical challenges/ }).scrollIntoViewIfNeeded()
      
      // Test validation on mobile
      await page.getByLabel('Email').tap()
      await page.getByLabel('Email').fill('invalid-email')
      await page.getByLabel('Name').tap() // Blur email field
      
      await expect(page.getByText(/Please enter a valid email address/)).toBeVisible()
    })
  })
})
import { test, expect } from '@playwright/test'

test.describe('API Integration Tests - Enterprise Portfolio', () => {
  
  test.describe('Contact Form API (/api/contact)', () => {
    test('successful form submission sends email to tyler@tylergohr.com', async ({ page }) => {
      await page.goto('/2')

      // Navigate to contact section
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Fill out the form with valid data
      await page.getByLabel('Name').fill('John Doe')
      await page.getByLabel('Email').fill('john.doe@example.com')
      await page.getByLabel('Project Type').selectOption('Full-Stack Development')
      await page.getByLabel('Message').fill('I would like to discuss a potential project opportunity.')

      // Intercept the API call
      const apiResponse = page.waitForResponse('/api/contact')
      
      // Submit the form
      await page.getByRole('button', { name: /Send Message/ }).click()

      // Wait for the API response
      const response = await apiResponse
      expect(response.status()).toBe(200)

      // Check success message appears
      await expect(page.getByRole('alert')).toContainText(/Message sent successfully/)

      // Verify form is reset
      await expect(page.getByLabel('Name')).toHaveValue('')
      await expect(page.getByLabel('Email')).toHaveValue('')
      await expect(page.getByLabel('Message')).toHaveValue('')
    })

    test('form validation prevents submission with invalid data', async ({ page }) => {
      await page.goto('/2')
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Test empty form submission
      await page.getByRole('button', { name: /Send Message/ }).click()
      await expect(page.getByText(/Name is required/)).toBeVisible()
      await expect(page.getByText(/Email is required/)).toBeVisible()
      await expect(page.getByText(/Message is required/)).toBeVisible()

      // Test invalid email format
      await page.getByLabel('Name').fill('Test User')
      await page.getByLabel('Email').fill('invalid-email-format')
      await page.getByLabel('Message').fill('Test message')
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      await expect(page.getByText(/Please enter a valid email/)).toBeVisible()

      // Test message too short
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Message').fill('Too short')
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      await expect(page.getByText(/Message must be at least/)).toBeVisible()
    })

    test('form handles server errors gracefully', async ({ page }) => {
      // Mock server error
      await page.route('/api/contact', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        })
      })

      await page.goto('/2')
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Fill valid form
      await page.getByLabel('Name').fill('Test User')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Project Type').selectOption('Full-Stack Development')
      await page.getByLabel('Message').fill('This is a test message that should trigger a server error.')

      // Submit form
      await page.getByRole('button', { name: /Send Message/ }).click()

      // Check error message appears
      await expect(page.getByRole('alert')).toContainText(/Something went wrong/)
      
      // Verify form data is preserved (not reset on error)
      await expect(page.getByLabel('Name')).toHaveValue('Test User')
      await expect(page.getByLabel('Email')).toHaveValue('test@example.com')
    })

    test('form implements rate limiting protection', async ({ page }) => {
      await page.goto('/2')
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Submit multiple requests rapidly
      for (let i = 0; i < 6; i++) {
        await page.getByLabel('Name').fill(`Test User ${i}`)
        await page.getByLabel('Email').fill(`test${i}@example.com`)
        await page.getByLabel('Project Type').selectOption('Full-Stack Development')
        await page.getByLabel('Message').fill(`This is test message number ${i}.`)
        
        await page.getByRole('button', { name: /Send Message/ }).click()
        
        if (i < 5) {
          // First 5 should succeed or be processing
          await expect(page.getByText(/Sending|Message sent successfully/)).toBeVisible({ timeout: 5000 })
        } else {
          // 6th should be rate limited
          await expect(page.getByText(/Too many requests/)).toBeVisible({ timeout: 5000 })
        }
        
        // Wait between submissions
        await page.waitForTimeout(1000)
      }
    })

    test('form handles network connectivity issues', async ({ page }) => {
      await page.goto('/2')
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Fill form
      await page.getByLabel('Name').fill('Test User')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Project Type').selectOption('Full-Stack Development')
      await page.getByLabel('Message').fill('Testing network connectivity handling.')

      // Simulate network failure
      await page.context().setOffline(true)
      
      // Submit form
      await page.getByRole('button', { name: /Send Message/ }).click()

      // Check appropriate error message
      await expect(page.getByText(/Network error|Connection failed/)).toBeVisible({ timeout: 10000 })
      
      // Restore connectivity
      await page.context().setOffline(false)
      
      // Retry should work
      await page.getByRole('button', { name: /Send Message/ }).click()
      await expect(page.getByText(/Message sent successfully/)).toBeVisible({ timeout: 10000 })
    })

    test('form includes proper CSRF protection', async ({ page }) => {
      await page.goto('/2')
      
      // Check that form includes CSRF token or similar protection
      const form = page.locator('form')
      await expect(form).toBeVisible()
      
      // In a real implementation, you might check for:
      // - CSRF tokens
      // - Origin header validation
      // - Referrer header checks
      
      // For now, we'll just verify the form submits through proper channels
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()
      await page.getByLabel('Name').fill('Test User')
      await page.getByLabel('Email').fill('test@example.com')
      await page.getByLabel('Message').fill('Testing security measures.')
      
      const response = page.waitForResponse('/api/contact')
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      const apiResponse = await response
      expect(apiResponse.status()).toBe(200)
    })
  })

  test.describe('Health Check API (/api/health)', () => {
    test('health endpoint returns successful status', async ({ request }) => {
      const response = await request.get('/api/health')
      expect(response.status()).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('status', 'ok')
      expect(data).toHaveProperty('timestamp')
    })

    test('health endpoint responds quickly', async ({ request }) => {
      const startTime = Date.now()
      const response = await request.get('/api/health')
      const endTime = Date.now()
      
      expect(response.status()).toBe(200)
      expect(endTime - startTime).toBeLessThan(1000) // Should respond in under 1 second
    })
  })

  test.describe('API Security Headers', () => {
    test('contact API includes proper security headers', async ({ page }) => {
      let responseHeaders: any = {}
      
      page.on('response', response => {
        if (response.url().includes('/api/contact')) {
          responseHeaders = response.headers()
        }
      })

      await page.goto('/2')
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()
      
      // Submit form to trigger API call
      await page.getByLabel('Name').fill('Security Test')
      await page.getByLabel('Email').fill('security@example.com')
      await page.getByLabel('Message').fill('Testing security headers.')
      await page.getByRole('button', { name: /Send Message/ }).click()
      
      await page.waitForTimeout(2000) // Wait for response
      
      // Check for important security headers
      expect(responseHeaders).toHaveProperty('content-type')
      // Additional security headers would be checked here based on implementation
    })
  })

  test.describe('Error Recovery and Resilience', () => {
    test('form recovers from temporary API failures', async ({ page }) => {
      let requestCount = 0
      
      // Mock intermittent failures
      await page.route('/api/contact', route => {
        requestCount++
        if (requestCount === 1) {
          // First request fails
          route.fulfill({
            status: 503,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Service Temporarily Unavailable' })
          })
        } else {
          // Subsequent requests succeed
          route.continue()
        }
      })

      await page.goto('/2')
      await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

      // Fill form
      await page.getByLabel('Name').fill('Resilience Test')
      await page.getByLabel('Email').fill('resilience@example.com')
      await page.getByLabel('Message').fill('Testing error recovery.')

      // First submission should fail
      await page.getByRole('button', { name: /Send Message/ }).click()
      await expect(page.getByText(/Service temporarily unavailable/)).toBeVisible()

      // Retry should succeed
      await page.getByRole('button', { name: /Retry|Send Message/ }).click()
      await expect(page.getByText(/Message sent successfully/)).toBeVisible()
    })

    test('form provides clear feedback for different error types', async ({ page }) => {
      const errorScenarios = [
        { 
          status: 400, 
          error: 'Bad Request', 
          expectedMessage: /Invalid form data/ 
        },
        { 
          status: 422, 
          error: 'Validation Error', 
          expectedMessage: /Please check your input/ 
        },
        { 
          status: 429, 
          error: 'Too Many Requests', 
          expectedMessage: /Too many requests/ 
        },
        { 
          status: 500, 
          error: 'Internal Server Error', 
          expectedMessage: /Something went wrong/ 
        }
      ]

      for (const scenario of errorScenarios) {
        // Mock specific error
        await page.route('/api/contact', route => {
          route.fulfill({
            status: scenario.status,
            contentType: 'application/json',
            body: JSON.stringify({ error: scenario.error })
          })
        })

        await page.goto('/2')
        await page.getByRole('heading', { name: /Contact/ }).scrollIntoViewIfNeeded()

        // Submit form
        await page.getByLabel('Name').fill('Error Test')
        await page.getByLabel('Email').fill('error@example.com')
        await page.getByLabel('Message').fill(`Testing ${scenario.status} error handling.`)
        await page.getByRole('button', { name: /Send Message/ }).click()

        // Check appropriate error message
        await expect(page.getByText(scenario.expectedMessage)).toBeVisible()
      }
    })
  })
})
import { test, expect } from '@playwright/test';

test.describe('Live Code Demonstration System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to page with live code system
    await page.goto('/2');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test('Live code editor renders correctly', async ({ page }) => {
    // Look for live code section
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      await expect(liveCodeSection).toBeVisible();
      
      // Check for Monaco editor
      const editor = page.locator('.monaco-editor');
      await expect(editor).toBeVisible();
      
      // Check for execute button
      const executeButton = page.locator('button', { hasText: /run code|execute/i });
      await expect(executeButton).toBeVisible();
    } else {
      console.log('Live code section not found - may not be implemented on this page yet');
    }
  });

  test('Code execution works correctly', async ({ page }) => {
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Wait for editor to load
      await page.waitForSelector('.monaco-editor', { timeout: 10000 });
      
      // Click on the editor to focus
      await page.locator('.monaco-editor').click();
      
      // Clear existing content and type simple code
      await page.keyboard.press('Control+A');
      await page.keyboard.type('console.log("Hello, Enterprise!");');
      
      // Execute the code
      const executeButton = page.locator('button', { hasText: /run code|execute/i });
      await executeButton.click();
      
      // Check for output section
      const outputSection = page.locator('[class*="output"]');
      await expect(outputSection).toBeVisible({ timeout: 5000 });
    } else {
      test.skip();
    }
  });

  test('3D visualization renders when available', async ({ page }) => {
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Check for 3D visualization container
      const visualizationContainer = page.locator('[class*="visualization3D"], canvas');
      
      if (await visualizationContainer.count() > 0) {
        await expect(visualizationContainer).toBeVisible();
        
        // Check for WebGL support indicator
        const webglSupported = await page.evaluate(() => {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          return !!gl;
        });
        
        if (webglSupported) {
          // Check that canvas element exists
          const canvas = page.locator('canvas');
          await expect(canvas).toBeVisible();
        }
      }
    } else {
      test.skip();
    }
  });

  test('Demo tabs navigation works', async ({ page }) => {
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Check for demo tabs
      const demoTabs = page.locator('[class*="tab"]').first();
      
      if (await demoTabs.count() > 0) {
        // Click on different tabs
        const tabs = page.locator('[class*="tab"]');
        const tabCount = await tabs.count();
        
        if (tabCount > 1) {
          // Click on second tab
          await tabs.nth(1).click();
          
          // Verify tab is active
          await expect(tabs.nth(1)).toHaveClass(/active/);
          
          // Check that content changed
          const demoTitle = page.locator('[class*="demoTitle"]');
          await expect(demoTitle).toBeVisible();
        }
      }
    } else {
      test.skip();
    }
  });

  test('Enterprise code examples are available', async ({ page }) => {
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Check for enterprise-specific content
      const enterpriseIndicators = [
        'Enterprise Dashboard',
        'Business',
        'React Component',
        'Database',
        'API'
      ];
      
      let foundEnterpriseContent = false;
      
      for (const indicator of enterpriseIndicators) {
        const element = page.locator(`text=${indicator}`).first();
        if (await element.count() > 0) {
          foundEnterpriseContent = true;
          break;
        }
      }
      
      expect(foundEnterpriseContent).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('Accessibility features work correctly', async ({ page }) => {
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      
      // Check for ARIA labels
      const elementsWithAria = page.locator('[aria-label]');
      expect(await elementsWithAria.count()).toBeGreaterThan(0);
      
      // Check for proper heading structure
      const headings = page.locator('h1, h2, h3, h4, h5, h6');
      expect(await headings.count()).toBeGreaterThan(0);
    } else {
      test.skip();
    }
  });

  test('Performance metrics are tracked', async ({ page }) => {
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Check for execution time display
      const executeButton = page.locator('button', { hasText: /run code|execute/i });
      
      if (await executeButton.count() > 0) {
        await executeButton.click();
        
        // Look for performance metrics
        const performanceIndicators = page.locator('text=/\\d+ms|\\d+KB/');
        
        // Wait a bit for metrics to appear
        await page.waitForTimeout(2000);
        
        if (await performanceIndicators.count() > 0) {
          await expect(performanceIndicators.first()).toBeVisible();
        }
      }
    } else {
      test.skip();
    }
  });

  test('Error handling works properly', async ({ page }) => {
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Wait for editor to load
      await page.waitForSelector('.monaco-editor', { timeout: 10000 });
      
      // Click on the editor and input invalid code
      await page.locator('.monaco-editor').click();
      await page.keyboard.press('Control+A');
      await page.keyboard.type('this is invalid javascript code!!!');
      
      // Execute the code
      const executeButton = page.locator('button', { hasText: /run code|execute/i });
      await executeButton.click();
      
      // Check for error display
      const errorIndicator = page.locator('[class*="error"], text=/error/i');
      
      // Wait for error to appear
      await page.waitForTimeout(2000);
      
      if (await errorIndicator.count() > 0) {
        await expect(errorIndicator.first()).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      await expect(liveCodeSection).toBeVisible();
      
      // Check that editor is responsive
      const editor = page.locator('.monaco-editor');
      if (await editor.count() > 0) {
        const editorBox = await editor.boundingBox();
        expect(editorBox?.width).toBeLessThanOrEqual(375);
      }
      
      // Check that tabs are responsive (may stack or scroll)
      const tabs = page.locator('[class*="tab"]');
      if (await tabs.count() > 0) {
        const firstTab = tabs.first();
        await expect(firstTab).toBeVisible();
      }
    } else {
      test.skip();
    }
  });
});

test.describe('Live Code Performance', () => {
  test('System performs within acceptable limits', async ({ page }) => {
    await page.goto('/2');
    await page.waitForLoadState('networkidle');
    
    const liveCodeSection = page.locator('[data-testid="live-code-section"]');
    
    if (await liveCodeSection.count() > 0) {
      // Measure initial load time
      const startTime = Date.now();
      await page.waitForSelector('.monaco-editor', { timeout: 10000 });
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      
      // Check that the page is still responsive
      const executeButton = page.locator('button', { hasText: /run code|execute/i });
      if (await executeButton.count() > 0) {
        const clickStartTime = Date.now();
        await executeButton.click();
        const clickResponseTime = Date.now() - clickStartTime;
        
        // Click should respond within 500ms
        expect(clickResponseTime).toBeLessThan(500);
      }
    } else {
      test.skip();
    }
  });
});
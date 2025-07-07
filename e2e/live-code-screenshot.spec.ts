import { test, expect } from '@playwright/test';

test('Live Code Demonstrations Screenshot', async ({ page }) => {
  // Set viewport for desktop screenshot
  await page.setViewportSize({ width: 1400, height: 900 });
  
  // Navigate to technical expertise page
  await page.goto('/2/technical-expertise');
  
  // Wait for page to load completely
  await page.waitForLoadState('networkidle');
  
  // Wait a bit more for any dynamic content to load
  await page.waitForTimeout(3000);
  
  // Scroll to the live code section
  const liveCodeSection = page.locator('[data-testid="live-code-section"]');
  
  if (await liveCodeSection.count() > 0) {
    // Scroll the live code section into view
    await liveCodeSection.scrollIntoViewIfNeeded();
    
    // Wait for Monaco editor to load
    await page.waitForSelector('.monaco-editor', { timeout: 10000 });
    
    // Take screenshot of the live code section
    await liveCodeSection.screenshot({
      path: 'screenshots/live-code-demonstrations.png',
      animations: 'disabled'
    });
    
    console.log('✅ Live code demonstrations screenshot saved to screenshots/live-code-demonstrations.png');
  } else {
    console.log('❌ Live code section not found - taking full page screenshot instead');
    
    // Take full page screenshot as fallback
    await page.screenshot({
      path: 'screenshots/technical-expertise-full-page.png',
      fullPage: true,
      animations: 'disabled'
    });
  }
});
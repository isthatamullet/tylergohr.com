import { test } from '@playwright/test';

test('Debug footer visibility', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  
  // Navigate to homepage
  await page.goto('/2', { waitUntil: 'networkidle' });
  
  // Wait for page to load
  await page.waitForTimeout(5000);
  
  // Check if footer exists in DOM
  const footerCount = await page.locator('footer').count();
  console.log(`Footer elements found: ${footerCount}`);
  
  // Check if lazy-loaded Footer component exists
  const suspenseCount = await page.locator('div:has-text("Loading footer...")').count();
  console.log(`Footer loading placeholders found: ${suspenseCount}`);
  
  // Check for any elements with Footer text
  const githubLinks = await page.locator('text=GitHub').count();
  console.log(`GitHub links found: ${githubLinks}`);
  
  const homeLinks = await page.locator('text=Home').count();
  console.log(`Home links found: ${homeLinks}`);
  
  // Scroll to bottom of page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(2000);
  
  // Take full page screenshot for debugging
  await page.screenshot({ 
    path: 'screenshots/footer-review/debug-full-page.png',
    fullPage: true 
  });
  
  // Get page HTML to inspect structure
  const bodyHTML = await page.locator('body').innerHTML();
  console.log('Page structure includes footer:', bodyHTML.includes('<footer'));
  console.log('Page structure includes Footer component:', bodyHTML.includes('Footer'));
  
  // Check for Footer component specifically
  try {
    await page.locator('footer').waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Footer is visible');
    
    // Take footer screenshot
    await page.locator('footer').screenshot({ 
      path: 'screenshots/footer-review/debug-footer-element.png'
    });
  } catch (error) {
    console.log('❌ Footer not found or not visible:', error instanceof Error ? error.message : String(error));
  }
});
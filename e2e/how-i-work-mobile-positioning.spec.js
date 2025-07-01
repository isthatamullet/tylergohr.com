const { test, expect } = require('@playwright/test');

test.describe('How I Work Mobile Positioning Fix', () => {
  test('mobile hero positioning works correctly', async ({ page }) => {
    console.log('🔍 Testing How I Work mobile positioning fix...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to How I Work page
    await page.goto('/2/how-i-work');
    
    // Wait for page to be fully loaded (following successful test patterns)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Allow animations to settle
    
    // Wait for hero section to load using CSS Module compatible selector
    const heroContainer = page.locator('[class*="heroContainer"]');
    await expect(heroContainer).toBeVisible({ timeout: 10000 });
    
    // Check mobile CSS properties are applied correctly
    
    // Verify mobile override styles are active
    const mobileStyles = await heroContainer.evaluate((element) => {
      const computedStyles = window.getComputedStyle(element);
      return {
        position: computedStyles.position,
        top: computedStyles.top,
        left: computedStyles.left,
        display: computedStyles.display,
        maxWidth: computedStyles.maxWidth,
        margin: computedStyles.margin,
        transform: computedStyles.transform
      };
    });
    
    console.log('📊 Mobile styles applied:', mobileStyles);
    
    // Assert mobile positioning is correct
    expect(mobileStyles.position).toBe('relative');
    expect(mobileStyles.display).toBe('flex');
    expect(mobileStyles.maxWidth).toBe('337.5px'); // 90% of 375px mobile viewport
    expect(mobileStyles.top).toBe('0px'); // auto computes to 0px
    expect(mobileStyles.left).toBe('0px'); // auto computes to 0px
    expect(mobileStyles.transform).toBe('none');
    
    // Verify hero text is visible in viewport
    const heroTitle = page.getByRole('heading', { name: 'How I Work' });
    const heroDescription = page.getByText('Enterprise methodology from discovery to optimization');
    
    await expect(heroTitle).toBeVisible();
    await expect(heroDescription).toBeVisible();
    
    // Check that text is not cut off at bottom
    const heroTitleBox = await heroTitle.boundingBox();
    const heroDescBox = await heroDescription.boundingBox();
    const viewportHeight = 667;
    
    expect(heroTitleBox.y + heroTitleBox.height).toBeLessThan(viewportHeight);
    expect(heroDescBox.y + heroDescBox.height).toBeLessThan(viewportHeight);
    
    console.log('✅ Mobile hero text positioning verified');
  });
  
  test('desktop positioning remains unchanged', async ({ page }) => {
    console.log('🖥️ Testing desktop positioning preservation...');
    
    // Set desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Navigate to How I Work page
    await page.goto('/2/how-i-work');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Allow animations to settle
    
    // Wait for hero section to load using CSS Module compatible selector
    const heroContainer = page.locator('[class*="heroContainer"]');
    await expect(heroContainer).toBeVisible({ timeout: 10000 });
    
    // Check desktop CSS properties are preserved
    
    const desktopStyles = await heroContainer.evaluate((element) => {
      const computedStyles = window.getComputedStyle(element);
      return {
        position: computedStyles.position,
        top: computedStyles.top,
        left: computedStyles.left,
        transform: computedStyles.transform,
        width: computedStyles.width
      };
    });
    
    console.log('📊 Desktop styles preserved:', desktopStyles);
    
    // Assert desktop absolute positioning is preserved
    expect(desktopStyles.position).toBe('absolute');
    expect(desktopStyles.top).toBe('135px');
    expect(desktopStyles.left).toBe('600px'); // 50% of 1200px desktop viewport
    expect(desktopStyles.transform).toContain('matrix(1, 0, 0, 1, -400, 0)'); // translateX(-50%) computed
    expect(desktopStyles.width).toBe('800px');
    
    console.log('✅ Desktop positioning preserved');
  });
  
  test('mobile vs desktop comparison', async ({ page }) => {
    console.log('📱🖥️ Comparing mobile vs desktop layouts...');
    
    // Test mobile first
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/2/how-i-work');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const heroContainer = page.locator('[class*="heroContainer"]');
    await expect(heroContainer).toBeVisible({ timeout: 10000 });
    
    const mobilePosition = await heroContainer.evaluate((element) => {
      return window.getComputedStyle(element).position;
    });
    
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(heroContainer).toBeVisible({ timeout: 10000 });
    
    const desktopPosition = await heroContainer.evaluate((element) => {
      return window.getComputedStyle(element).position;
    });
    
    // Verify they are different as expected
    expect(mobilePosition).toBe('relative');
    expect(desktopPosition).toBe('absolute');
    
    console.log(`✅ Layout differs correctly: Mobile(${mobilePosition}) vs Desktop(${desktopPosition})`);
  });
  
  test('take comparison screenshots', async ({ page }) => {
    console.log('📸 Taking comparison screenshots...');
    
    // Mobile screenshot
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/2/how-i-work');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const heroContainer = page.locator('[class*="heroContainer"]');
    await expect(heroContainer).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ 
      path: 'test-results/how-i-work-mobile-fixed.png',
      fullPage: false 
    });
    
    // Desktop screenshot
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(heroContainer).toBeVisible({ timeout: 10000 });
    
    await page.screenshot({ 
      path: 'test-results/how-i-work-desktop-preserved.png',
      fullPage: false 
    });
    
    console.log('📸 Screenshots saved to test-results/');
  });
});
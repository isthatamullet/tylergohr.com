const { test, expect } = require('@playwright/test');

test.describe('How I Work Unified Hero Positioning', () => {
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
    
    // Assert mobile positioning is correct (unified simple approach)
    expect(mobileStyles.position).toBe('static'); // Simple positioning, no absolute
    expect(mobileStyles.display).toBe('flex');
    expect(mobileStyles.maxWidth).toBe('1200px'); // Full container width on mobile
    expect(mobileStyles.top).toBe('auto'); 
    expect(mobileStyles.left).toBe('auto');
    expect(mobileStyles.transform).toBe('none');
    
    // Verify hero text is visible in viewport
    const heroTitle = page.getByRole('heading', { name: 'How I Work' });
    const heroDescription = page.getByText('Enterprise methodology combining strategic planning with modern development practices');
    
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
  
  test('desktop positioning uses unified approach', async ({ page }) => {
    console.log('🖥️ Testing desktop unified positioning approach...');
    
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
    
    // Assert desktop simple positioning (unified approach)
    expect(desktopStyles.position).toBe('static'); // Simple positioning, matches other pages
    expect(desktopStyles.top).toBe('auto');
    expect(desktopStyles.left).toBe('auto');
    expect(desktopStyles.transform).toBe('none');
    expect(desktopStyles.width).toBe('1080px'); // Container width based on max-width: 1200px
    
    console.log('✅ Desktop positioning preserved');
  });
  
  test('unified positioning approach validation', async ({ page }) => {
    console.log('📱🖥️ Validating unified positioning across devices...');
    
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
    
    // Verify they use unified simple positioning approach
    expect(mobilePosition).toBe('static');
    expect(desktopPosition).toBe('static');
    
    console.log(`✅ Unified positioning approach: Mobile(${mobilePosition}) and Desktop(${desktopPosition})`);
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
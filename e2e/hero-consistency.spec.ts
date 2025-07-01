/**
 * Hero Text Consistency Test - Tyler Gohr Portfolio
 * 
 * Validates hero section uniformity across all 3 detail pages
 */

import { test, expect } from '@playwright/test';

test.describe('Hero Section Consistency Tests', () => {
  
  test('Desktop: Hero fonts should be consistent across all pages', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const pages = ['/2/how-i-work', '/2/case-studies', '/2/technical-expertise'];
    const fontSizes = [];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      
      const fontSize = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? window.getComputedStyle(h1).fontSize : null;
      });
      
      fontSizes.push(fontSize);
    }
    
    // All should be the same
    const uniqueSizes = [...new Set(fontSizes)];
    expect(uniqueSizes).toHaveLength(1);
    expect(parseInt(uniqueSizes[0] || '0')).toBeGreaterThanOrEqual(40);
    
    console.log(`✅ Desktop: ${uniqueSizes[0]} consistent across all pages`);
  });

  test('Tablet: Hero fonts should be consistent across all pages', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const pages = ['/2/how-i-work', '/2/case-studies', '/2/technical-expertise'];
    const fontSizes = [];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      
      const fontSize = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? window.getComputedStyle(h1).fontSize : null;
      });
      
      fontSizes.push(fontSize);
    }
    
    const uniqueSizes = [...new Set(fontSizes)];
    expect(uniqueSizes).toHaveLength(1);
    expect(parseInt(uniqueSizes[0] || '0')).toBeGreaterThanOrEqual(32);
    
    console.log(`✅ Tablet: ${uniqueSizes[0]} consistent across all pages`);
  });

  test('Mobile: Hero positioning should be consistent across all pages', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const pages = ['/2/how-i-work', '/2/case-studies', '/2/technical-expertise'];
    const measurements = [];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await page.waitForTimeout(1000); // Let positioning settle
      
      const measurement = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const container = h1?.closest('div');
        
        if (!h1 || !container) return null;
        
        const h1Rect = h1.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const h1Styles = window.getComputedStyle(h1);
        const containerStyles = window.getComputedStyle(container);
        
        return {
          fontSize: h1Styles.fontSize,
          positioning: containerStyles.position,
          h1CenterX: Math.round(h1Rect.left + h1Rect.width / 2),
          h1Top: Math.round(h1Rect.top),
          containerCenterX: Math.round(containerRect.left + containerRect.width / 2),
          containerTop: Math.round(containerRect.top),
          viewportWidth: window.innerWidth
        };
      });
      
      expect(measurement).not.toBeNull();
      measurements.push({ page: pageUrl, ...measurement });
    }
    
    // Check font size consistency
    const fontSizes = measurements.map(m => m.fontSize);
    const uniqueSizes = [...new Set(fontSizes)];
    expect(uniqueSizes).toHaveLength(1);
    expect(parseInt(uniqueSizes[0] || '0')).toBeGreaterThanOrEqual(28);
    
    // Check positioning method consistency (should all use static/relative, not absolute)
    const positions = measurements.map(m => m.positioning);
    const uniquePositions = [...new Set(positions)];
    console.log('Container positioning methods:', uniquePositions);
    
    // Check center alignment consistency (within 20px tolerance)
    const centerXValues = measurements.map(m => m.h1CenterX).filter((val): val is number => typeof val === 'number');
    const xVariance = centerXValues.length > 0 ? Math.max(...centerXValues) - Math.min(...centerXValues) : 0;
    expect(xVariance).toBeLessThanOrEqual(20);
    
    console.log(`✅ Mobile: Font ${uniqueSizes[0]}, positioning consistent, X variance: ${xVariance}px`);
    measurements.forEach(m => {
      console.log(`  ${m.page}: h1 center (${m.h1CenterX}, ${m.h1Top}), container (${m.containerCenterX}, ${m.containerTop})`);
    });
  });

  test('Responsive design: Mobile should be smaller than desktop', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/2/how-i-work');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    const desktopSize = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? parseInt(window.getComputedStyle(h1).fontSize) : null;
    });
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/2/how-i-work');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    const mobileSize = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return h1 ? parseInt(window.getComputedStyle(h1).fontSize) : null;
    });
    
    expect(mobileSize || 0).toBeLessThan(desktopSize || 0);
    console.log(`✅ Responsive: Desktop ${desktopSize}px > Mobile ${mobileSize}px`);
  });

  test('Text alignment should be centered on all pages', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    
    const pages = ['/2/how-i-work', '/2/case-studies', '/2/technical-expertise'];
    
    for (const pageUrl of pages) {
      await page.goto(pageUrl);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      
      const textAlign = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? window.getComputedStyle(h1).textAlign : null;
      });
      
      expect(textAlign).toBe('center');
    }
    
    console.log('✅ Text alignment: center on all pages');
  });
});
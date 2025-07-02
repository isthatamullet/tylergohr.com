import { test } from '@playwright/test';

const pages = [
  { name: 'homepage', url: '/2' },
  { name: 'case-studies', url: '/2/case-studies' },
  { name: 'how-i-work', url: '/2/how-i-work' },
  { name: 'technical-expertise', url: '/2/technical-expertise' }
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1200, height: 800 },
  { name: 'wide', width: 1400, height: 900 }
];

test.describe('Footer Visual Testing - Better Approach', () => {
  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} footer context - ${viewport.name}`, async ({ page: playwright }) => {
        // Set viewport
        await playwright.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });

        // Navigate to page
        await playwright.goto(page.url, { waitUntil: 'networkidle' });
        
        // Wait for components to load
        await playwright.waitForTimeout(4000);

        // Scroll to footer area
        await playwright.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        // Wait for scroll to complete
        await playwright.waitForTimeout(1500);

        // Take a screenshot of the bottom portion of the page that includes footer
        await playwright.screenshot({ 
          path: `screenshots/footer-review/${page.name}-footer-context-${viewport.name}.png`,
          animations: 'disabled',
          fullPage: false,
          clip: {
            x: 0,
            y: Math.max(0, viewport.height - 400), // Last 400px of viewport
            width: viewport.width,
            height: 400
          }
        });

        console.log(`📸 Footer context screenshot saved: ${page.name}-footer-context-${viewport.name}.png`);

        // Also try to get the footer element itself with padding
        try {
          const footer = playwright.locator('footer');
          await footer.waitFor({ state: 'visible', timeout: 5000 });
          
          // Get bounding box to check footer size
          const boundingBox = await footer.boundingBox();
          if (boundingBox) {
            console.log(`Footer dimensions: ${boundingBox.width}x${boundingBox.height}`);
            
            // Only take element screenshot if footer has reasonable dimensions
            if (boundingBox.height > 50) {
              await footer.screenshot({ 
                path: `screenshots/footer-review/${page.name}-footer-element-${viewport.name}.png`,
                animations: 'disabled'
              });
              console.log(`📸 Footer element screenshot saved: ${page.name}-footer-element-${viewport.name}.png`);
            }
          }
        } catch (error) {
          console.log(`⚠️  Could not capture footer element: ${error instanceof Error ? error.message : String(error)}`);
        }
      });
    }
  }
});
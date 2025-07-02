import { test } from '@playwright/test';

const pages = [
  { name: 'homepage', url: '/2' },
  { name: 'case-studies', url: '/2/case-studies' },
  { name: 'how-i-work', url: '/2/how-i-work' },
  { name: 'technical-expertise', url: '/2/technical-expertise' }
];

const viewports = [
  { name: 'mobile', width: 375, height: 812 },      // iPhone 12 Pro
  { name: 'tablet', width: 768, height: 1024 },     // iPad
  { name: 'desktop', width: 1200, height: 800 },    // Desktop
  { name: 'wide', width: 1400, height: 900 }        // Wide screen
];

test.describe('Footer Screenshots - All Breakpoints', () => {
  for (const page of pages) {
    for (const viewport of viewports) {
      test(`${page.name} footer - ${viewport.name}`, async ({ page: playwright }) => {
        // Set viewport
        await playwright.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        });

        // Navigate to page
        await playwright.goto(page.url, { waitUntil: 'networkidle' });

        // Wait for lazy-loaded components to render
        await playwright.waitForTimeout(3000);

        // Wait for footer to be visible (with longer timeout for lazy loading)
        try {
          const footer = playwright.locator('footer');
          await footer.waitFor({ state: 'visible', timeout: 10000 });
          
          // Scroll footer into view
          await footer.scrollIntoViewIfNeeded();
          
          // Wait for scroll animations to settle
          await playwright.waitForTimeout(1500);

          // Take screenshot of footer element
          await footer.screenshot({ 
            path: `screenshots/footer-review/${page.name}-footer-${viewport.name}.png`,
            animations: 'disabled'
          });

          console.log(`📸 Footer element screenshot saved: ${page.name}-footer-${viewport.name}.png`);
        } catch (error) {
          console.log(`⚠️  Footer element not found, taking full page footer area screenshot`);
          
          // Fallback: Scroll to bottom and take full page screenshot
          await playwright.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await playwright.waitForTimeout(1000);
          
          // Take full page screenshot showing footer area
          await playwright.screenshot({ 
            path: `screenshots/footer-review/${page.name}-footer-${viewport.name}-fullpage.png`,
            animations: 'disabled',
            fullPage: false
          });

          console.log(`📸 Fallback footer screenshot saved: ${page.name}-footer-${viewport.name}-fullpage.png`);
        }
      });
    }
  }
});
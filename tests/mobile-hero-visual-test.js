/**
 * Mobile Hero Visual Consistency Test
 * 
 * Takes screenshots of all 3 detail pages on mobile to verify visual consistency
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { name: 'how-i-work', url: '/2/how-i-work' },
  { name: 'case-studies', url: '/2/case-studies' },
  { name: 'technical-expertise', url: '/2/technical-expertise' }
];

async function takeHeroScreenshots() {
  console.log('🎯 Taking mobile hero screenshots for visual comparison...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set mobile viewport
  await page.setViewport({ width: 375, height: 667 });
  
  try {
    for (const pageInfo of PAGES) {
      console.log(`📱 Capturing ${pageInfo.name}...`);
      
      await page.goto(`${BASE_URL}${pageInfo.url}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Wait for hero section to be visible - try multiple selectors
      try {
        await page.waitForSelector('h1', { timeout: 5000 });
      } catch (e) {
        console.log(`   Warning: h1 not found immediately, trying alternative selectors...`);
        await page.waitForSelector('[role="heading"]', { timeout: 5000 });
      }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Let positioning settle
      
      // Take screenshot of hero area only
      const heroElement = await page.$('h1');
      if (heroElement) {
        const boundingBox = await heroElement.boundingBox();
        
        // Expand the box to capture surrounding context
        const screenshot = await page.screenshot({
          clip: {
            x: 0,
            y: Math.max(0, boundingBox.y - 100),
            width: 375,
            height: Math.min(400, 667 - Math.max(0, boundingBox.y - 100))
          }
        });
        
        const filename = `src/app/2/${pageInfo.name}-mobile-hero-fixed.png`;
        fs.writeFileSync(filename, screenshot);
        console.log(`✅ Screenshot saved: ${filename}`);
        
        // Get positioning info for comparison
        const position = await page.evaluate(() => {
          const h1 = document.querySelector('h1');
          if (!h1) return null;
          
          const rect = h1.getBoundingClientRect();
          const styles = window.getComputedStyle(h1);
          
          return {
            centerX: Math.round(rect.left + rect.width / 2),
            top: Math.round(rect.top),
            fontSize: styles.fontSize,
            text: h1.textContent?.substring(0, 30) + '...'
          };
        });
        
        if (position) {
          console.log(`   Text: "${position.text}"`);
          console.log(`   Position: center X=${position.centerX}, top=${position.top}`);
          console.log(`   Font size: ${position.fontSize}\n`);
        }
      }
    }
    
    console.log('🎉 All screenshots taken! Compare them visually to verify consistency.');
    console.log('📁 Screenshots saved in src/app/2/ directory with "-mobile-hero-fixed.png" suffix');
    
  } catch (error) {
    console.error('❌ Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
if (require.main === module) {
  takeHeroScreenshots().catch(console.error);
}

module.exports = { takeHeroScreenshots };
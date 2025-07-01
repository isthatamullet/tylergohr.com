/**
 * Hero Visual Comparison Test
 * 
 * Takes full mobile screenshots of all 3 detail pages for visual comparison
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { name: 'how-i-work', url: '/2/how-i-work' },
  { name: 'case-studies', url: '/2/case-studies' },
  { name: 'technical-expertise', url: '/2/technical-expertise' }
];

async function captureHeroComparison() {
  console.log('📱 Taking mobile hero comparison screenshots...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set mobile viewport (iPhone SE)
  await page.setViewport({ width: 375, height: 667 });
  
  try {
    for (const pageInfo of PAGES) {
      console.log(`📸 Capturing ${pageInfo.name}...`);
      
      await page.goto(`${BASE_URL}${pageInfo.url}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Wait for page to fully load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Get page info for debugging
      const pageAnalysis = await page.evaluate(() => {
        const h1Elements = document.querySelectorAll('h1');
        const title = document.title;
        const url = window.location.href;
        
        const h1Info = Array.from(h1Elements).map((h1, index) => {
          const rect = h1.getBoundingClientRect();
          const styles = window.getComputedStyle(h1);
          
          return {
            index,
            text: h1.textContent?.trim().substring(0, 50),
            centerX: Math.round(rect.left + rect.width / 2),
            top: Math.round(rect.top),
            fontSize: styles.fontSize,
            visible: rect.width > 0 && rect.height > 0
          };
        });
        
        return {
          title,
          url,
          h1Count: h1Elements.length,
          h1Info,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight
        };
      });
      
      console.log(`   Page: ${pageAnalysis.title}`);
      console.log(`   URL: ${pageAnalysis.url}`);
      console.log(`   H1 elements found: ${pageAnalysis.h1Count}`);
      
      pageAnalysis.h1Info.forEach(h1 => {
        console.log(`   H1 #${h1.index}: "${h1.text}" at (${h1.centerX}, ${h1.top}), size: ${h1.fontSize}, visible: ${h1.visible}`);
      });
      
      // Take full mobile screenshot
      const screenshot = await page.screenshot({
        fullPage: false, // Just viewport
        type: 'png'
      });
      
      const filename = `screenshots/mobile-${pageInfo.name}-hero-comparison.png`;
      
      // Ensure screenshots directory exists
      if (!fs.existsSync('screenshots')) {
        fs.mkdirSync('screenshots');
      }
      
      fs.writeFileSync(filename, screenshot);
      console.log(`✅ Screenshot saved: ${filename}\n`);
    }
    
    console.log('🎉 All mobile hero screenshots captured!');
    console.log('📁 View screenshots in the /screenshots directory');
    console.log('👀 Compare them visually to verify hero section consistency');
    
  } catch (error) {
    console.error('❌ Error taking screenshots:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
if (require.main === module) {
  captureHeroComparison().catch(console.error);
}

module.exports = { captureHeroComparison };
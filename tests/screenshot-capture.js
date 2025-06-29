/**
 * Screenshot Capture for Logo Analysis
 * Captures production site screenshot for design review
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function captureScreenshot() {
  console.log('📸 Capturing screenshot of tylergohr.com/2...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to production site
    const url = 'https://tylergohr.com/2';
    console.log(`📍 Capturing: ${url}`);
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Wait for everything to load including logos and hero section
    await page.waitForSelector('nav', { timeout: 10000 });
    await page.waitForSelector('[id*="hero"]', { timeout: 10000 });
    
    // Additional wait for any animations or logo loading
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('✅ Page loaded, capturing screenshot...');
    
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `logo-analysis-${timestamp}.png`;
    const filepath = path.join(screenshotsDir, filename);
    
    // Capture full page screenshot
    await page.screenshot({ 
      path: filepath,
      fullPage: true,
      type: 'png'
    });
    
    console.log(`✅ Screenshot saved: ${filepath}`);
    console.log('\n📋 Screenshot Details:');
    console.log(`   File: ${filename}`);
    console.log(`   Path: ${filepath}`);
    console.log(`   Type: Full page PNG`);
    console.log(`   URL: ${url}`);
    
    // Get page dimensions for reference
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    }));
    
    console.log(`   Dimensions: ${dimensions.width}x${dimensions.height}`);
    console.log(`   Viewport: ${dimensions.viewportWidth}x${dimensions.viewportHeight}`);
    
    console.log('\n🎯 Logo Analysis Ready:');
    console.log('   - Navigation logo in top left corner');
    console.log('   - Hero section logo above "Solutions" text');
    console.log('   - Full page context captured for design review');
    
  } catch (error) {
    console.error('❌ Screenshot capture failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Main execution
async function main() {
  await captureScreenshot();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { captureScreenshot };
const puppeteer = require('puppeteer');
const path = require('path');

async function captureHeroSection() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('📸 Capturing hero section of tylergohr.com/2...');
    
    // Navigate to page
    await page.goto('https://tylergohr.com/2', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Page loaded, capturing hero section...');
    
    // Wait for hero section to be visible
    await page.waitForSelector('#hero', { timeout: 10000 });
    
    // Get hero section element
    const heroElement = await page.$('#hero');
    
    if (heroElement) {
      // Take screenshot of just the hero section
      const screenshotPath = path.join(__dirname, '..', 'screenshots', `hero-section-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.png`);
      
      await heroElement.screenshot({
        path: screenshotPath,
        type: 'png'
      });
      
      console.log(`✅ Hero section screenshot saved: ${screenshotPath}`);
      console.log(`📋 Hero Section Details:`);
      console.log(`   File: ${path.basename(screenshotPath)}`);
      console.log(`   Path: ${screenshotPath}`);
      console.log(`   Type: Hero section PNG`);
      console.log(`   URL: https://tylergohr.com/2`);
      console.log(`   Focus: Hero section with animated clouds`);
    } else {
      console.log('❌ Hero section not found');
    }
    
  } catch (error) {
    console.error('❌ Error capturing hero section:', error);
  } finally {
    await browser.close();
  }
}

captureHeroSection();
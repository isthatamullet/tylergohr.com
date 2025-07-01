const puppeteer = require('puppeteer');
const path = require('path');

async function captureLocalHeroSection() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1200, height: 800 });
    
    console.log('📸 Capturing LOCAL hero section from localhost:3005/2...');
    
    // Navigate to LOCAL development server
    await page.goto('http://localhost:3005/2', { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    console.log('✅ Local page loaded, capturing hero section...');
    
    // Wait for hero section to be visible
    await page.waitForSelector('#hero', { timeout: 10000 });
    
    // Get hero section element
    const heroElement = await page.$('#hero');
    
    if (heroElement) {
      // Take screenshot of just the hero section
      const screenshotPath = path.join(__dirname, '..', 'screenshots', `local-hero-animated-${new Date().toISOString().replace(/:/g, '-').split('.')[0]}.png`);
      
      await heroElement.screenshot({
        path: screenshotPath,
        type: 'png'
      });
      
      console.log(`✅ LOCAL animated hero screenshot saved: ${screenshotPath}`);
      console.log(`📋 Local Hero Section Details:`);
      console.log(`   File: ${path.basename(screenshotPath)}`);
      console.log(`   Path: ${screenshotPath}`);
      console.log(`   Type: Animated hero section PNG`);
      console.log(`   URL: http://localhost:3005/2`);
      console.log(`   Focus: Hero section with animated clouds (LOCAL)`);
      
      // Also log what images are being loaded
      console.log('🖼️  Checking loaded images...');
      
      const images = await page.evaluate(() => {
        const imgElements = document.querySelectorAll('#hero img');
        return Array.from(imgElements).map(img => ({
          src: img.src,
          width: img.width,
          height: img.height,
          className: img.className
        }));
      });
      
      console.log('📄 Images found in hero section:', images);
      
    } else {
      console.log('❌ Hero section not found');
    }
    
  } catch (error) {
    console.error('❌ Error capturing local hero section:', error);
  } finally {
    await browser.close();
  }
}

captureLocalHeroSection();
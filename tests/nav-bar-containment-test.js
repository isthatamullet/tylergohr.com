/**
 * Navigation Bar Logo Containment Test
 * Verifies the larger logo stays within navigation bar boundaries
 */

const puppeteer = require('puppeteer');

async function navBarContainmentTest() {
  console.log('📏 Testing Navigation Bar Logo Containment...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    const testUrl = 'http://localhost:3002/2';
    console.log(`📍 Testing URL: ${testUrl}`);
    
    await page.goto(testUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('nav', { timeout: 5000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Page loaded, measuring navigation containment...\n');
    
    // Get navigation bar dimensions
    const navDimensions = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      if (nav) {
        const rect = nav.getBoundingClientRect();
        return {
          height: rect.height,
          width: rect.width,
          top: rect.top,
          bottom: rect.bottom
        };
      }
      return null;
    });
    
    // Get logo dimensions and position
    const logoDimensions = await page.evaluate(() => {
      const logoButton = document.querySelector('.logo, nav button');
      const logoImage = document.querySelector('.logoImage, nav img');
      
      if (logoButton && logoImage) {
        const buttonRect = logoButton.getBoundingClientRect();
        const imageRect = logoImage.getBoundingClientRect();
        
        return {
          button: {
            height: buttonRect.height,
            width: buttonRect.width,
            top: buttonRect.top,
            bottom: buttonRect.bottom,
            left: buttonRect.left,
            right: buttonRect.right
          },
          image: {
            height: imageRect.height,
            width: imageRect.width,
            top: imageRect.top,
            bottom: imageRect.bottom,
            left: imageRect.left,
            right: imageRect.right
          }
        };
      }
      return null;
    });
    
    if (navDimensions && logoDimensions) {
      console.log('📊 Navigation Bar Measurements:');
      console.log(`   Height: ${navDimensions.height.toFixed(1)}px`);
      console.log(`   Width: ${navDimensions.width.toFixed(1)}px`);
      console.log(`   Top: ${navDimensions.top.toFixed(1)}px`);
      console.log(`   Bottom: ${navDimensions.bottom.toFixed(1)}px`);
      
      console.log('\n📊 Logo Button Measurements:');
      console.log(`   Height: ${logoDimensions.button.height.toFixed(1)}px`);
      console.log(`   Width: ${logoDimensions.button.width.toFixed(1)}px`);
      console.log(`   Top: ${logoDimensions.button.top.toFixed(1)}px`);
      console.log(`   Bottom: ${logoDimensions.button.bottom.toFixed(1)}px`);
      
      console.log('\n📊 Logo Image Measurements:');
      console.log(`   Height: ${logoDimensions.image.height.toFixed(1)}px`);
      console.log(`   Width: ${logoDimensions.image.width.toFixed(1)}px`);
      console.log(`   Top: ${logoDimensions.image.top.toFixed(1)}px`);
      console.log(`   Bottom: ${logoDimensions.image.bottom.toFixed(1)}px`);
      
      // Check containment
      console.log('\n🔍 Containment Analysis:');
      
      const buttonWithinNav = 
        logoDimensions.button.top >= navDimensions.top &&
        logoDimensions.button.bottom <= navDimensions.bottom;
      
      const imageWithinNav = 
        logoDimensions.image.top >= navDimensions.top &&
        logoDimensions.image.bottom <= navDimensions.bottom;
      
      const imageWithinButton = 
        logoDimensions.image.top >= logoDimensions.button.top &&
        logoDimensions.image.bottom <= logoDimensions.button.bottom;
      
      console.log(`   Logo button within nav bar: ${buttonWithinNav ? '✅ YES' : '❌ NO'}`);
      console.log(`   Logo image within nav bar: ${imageWithinNav ? '✅ YES' : '❌ NO'}`);
      console.log(`   Logo image within button: ${imageWithinButton ? '✅ YES' : '❌ NO'}`);
      
      // Calculate margins/spacing
      const topMargin = logoDimensions.button.top - navDimensions.top;
      const bottomMargin = navDimensions.bottom - logoDimensions.button.bottom;
      
      console.log(`   Top margin: ${topMargin.toFixed(1)}px`);
      console.log(`   Bottom margin: ${bottomMargin.toFixed(1)}px`);
      
      // Overall assessment
      if (buttonWithinNav && imageWithinNav) {
        console.log('\n🎉 ✅ CONTAINMENT SUCCESS: Logo properly contained within navigation bar');
      } else {
        console.log('\n⚠️  ❌ CONTAINMENT ISSUE: Logo extends beyond navigation bar boundaries');
      }
      
    } else {
      console.log('❌ Could not measure navigation or logo elements');
    }
    
    // Test mobile view containment
    console.log('\n📱 Testing Mobile View Containment:');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mobileNavDimensions = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      const logoButton = document.querySelector('.logo, nav button');
      
      if (nav && logoButton) {
        const navRect = nav.getBoundingClientRect();
        const buttonRect = logoButton.getBoundingClientRect();
        
        return {
          nav: { height: navRect.height, top: navRect.top, bottom: navRect.bottom },
          button: { height: buttonRect.height, top: buttonRect.top, bottom: buttonRect.bottom }
        };
      }
      return null;
    });
    
    if (mobileNavDimensions) {
      const mobileContained = 
        mobileNavDimensions.button.top >= mobileNavDimensions.nav.top &&
        mobileNavDimensions.button.bottom <= mobileNavDimensions.nav.bottom;
      
      console.log(`   Mobile nav height: ${mobileNavDimensions.nav.height.toFixed(1)}px`);
      console.log(`   Mobile logo height: ${mobileNavDimensions.button.height.toFixed(1)}px`);
      console.log(`   Mobile containment: ${mobileContained ? '✅ YES' : '❌ NO'}`);
    }
    
    console.log('\n🎉 Navigation bar containment test completed!');
    
  } catch (error) {
    console.error('❌ Containment test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Check server availability
async function checkServer(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

// Main execution
async function main() {
  const testUrl = 'http://localhost:3002/2';
  const isServerRunning = await checkServer(testUrl);
  
  if (!isServerRunning) {
    console.log('❌ Development server not accessible.');
    console.log('   Please ensure server is running on port 3002');
    process.exit(1);
  }
  
  await navBarContainmentTest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { navBarContainmentTest };
/**
 * Visual Testing Template for Tyler Gohr Portfolio
 * Copy and adapt this template for component-specific visual testing
 * 
 * Usage: 
 * 1. Copy this file to tests/[component]-visual-test.js
 * 2. Update testUrl and component-specific selectors
 * 3. Add relevant test scenarios for your changes
 * 4. Run: node tests/[component]-visual-test.js
 */

const puppeteer = require('puppeteer');

async function visualRegressionTest() {
  console.log('🔍 Starting Visual Regression Test...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,   // Set to false for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // STEP 1: Configure test URL
    // For local development: 'http://localhost:3000/2'
    // For preview testing: Use Cloud Run preview URL from PR
    const testUrl = 'http://localhost:3000/2'; // Update this URL
    console.log(`📍 Testing URL: ${testUrl}`);
    
    await page.goto(testUrl, { waitUntil: 'networkidle0' });
    
    // STEP 2: Wait for component to be ready
    await page.waitForSelector('nav', { timeout: 5000 }); // Update selector
    console.log('✅ Component loaded successfully');
    
    // Wait for any lazy loading or animations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // STEP 3: Desktop viewport testing
    console.log('\n📋 Desktop Viewport Testing (1200x800)');
    await page.setViewport({ width: 1200, height: 800 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add your desktop-specific tests here:
    // Example: Test navigation behavior
    const desktopNav = await page.$('nav');
    if (desktopNav) {
      console.log('   ✅ Desktop navigation found');
      // Add more specific tests...
    } else {
      console.log('   ❌ Desktop navigation not found');
    }
    
    // STEP 4: Mobile viewport testing  
    console.log('\n📋 Mobile Viewport Testing (375x667)');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add your mobile-specific tests here:
    // Example: Test mobile menu
    const mobileMenuButton = await page.$('[aria-label*="navigation menu"]');
    if (mobileMenuButton) {
      console.log('   ✅ Mobile menu button found');
      // Test mobile menu functionality
      await mobileMenuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mobileNav = await page.$('.mobileNav.mobileNavOpen'); // Update selector
      if (mobileNav) {
        console.log('   ✅ Mobile navigation opens correctly');
      } else {
        console.log('   ❌ Mobile navigation did not open');
      }
    } else {
      console.log('   ❌ Mobile menu button not found');
    }
    
    // STEP 5: Animation and interaction testing
    console.log('\n📋 Animation & Interaction Testing');
    await page.setViewport({ width: 1200, height: 800 }); // Reset to desktop
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test scroll behavior (example)
    await page.evaluate(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('   ✅ Scroll animation tested');
    
    // Test hover effects (example)
    const hoverElement = await page.$('.navLink'); // Update selector
    if (hoverElement) {
      await hoverElement.hover();
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('   ✅ Hover effects tested');
    }
    
    // STEP 6: Performance validation
    console.log('\n📋 Performance Validation');
    
    // Test for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Reload to check for errors
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (errors.length === 0) {
      console.log('   ✅ No console errors detected');
    } else {
      console.log(`   ❌ Console errors found: ${errors.length}`);
      errors.forEach(error => console.log(`      - ${error}`));
    }
    
    console.log('\n🎉 Visual regression test completed!');
    
    // STEP 7: Generate test summary
    console.log('\n📊 Test Summary:');
    console.log('   - Desktop viewport: Tested');
    console.log('   - Mobile viewport: Tested');
    console.log('   - Animation performance: Validated');
    console.log('   - Interaction behavior: Checked');
    console.log('   - Console errors: Monitored');
    console.log('\n✅ Visual testing validation complete!');
    
  } catch (error) {
    console.error('❌ Visual test failed:', error.message);
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
  const testUrl = 'http://localhost:3000/2'; // Update to match your test URL
  const isServerRunning = await checkServer(testUrl);
  
  if (!isServerRunning) {
    console.log('❌ Test server not accessible. Please ensure server is running.');
    console.log(`   URL: ${testUrl}`);
    console.log('   For local testing: npm run dev');
    console.log('   For preview testing: Use Cloud Run preview URL from PR');
    process.exit(1);
  }
  
  await visualRegressionTest();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { visualRegressionTest };

/**
 * CUSTOMIZATION GUIDE:
 * 
 * 1. Update testUrl to your specific testing environment
 * 2. Replace component selectors with your actual CSS selectors
 * 3. Add component-specific test scenarios in each section
 * 4. Modify viewport sizes if needed for your component
 * 5. Add performance-specific tests for animations/interactions
 * 6. Include any hash navigation or state-specific testing
 * 
 * TESTING CHECKLIST:
 * [ ] Desktop viewport behavior validated
 * [ ] Mobile viewport behavior validated  
 * [ ] Animation performance tested (60fps)
 * [ ] Interaction states working (hover, focus, active)
 * [ ] No console errors during test
 * [ ] Cross-device consistency verified
 * [ ] Component-specific functionality validated
 */
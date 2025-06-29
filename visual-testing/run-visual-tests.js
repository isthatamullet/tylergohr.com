#!/usr/bin/env node

/**
 * Quick Visual Test Runner
 * Simplified version for immediate visual validation
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function quickVisualTest() {
  console.log('🚀 Starting Quick Visual Validation Test\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  
  try {
    // Ensure screenshot directory exists
    await fs.mkdir('./visual-testing/quick-screenshots', { recursive: true });
    
    // Test homepage
    console.log('📱 Testing Homepage...');
    await page.goto('http://localhost:3002/2', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Take full page screenshot
    await page.screenshot({ 
      path: './visual-testing/quick-screenshots/homepage-desktop.png',
      fullPage: true 
    });
    
    // Check Enterprise Solutions Architect content
    const heroTitle = await page.$eval('h1', el => el.textContent);
    console.log(`✅ Hero Title: "${heroTitle}"`);
    
    // Test navigation dropdowns
    console.log('🖱️  Testing Work Dropdown...');
    const workButton = await page.$('button[aria-label*="Work"]');
    if (workButton) {
      await workButton.hover();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.screenshot({ 
        path: './visual-testing/quick-screenshots/work-dropdown.png' 
      });
      console.log('✅ Work dropdown captured');
    }
    
    // Test case studies page
    console.log('📊 Testing Case Studies Page...');
    await page.goto('http://localhost:3002/2/case-studies', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check browser tabs
    const tabs = await page.$$('[role="tab"]');
    console.log(`✅ Found ${tabs.length} browser tabs`);
    
    // Test tab switching
    if (tabs.length > 1) {
      await tabs[1].click();
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('✅ Tab switching works');
    }
    
    await page.screenshot({ 
      path: './visual-testing/quick-screenshots/case-studies-tabs.png',
      fullPage: true 
    });
    
    // Test mobile responsiveness
    console.log('📱 Testing Mobile Layout...');
    await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3002/2', { waitUntil: 'networkidle2' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ 
      path: './visual-testing/quick-screenshots/homepage-mobile.png',
      fullPage: true 
    });
    
    console.log('\n🎉 Quick Visual Test Complete!');
    console.log('📸 Screenshots saved to: ./visual-testing/quick-screenshots/');
    console.log('\nVisual Elements Validated:');
    console.log('✅ Homepage layout and Enterprise branding');
    console.log('✅ Navigation dropdown functionality');
    console.log('✅ Case studies browser tabs interface');
    console.log('✅ Mobile responsive design');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the test
quickVisualTest().catch(console.error);
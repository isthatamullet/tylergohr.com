/**
 * Navigation Active Link Scroll Test
 * Tests /2 navigation active link detection during scroll behavior
 * 
 * Run with: node tests/navigation-scroll-test.js
 */

const puppeteer = require('puppeteer');

async function testNavigationScrollBehavior() {
  console.log('🚀 Starting Navigation Scroll Test...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,   // Required for server environments
    args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for server environments
    defaultViewport: { width: 1200, height: 800 }
  });
  
  const page = await browser.newPage();
  
  try {
    // Test Cloud Run preview deployment
    const testUrl = 'https://portfolio-pr-51-fix-nav-active-gizje4k4na-uc.a.run.app/2';
    console.log(`📍 Testing URL: ${testUrl}`);
    
    await page.goto(testUrl, { waitUntil: 'networkidle0' });
    
    // Wait for navigation component to be ready
    await page.waitForSelector('nav', { timeout: 5000 });
    console.log('✅ Navigation component loaded');
    
    // Wait for sections to be available (lazy loading)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 1: Initial page load - should default to "about"
    console.log('\n📋 Test 1: Initial Active State');
    const initialActiveLink = await page.$('[aria-current="page"]');
    if (initialActiveLink) {
      const activeLinkText = await page.evaluate(el => el.textContent, initialActiveLink);
      console.log(`   Initial active link: ${activeLinkText}`);
    } else {
      console.log('   ❌ No active link found on initial load');
    }
    
    // Test 2: Slow scroll through sections
    console.log('\n📋 Test 2: Slow Scroll Through Sections');
    const sections = ['hero', 'about', 'results', 'work', 'process', 'skills', 'contact'];
    
    for (let i = 0; i < sections.length; i++) {
      const sectionId = sections[i];
      
      // Scroll to section
      await page.evaluate((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, sectionId);
      
      // Wait for scroll to complete and observer to update
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check active link
      const activeLink = await page.$('[aria-current="page"]');
      if (activeLink) {
        const activeLinkText = await page.evaluate(el => el.textContent, activeLink);
        const isExpectedActive = activeLinkText.toLowerCase() === sectionId.toLowerCase() || 
                                (sectionId === 'work' && activeLinkText === 'Work') ||
                                (sectionId === 'process' && activeLinkText === 'Process') ||
                                (sectionId === 'skills' && activeLinkText === 'Skills');
        
        console.log(`   Section: ${sectionId} -> Active: ${activeLinkText} ${isExpectedActive ? '✅' : '❌'}`);
      } else {
        console.log(`   Section: ${sectionId} -> No active link found ❌`);
      }
    }
    
    // Test 3: Hash navigation
    console.log('\n📋 Test 3: Hash Navigation');
    const hashTests = ['#work', '#skills', '#contact'];
    
    for (const hash of hashTests) {
      await page.goto(`${testUrl}${hash}`, { waitUntil: 'networkidle0' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const activeLink = await page.$('[aria-current="page"]');
      if (activeLink) {
        const activeLinkText = await page.evaluate(el => el.textContent, activeLink);
        console.log(`   Hash ${hash} -> Active: ${activeLinkText}`);
      } else {
        console.log(`   Hash ${hash} -> No active link found ❌`);
      }
    }
    
    // Test 4: Fast scroll behavior
    console.log('\n📋 Test 4: Fast Scroll Behavior');
    await page.goto(testUrl, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fast scroll to bottom
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let activeLink = await page.$('[aria-current="page"]');
    if (activeLink) {
      const activeLinkText = await page.evaluate(el => el.textContent, activeLink);
      console.log(`   Fast scroll to bottom -> Active: ${activeLinkText}`);
    }
    
    // Fast scroll to top
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    activeLink = await page.$('[aria-current="page"]');
    if (activeLink) {
      const activeLinkText = await page.evaluate(el => el.textContent, activeLink);
      console.log(`   Fast scroll to top -> Active: ${activeLinkText}`);
    }
    
    // Test 5: Mobile viewport
    console.log('\n📋 Test 5: Mobile Viewport Behavior');
    await page.setViewport({ width: 375, height: 667 }); // iPhone SE
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test mobile navigation
    const mobileMenuButton = await page.$('[aria-label*="navigation menu"]');
    if (mobileMenuButton) {
      console.log('   ✅ Mobile menu button found');
      await mobileMenuButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mobileNav = await page.$('.mobileNav.mobileNavOpen');
      if (mobileNav) {
        console.log('   ✅ Mobile navigation opens correctly');
      } else {
        console.log('   ❌ Mobile navigation did not open');
      }
    } else {
      console.log('   ❌ Mobile menu button not found');
    }
    
    console.log('\n🎉 Navigation scroll test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

// Check if we have a local dev server running
async function checkPreviewServer() {
  try {
    const response = await fetch('https://portfolio-pr-51-fix-nav-active-gizje4k4na-uc.a.run.app/2');
    return response.ok;
  } catch {
    return false;
  }
}

// Main execution
async function main() {
  const isPreviewRunning = await checkPreviewServer();
  
  if (!isPreviewRunning) {
    console.log('❌ Preview deployment not accessible. Please check the URL.');
    console.log('   URL: https://portfolio-pr-51-fix-nav-active-gizje4k4na-uc.a.run.app/2');
    process.exit(1);
  }
  
  await testNavigationScrollBehavior();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testNavigationScrollBehavior };
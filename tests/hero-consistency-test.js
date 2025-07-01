/**
 * Hero Text Consistency Test - Tyler Gohr Portfolio
 * 
 * Tests hero text size and positioning consistency across all 3 detail pages:
 * - /2/how-i-work
 * - /2/case-studies  
 * - /2/technical-expertise
 * 
 * Cross-device testing: Desktop, Tablet, Mobile
 * 
 * Usage: node tests/hero-consistency-test.js
 */

const puppeteer = require('puppeteer');

// Test configuration
const TEST_PAGES = [
  { name: 'How I Work', url: '/2/how-i-work' },
  { name: 'Case Studies', url: '/2/case-studies' },
  { name: 'Technical Expertise', url: '/2/technical-expertise' }
];

const VIEWPORTS = [
  { name: 'Desktop', width: 1200, height: 800 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 }
];

// Base URL - update for testing environment
const BASE_URL = 'http://localhost:3000'; // Change to preview URL when testing PRs

async function measureHeroElement(page, selector, description) {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    
    const measurements = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!element) return null;
      
      const rect = element.getBoundingClientRect();
      const styles = window.getComputedStyle(element);
      
      return {
        // Position measurements
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        centerX: Math.round(rect.left + rect.width / 2),
        centerY: Math.round(rect.top + rect.height / 2),
        
        // Style measurements
        fontSize: styles.fontSize,
        lineHeight: styles.lineHeight,
        marginBottom: styles.marginBottom,
        padding: styles.padding,
        paddingLeft: styles.paddingLeft,
        paddingRight: styles.paddingRight,
        textAlign: styles.textAlign,
        
        // Responsive measurements
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        
        // Text content
        textContent: element.textContent?.trim() || '',
        textLength: element.textContent?.trim().length || 0
      };
    }, selector);
    
    if (measurements) {
      console.log(`  ✅ ${description}:`);
      console.log(`     Position: (${measurements.centerX}, ${measurements.centerY}) - Center point`);
      console.log(`     Size: ${measurements.width}x${measurements.height}px`);
      console.log(`     Font: ${measurements.fontSize} (${measurements.lineHeight} line-height)`);
      console.log(`     Padding: ${measurements.paddingLeft} | ${measurements.paddingRight}`);
      console.log(`     Text: "${measurements.textContent.substring(0, 50)}${measurements.textContent.length > 50 ? '...' : ''}"`);
      console.log(`     Length: ${measurements.textLength} characters`);
    }
    
    return measurements;
  } catch (error) {
    console.log(`  ❌ ${description}: Element not found or error - ${error.message}`);
    return null;
  }
}

async function testPageHeroConsistency(browser, pageName, pageUrl, viewport) {
  console.log(`\n📱 Testing ${pageName} on ${viewport.name} (${viewport.width}x${viewport.height})`);
  console.log(`   URL: ${BASE_URL}${pageUrl}`);
  
  const page = await browser.newPage();
  await page.setViewport(viewport);
  
  try {
    // Navigate to page
    await page.goto(`${BASE_URL}${pageUrl}`, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Wait for hero section to be ready
    await page.waitForSelector('.heroTitle', { timeout: 10000 });
    
    // Give extra time for CSS and positioning to settle
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Measure hero title
    const heroTitle = await measureHeroElement(
      page, 
      '.heroTitle', 
      'Hero Title'
    );
    
    // Measure hero description  
    const heroDescription = await measureHeroElement(
      page, 
      '.heroDescription', 
      'Hero Description'
    );
    
    // Measure hero container
    const heroContainer = await measureHeroElement(
      page, 
      '.heroContainer', 
      'Hero Container'
    );
    
    await page.close();
    
    return {
      pageName,
      viewport: viewport.name,
      measurements: {
        heroTitle,
        heroDescription,
        heroContainer
      }
    };
    
  } catch (error) {
    console.log(`  ❌ Error testing ${pageName}: ${error.message}`);
    await page.close();
    return null;
  }
}

function compareHeroMeasurements(results) {
  console.log('\n📊 HERO CONSISTENCY ANALYSIS\n');
  
  // Group results by viewport
  const byViewport = {};
  results.forEach(result => {
    if (!result) return;
    if (!byViewport[result.viewport]) {
      byViewport[result.viewport] = [];
    }
    byViewport[result.viewport].push(result);
  });
  
  // Analyze each viewport
  Object.keys(byViewport).forEach(viewportName => {
    const viewportResults = byViewport[viewportName];
    
    console.log(`\n🔍 ${viewportName.toUpperCase()} ANALYSIS:`);
    
    if (viewportResults.length < 3) {
      console.log(`   ⚠️  Only ${viewportResults.length} pages tested, need all 3 for comparison`);
      return;
    }
    
    // Compare hero titles
    console.log('\n   📝 HERO TITLE CONSISTENCY:');
    const titleMeasurements = viewportResults
      .filter(r => r.measurements.heroTitle)
      .map(r => ({
        page: r.pageName,
        ...r.measurements.heroTitle
      }));
    
    if (titleMeasurements.length > 1) {
      // Check font size consistency
      const fontSizes = titleMeasurements.map(m => m.fontSize);
      const uniqueFontSizes = [...new Set(fontSizes)];
      
      if (uniqueFontSizes.length === 1) {
        console.log(`   ✅ Font sizes consistent: ${uniqueFontSizes[0]}`);
      } else {
        console.log(`   ❌ Font size inconsistency found:`);
        titleMeasurements.forEach(m => {
          console.log(`      ${m.page}: ${m.fontSize}`);
        });
      }
      
      // Check positioning consistency (center points)
      const centerXValues = titleMeasurements.map(m => m.centerX);
      const centerYValues = titleMeasurements.map(m => m.centerY);
      
      const xVariance = Math.max(...centerXValues) - Math.min(...centerXValues);
      const yVariance = Math.max(...centerYValues) - Math.min(...centerYValues);
      
      console.log(`   📍 Position variance: X=${xVariance}px, Y=${yVariance}px`);
      
      if (xVariance <= 10 && yVariance <= 10) {
        console.log(`   ✅ Position consistency excellent (≤10px variance)`);
      } else if (xVariance <= 20 && yVariance <= 20) {
        console.log(`   ⚠️  Position consistency acceptable (≤20px variance)`);
      } else {
        console.log(`   ❌ Position inconsistency detected (>20px variance)`);
        titleMeasurements.forEach(m => {
          console.log(`      ${m.page}: Center (${m.centerX}, ${m.centerY})`);
        });
      }
      
      // Check text length consistency
      const textLengths = titleMeasurements.map(m => m.textLength);
      const avgLength = textLengths.reduce((a, b) => a + b, 0) / textLengths.length;
      const lengthVariance = Math.max(...textLengths) - Math.min(...textLengths);
      
      console.log(`   📏 Text lengths: avg=${Math.round(avgLength)}, variance=${lengthVariance}`);
      titleMeasurements.forEach(m => {
        console.log(`      ${m.page}: ${m.textLength} chars`);
      });
    }
    
    // Compare hero descriptions
    console.log('\n   📄 HERO DESCRIPTION CONSISTENCY:');
    const descMeasurements = viewportResults
      .filter(r => r.measurements.heroDescription)
      .map(r => ({
        page: r.pageName,
        ...r.measurements.heroDescription
      }));
    
    if (descMeasurements.length > 1) {
      // Check font size consistency
      const descFontSizes = descMeasurements.map(m => m.fontSize);
      const uniqueDescFontSizes = [...new Set(descFontSizes)];
      
      if (uniqueDescFontSizes.length === 1) {
        console.log(`   ✅ Description font sizes consistent: ${uniqueDescFontSizes[0]}`);
      } else {
        console.log(`   ❌ Description font size inconsistency:`);
        descMeasurements.forEach(m => {
          console.log(`      ${m.page}: ${m.fontSize}`);
        });
      }
      
      // Check padding consistency (mobile spacing)
      const paddingLeft = descMeasurements.map(m => m.paddingLeft);
      const paddingRight = descMeasurements.map(m => m.paddingRight);
      const uniquePaddingLeft = [...new Set(paddingLeft)];
      const uniquePaddingRight = [...new Set(paddingRight)];
      
      if (uniquePaddingLeft.length === 1 && uniquePaddingRight.length === 1) {
        console.log(`   ✅ Padding consistent: ${uniquePaddingLeft[0]} | ${uniquePaddingRight[0]}`);
      } else {
        console.log(`   ❌ Padding inconsistency:`);
        descMeasurements.forEach(m => {
          console.log(`      ${m.page}: ${m.paddingLeft} | ${m.paddingRight}`);
        });
      }
    }
    
    // Overall viewport assessment
    console.log(`\n   📋 ${viewportName.toUpperCase()} SUMMARY:`);
    const allConsistent = 
      uniqueFontSizes?.length === 1 && 
      (xVariance || 0) <= 10 && 
      (yVariance || 0) <= 10 &&
      uniqueDescFontSizes?.length === 1;
    
    if (allConsistent) {
      console.log(`   🎉 All hero elements are consistent on ${viewportName}`);
    } else {
      console.log(`   ⚠️  Some inconsistencies detected on ${viewportName}`);
    }
  });
}

async function runHeroConsistencyTest() {
  console.log('🎯 HERO TEXT CONSISTENCY TEST');
  console.log('=====================================');
  console.log('Testing hero text size and positioning across:');
  console.log('📄 Pages:', TEST_PAGES.map(p => p.name).join(', '));
  console.log('📱 Devices:', VIEWPORTS.map(v => v.name).join(', '));
  console.log(`🌐 Base URL: ${BASE_URL}\n`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: null
  });
  
  const results = [];
  
  try {
    // Test each page on each viewport
    for (const viewport of VIEWPORTS) {
      for (const testPage of TEST_PAGES) {
        const result = await testPageHeroConsistency(
          browser, 
          testPage.name, 
          testPage.url, 
          viewport
        );
        if (result) {
          results.push(result);
        }
      }
    }
    
    // Analyze results
    compareHeroMeasurements(results);
    
    console.log('\n✅ Hero consistency test completed!');
    console.log(`📊 Tested ${results.length} page/viewport combinations`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
if (require.main === module) {
  runHeroConsistencyTest().catch(console.error);
}

module.exports = { runHeroConsistencyTest };
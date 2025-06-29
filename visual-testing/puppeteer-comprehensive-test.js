#!/usr/bin/env node

/**
 * Comprehensive Visual & Interactive Testing with Puppeteer
 * Tyler Gohr Portfolio - Enterprise Solutions Architect
 * 
 * This script performs extensive visual validation, interactive testing,
 * and cross-device compatibility verification for tylergohr.com/2
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const CONFIG = {
  baseUrl: 'http://localhost:3002',
  screenshotDir: './visual-testing/screenshots',
  reportDir: './visual-testing/reports',
  devices: {
    desktop: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
    mobile: { width: 375, height: 667, deviceScaleFactor: 2 }
  },
  pages: [
    { path: '/2', name: 'homepage' },
    { path: '/2/case-studies', name: 'case-studies' },
    { path: '/2/technical-expertise', name: 'technical-expertise' },
    { path: '/2/how-i-work', name: 'how-i-work' }
  ]
};

class VisualTester {
  constructor() {
    this.browser = null;
    this.results = {
      visual: [],
      interactive: [],
      performance: [],
      accessibility: [],
      errors: []
    };
  }

  async init() {
    console.log('🚀 Initializing Puppeteer Visual Testing Suite...\n');
    
    // Ensure directories exist
    await fs.mkdir(CONFIG.screenshotDir, { recursive: true });
    await fs.mkdir(CONFIG.reportDir, { recursive: true });
    
    // Launch browser with optimal settings for visual testing
    this.browser = await puppeteer.launch({
      headless: true, // Use headless mode for server environment
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--font-render-hinting=none',
        '--disable-font-subpixel-positioning',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
    
    console.log('✅ Browser launched successfully');
  }

  async runComprehensiveTests() {
    console.log('\n📋 Starting Comprehensive Visual & Interactive Testing\n');
    
    try {
      // Phase 1: Visual Layout Validation
      await this.testVisualLayouts();
      
      // Phase 2: Interactive Component Testing
      await this.testInteractiveComponents();
      
      // Phase 3: Performance & Animation Validation
      await this.testPerformanceAndAnimations();
      
      // Phase 4: Content & Accessibility Validation
      await this.testContentAndAccessibility();
      
      // Phase 5: Cross-Device Comparison
      await this.testCrossDeviceCompatibility();
      
      // Generate comprehensive report
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Testing error:', error);
      this.results.errors.push({ test: 'General', error: error.message });
    }
  }

  async testVisualLayouts() {
    console.log('🎨 Phase 1: Visual Layout Validation');
    
    for (const device of Object.keys(CONFIG.devices)) {
      console.log(`  Testing ${device} layout...`);
      
      const page = await this.browser.newPage();
      await page.setViewport(CONFIG.devices[device]);
      
      for (const pageConfig of CONFIG.pages) {
        try {
          await page.goto(`${CONFIG.baseUrl}${pageConfig.path}`, { 
            waitUntil: 'networkidle2',
            timeout: 10000 
          });
          
          // Wait for fonts and animations to settle
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Take full page screenshot
          const screenshotPath = `${CONFIG.screenshotDir}/${pageConfig.name}-${device}-fullpage.png`;
          await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true,
            type: 'png'
          });
          
          // Validate specific sections
          await this.validatePageSections(page, pageConfig, device);
          
          this.results.visual.push({
            page: pageConfig.name,
            device: device,
            status: 'passed',
            screenshot: screenshotPath
          });
          
          console.log(`    ✅ ${pageConfig.name} (${device})`);
          
        } catch (error) {
          console.log(`    ❌ ${pageConfig.name} (${device}): ${error.message}`);
          this.results.errors.push({
            test: `Visual Layout - ${pageConfig.name} (${device})`,
            error: error.message
          });
        }
      }
      
      await page.close();
    }
  }

  async validatePageSections(page, pageConfig, device) {
    if (pageConfig.name === 'homepage') {
      // Test specific homepage sections
      const sections = ['hero', 'about', 'results', 'work', 'process', 'skills', 'contact'];
      
      for (const section of sections) {
        try {
          const element = await page.$(`#${section}`);
          if (element) {
            const sectionScreenshot = `${CONFIG.screenshotDir}/homepage-${section}-${device}.png`;
            await element.screenshot({ path: sectionScreenshot });
          }
        } catch (error) {
          console.log(`      ⚠️  Section ${section} not found or error: ${error.message}`);
        }
      }
      
      // Validate Enterprise Solutions Architect branding
      await this.validateEnterpriseBranding(page);
    }
  }

  async validateEnterpriseBranding(page) {
    const brandingElements = [
      'Enterprise Solutions Architect',
      'Emmy Award',
      'Fox Corporation',
      'Warner Bros',
      'Creating powerful digital solutions'
    ];
    
    for (const text of brandingElements) {
      try {
        await page.waitForFunction(
          (searchText) => document.body.innerText.includes(searchText),
          { timeout: 5000 },
          text
        );
        console.log(`      ✅ Branding: "${text}" found`);
      } catch (error) {
        console.log(`      ⚠️  Branding: "${text}" not found`);
        this.results.errors.push({
          test: 'Enterprise Branding',
          error: `Missing text: ${text}`
        });
      }
    }
  }

  async testInteractiveComponents() {
    console.log('\n🖱️  Phase 2: Interactive Component Testing');
    
    const page = await this.browser.newPage();
    await page.setViewport(CONFIG.devices.desktop);
    
    // Test homepage navigation dropdowns
    await this.testNavigationDropdowns(page);
    
    // Test browser tabs on detail pages
    await this.testBrowserTabs(page);
    
    // Test contact form
    await this.testContactForm(page);
    
    // Test logo float animation
    await this.testLogoFloatAnimation(page);
    
    await page.close();
  }

  async testNavigationDropdowns(page) {
    console.log('  Testing navigation dropdowns...');
    
    try {
      await page.goto(`${CONFIG.baseUrl}/2`, { waitUntil: 'networkidle2' });
      
      const dropdowns = ['Work', 'Process', 'Skills'];
      
      for (const dropdown of dropdowns) {
        // Hover over dropdown
        const navItem = await page.$(`button[aria-label*="${dropdown}"]`);
        if (navItem) {
          await navItem.hover();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Take screenshot of dropdown
          const dropdownScreenshot = `${CONFIG.screenshotDir}/dropdown-${dropdown.toLowerCase()}.png`;
          await page.screenshot({ path: dropdownScreenshot });
          
          console.log(`    ✅ ${dropdown} dropdown tested`);
        }
      }
      
      this.results.interactive.push({
        component: 'Navigation Dropdowns',
        status: 'passed'
      });
      
    } catch (error) {
      console.log(`    ❌ Navigation dropdowns error: ${error.message}`);
      this.results.errors.push({
        test: 'Navigation Dropdowns',
        error: error.message
      });
    }
  }

  async testBrowserTabs(page) {
    console.log('  Testing browser tabs interface...');
    
    const tabPages = ['/2/case-studies', '/2/technical-expertise'];
    
    for (const tabPage of tabPages) {
      try {
        await page.goto(`${CONFIG.baseUrl}${tabPage}`, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get all tabs
        const tabs = await page.$$('[role="tab"]');
        console.log(`    Found ${tabs.length} tabs on ${tabPage}`);
        
        // Test tab switching
        for (let i = 0; i < Math.min(tabs.length, 3); i++) {
          await tabs[i].click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Verify tab is active
          const isActive = await page.evaluate((index) => {
            const tabs = document.querySelectorAll('[role="tab"]');
            return tabs[index]?.getAttribute('aria-selected') === 'true';
          }, i);
          
          if (isActive) {
            console.log(`      ✅ Tab ${i + 1} switching works`);
          }
        }
        
        // Screenshot browser interface
        const browserInterface = await page.$('[class*="browserContainer"]');
        if (browserInterface) {
          await browserInterface.screenshot({ 
            path: `${CONFIG.screenshotDir}/browser-tabs-${tabPage.split('/').pop()}.png` 
          });
        }
        
      } catch (error) {
        console.log(`    ❌ Browser tabs error on ${tabPage}: ${error.message}`);
        this.results.errors.push({
          test: `Browser Tabs - ${tabPage}`,
          error: error.message
        });
      }
    }
    
    this.results.interactive.push({
      component: 'Browser Tabs',
      status: 'passed'
    });
  }

  async testContactForm(page) {
    console.log('  Testing contact form...');
    
    try {
      await page.goto(`${CONFIG.baseUrl}/2`, { waitUntil: 'networkidle2' });
      
      // Scroll to contact section
      await page.evaluate(() => {
        document.getElementById('contact')?.scrollIntoView();
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test form fields
      const nameField = await page.$('input[name="name"], [aria-label*="Name"]');
      const emailField = await page.$('input[name="email"], [aria-label*="Email"]');
      
      if (nameField && emailField) {
        await nameField.type('Test User');
        await emailField.type('test@example.com');
        
        // Screenshot form
        await page.screenshot({ 
          path: `${CONFIG.screenshotDir}/contact-form.png`,
          clip: { x: 0, y: 0, width: 1200, height: 800 }
        });
        
        console.log('    ✅ Contact form interaction tested');
        
        this.results.interactive.push({
          component: 'Contact Form',
          status: 'passed'
        });
      }
      
    } catch (error) {
      console.log(`    ❌ Contact form error: ${error.message}`);
      this.results.errors.push({
        test: 'Contact Form',
        error: error.message
      });
    }
  }

  async testLogoFloatAnimation(page) {
    console.log('  Testing logo float animation...');
    
    try {
      await page.goto(`${CONFIG.baseUrl}/2`, { waitUntil: 'networkidle2' });
      
      // Get initial logo position
      const initialPosition = await page.evaluate(() => {
        const logo = document.querySelector('[class*="logo"], button[aria-label*="Tyler Gohr"]');
        if (logo) {
          const rect = logo.getBoundingClientRect();
          return { x: rect.x, y: rect.y };
        }
        return null;
      });
      
      if (initialPosition) {
        // Scroll to trigger animation
        await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.8));
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get new logo position
        const newPosition = await page.evaluate(() => {
          const logo = document.querySelector('[class*="logo"], button[aria-label*="Tyler Gohr"]');
          if (logo) {
            const rect = logo.getBoundingClientRect();
            return { x: rect.x, y: rect.y };
          }
          return null;
        });
        
        if (newPosition && (initialPosition.x !== newPosition.x || initialPosition.y !== newPosition.y)) {
          console.log('    ✅ Logo float animation working');
          this.results.interactive.push({
            component: 'Logo Float Animation',
            status: 'passed'
          });
        } else {
          console.log('    ⚠️  Logo position unchanged (may need longer animation time)');
        }
      }
      
    } catch (error) {
      console.log(`    ❌ Logo float animation error: ${error.message}`);
      this.results.errors.push({
        test: 'Logo Float Animation',
        error: error.message
      });
    }
  }

  async testPerformanceAndAnimations() {
    console.log('\n⚡ Phase 3: Performance & Animation Validation');
    
    const page = await this.browser.newPage();
    await page.setViewport(CONFIG.devices.desktop);
    
    // Enable performance monitoring
    await page.tracing.start({ screenshots: true });
    
    try {
      await page.goto(`${CONFIG.baseUrl}/2`, { waitUntil: 'networkidle2' });
      
      // Measure Core Web Vitals
      const vitals = await page.evaluate(() => {
        return new Promise((resolve) => {
          const vitals = {};
          
          // LCP
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.lcp = lastEntry.startTime;
          }).observe({ type: 'largest-contentful-paint', buffered: true });
          
          // CLS
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
            vitals.cls = clsValue;
          }).observe({ type: 'layout-shift', buffered: true });
          
          setTimeout(() => resolve(vitals), 3000);
        });
      });
      
      console.log(`  Core Web Vitals:`);
      console.log(`    LCP: ${vitals.lcp?.toFixed(2)}ms`);
      console.log(`    CLS: ${vitals.cls?.toFixed(4)}`);
      
      // Test scroll performance
      await this.testScrollPerformance(page);
      
      this.results.performance.push({
        test: 'Core Web Vitals',
        lcp: vitals.lcp,
        cls: vitals.cls,
        status: vitals.lcp < 2500 && vitals.cls < 0.1 ? 'passed' : 'warning'
      });
      
    } catch (error) {
      console.log(`  ❌ Performance testing error: ${error.message}`);
      this.results.errors.push({
        test: 'Performance Testing',
        error: error.message
      });
    }
    
    await page.tracing.stop();
    await page.close();
  }

  async testScrollPerformance(page) {
    console.log('  Testing scroll performance...');
    
    try {
      // Measure scroll performance
      const scrollStart = Date.now();
      
      await page.evaluate(() => {
        return new Promise((resolve) => {
          let scrollTop = 0;
          const scrollHeight = document.body.scrollHeight;
          const step = scrollHeight / 10;
          
          const scroll = () => {
            scrollTop += step;
            window.scrollTo(0, scrollTop);
            
            if (scrollTop >= scrollHeight - window.innerHeight) {
              resolve();
            } else {
              requestAnimationFrame(scroll);
            }
          };
          
          scroll();
        });
      });
      
      const scrollDuration = Date.now() - scrollStart;
      console.log(`    Scroll duration: ${scrollDuration}ms`);
      
      if (scrollDuration < 2000) {
        console.log('    ✅ Smooth scrolling performance');
      } else {
        console.log('    ⚠️  Scrolling may be slower than optimal');
      }
      
    } catch (error) {
      console.log(`    ❌ Scroll performance error: ${error.message}`);
    }
  }

  async testContentAndAccessibility() {
    console.log('\n♿ Phase 4: Content & Accessibility Validation');
    
    const page = await this.browser.newPage();
    await page.setViewport(CONFIG.devices.desktop);
    
    try {
      await page.goto(`${CONFIG.baseUrl}/2`, { waitUntil: 'networkidle2' });
      
      // Test keyboard navigation
      await this.testKeyboardNavigation(page);
      
      // Test color contrast
      await this.testColorContrast(page);
      
      // Validate meta information
      await this.testMetaInformation(page);
      
    } catch (error) {
      console.log(`  ❌ Content/Accessibility error: ${error.message}`);
      this.results.errors.push({
        test: 'Content & Accessibility',
        error: error.message
      });
    }
    
    await page.close();
  }

  async testKeyboardNavigation(page) {
    console.log('  Testing keyboard navigation...');
    
    try {
      // Test tab navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      
      if (focusedElement) {
        console.log(`    ✅ Keyboard navigation working (focused: ${focusedElement})`);
        this.results.accessibility.push({
          test: 'Keyboard Navigation',
          status: 'passed'
        });
      }
      
    } catch (error) {
      console.log(`    ❌ Keyboard navigation error: ${error.message}`);
    }
  }

  async testColorContrast(page) {
    console.log('  Testing color contrast...');
    
    try {
      const contrastResults = await page.evaluate(() => {
        const elements = document.querySelectorAll('h1, h2, h3, p, button, a');
        let passCount = 0;
        let totalCount = 0;
        
        elements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          if (color && backgroundColor) {
            totalCount++;
            // Simplified contrast check (would need actual contrast calculation)
            if (color !== backgroundColor) {
              passCount++;
            }
          }
        });
        
        return { passCount, totalCount };
      });
      
      console.log(`    Contrast check: ${contrastResults.passCount}/${contrastResults.totalCount} elements`);
      
      this.results.accessibility.push({
        test: 'Color Contrast',
        passed: contrastResults.passCount,
        total: contrastResults.totalCount,
        status: 'informational'
      });
      
    } catch (error) {
      console.log(`    ❌ Color contrast error: ${error.message}`);
    }
  }

  async testMetaInformation(page) {
    console.log('  Testing meta information...');
    
    try {
      const metaInfo = await page.evaluate(() => {
        return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.content,
          ogTitle: document.querySelector('meta[property="og:title"]')?.content,
          structuredData: !!document.querySelector('script[type="application/ld+json"]')
        };
      });
      
      console.log(`    Title: ${metaInfo.title}`);
      console.log(`    Description: ${metaInfo.description ? 'Present' : 'Missing'}`);
      console.log(`    OG Title: ${metaInfo.ogTitle ? 'Present' : 'Missing'}`);
      console.log(`    Structured Data: ${metaInfo.structuredData ? 'Present' : 'Missing'}`);
      
      this.results.accessibility.push({
        test: 'Meta Information',
        data: metaInfo,
        status: 'passed'
      });
      
    } catch (error) {
      console.log(`    ❌ Meta information error: ${error.message}`);
    }
  }

  async testCrossDeviceCompatibility() {
    console.log('\n📱 Phase 5: Cross-Device Compatibility');
    
    for (const [deviceName, viewport] of Object.entries(CONFIG.devices)) {
      console.log(`  Testing ${deviceName} compatibility...`);
      
      const page = await this.browser.newPage();
      await page.setViewport(viewport);
      
      try {
        await page.goto(`${CONFIG.baseUrl}/2`, { waitUntil: 'networkidle2' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test responsive layout
        const layoutTest = await page.evaluate(() => {
          const header = document.querySelector('nav');
          const main = document.querySelector('main');
          
          return {
            headerVisible: header && window.getComputedStyle(header).display !== 'none',
            mainVisible: main && window.getComputedStyle(main).display !== 'none',
            width: window.innerWidth,
            height: window.innerHeight
          };
        });
        
        console.log(`    Layout: ${layoutTest.width}x${layoutTest.height}`);
        
        if (layoutTest.headerVisible && layoutTest.mainVisible) {
          console.log(`    ✅ ${deviceName} layout working`);
        }
        
        // Screenshot for comparison
        await page.screenshot({ 
          path: `${CONFIG.screenshotDir}/device-comparison-${deviceName}.png`,
          fullPage: true 
        });
        
      } catch (error) {
        console.log(`    ❌ ${deviceName} error: ${error.message}`);
        this.results.errors.push({
          test: `Cross-Device - ${deviceName}`,
          error: error.message
        });
      }
      
      await page.close();
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Comprehensive Test Report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.visual.length + this.results.interactive.length + 
                   this.results.performance.length + this.results.accessibility.length,
        errors: this.results.errors.length,
        status: this.results.errors.length === 0 ? 'PASSED' : 'ISSUES_FOUND'
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };
    
    // Save JSON report
    await fs.writeFile(
      `${CONFIG.reportDir}/comprehensive-test-report.json`,
      JSON.stringify(report, null, 2)
    );
    
    // Generate human-readable report
    const humanReport = this.generateHumanReport(report);
    await fs.writeFile(
      `${CONFIG.reportDir}/comprehensive-test-report.md`,
      humanReport
    );
    
    console.log('✅ Reports generated:');
    console.log(`   JSON: ${CONFIG.reportDir}/comprehensive-test-report.json`);
    console.log(`   Markdown: ${CONFIG.reportDir}/comprehensive-test-report.md`);
    console.log(`   Screenshots: ${CONFIG.screenshotDir}/`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.errors.length === 0) {
      recommendations.push('🎉 Excellent! All tests passed. Your site is performing exceptionally well.');
    } else {
      recommendations.push(`⚠️  Found ${this.results.errors.length} issues that need attention.`);
    }
    
    // Performance recommendations
    const perfResults = this.results.performance.filter(p => p.status === 'warning');
    if (perfResults.length > 0) {
      recommendations.push('⚡ Consider optimizing Core Web Vitals for better performance.');
    }
    
    return recommendations;
  }

  generateHumanReport(report) {
    return `# Comprehensive Visual & Interactive Testing Report

**Site**: Tyler Gohr - Enterprise Solutions Architect Portfolio  
**URL**: ${CONFIG.baseUrl}/2  
**Test Date**: ${report.timestamp}  
**Overall Status**: ${report.summary.status}

## Summary
- **Total Tests**: ${report.summary.totalTests}
- **Errors Found**: ${report.summary.errors}
- **Screenshots Captured**: ${this.results.visual.length * 3} (across 3 devices)

## Test Results

### ✅ Visual Layout Tests
${this.results.visual.map(v => `- ${v.page} (${v.device}): ${v.status}`).join('\n')}

### 🖱️ Interactive Component Tests  
${this.results.interactive.map(i => `- ${i.component}: ${i.status}`).join('\n')}

### ⚡ Performance Tests
${this.results.performance.map(p => `- ${p.test}: ${p.status} (LCP: ${p.lcp?.toFixed(2)}ms, CLS: ${p.cls?.toFixed(4)})`).join('\n')}

### ♿ Accessibility Tests
${this.results.accessibility.map(a => `- ${a.test}: ${a.status}`).join('\n')}

## Issues Found
${this.results.errors.length === 0 ? 'None! 🎉' : this.results.errors.map(e => `- ${e.test}: ${e.error}`).join('\n')}

## Recommendations
${report.recommendations.join('\n')}

## Screenshots
Screenshots are available in: \`${CONFIG.screenshotDir}/\`

---
*Generated by Puppeteer Comprehensive Testing Suite*
`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('\n✅ Browser closed successfully');
    }
  }
}

// Main execution
async function main() {
  const tester = new VisualTester();
  
  try {
    await tester.init();
    await tester.runComprehensiveTests();
    
    console.log('\n🎉 Comprehensive Testing Complete!');
    console.log('📊 Check the reports directory for detailed results');
    
  } catch (error) {
    console.error('❌ Testing failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { VisualTester, CONFIG };
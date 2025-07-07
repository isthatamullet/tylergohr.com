# Testing Guide - Tyler Gohr Portfolio

## Overview

This guide covers all testing workflows for the Tyler Gohr Portfolio, including the `/2` redesign. The project uses a **Playwright-only approach** with Puppeteer for specialized screenshot automation.

## Testing Philosophy

- **Playwright-only**: Jest removed in July 2025 for better reliability
- **Real browser testing**: All tests run in actual browsers
- **Fast development feedback**: Sub-2-minute validation cycles
- **Visual regression**: Automated screenshot comparison
- **Enterprise quality**: 100% test reliability standard

## Essential Testing Commands

### **⚡ Fast Development Testing**
```bash
# Quick validation during coding
npm run test:e2e:smoke                # <1 minute essential tests

# Functional testing during development  
npm run test:e2e:dev                  # 2-3 minutes, skip visual regression

# Enhanced debugging mode
npm run test:e2e:debug                # Interactive debugging with browser
```

### **📸 Screenshot Generation for Claude Review**
```bash
# Fast, reliable screenshots (RECOMMENDED)
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium

# Detail pages only
npx playwright test e2e/detail-pages-screenshots.spec.ts --project=chromium

# Puppeteer-based screenshots (hooks system)
npm run hooks:screenshot             # Automated via puppeteer-screenshot-service.sh
```

### **🔧 Comprehensive Testing**
```bash
# Full /2 redesign validation
npm run test:e2e:portfolio           # Complete E2E test suite

# Visual regression testing
npm run test:e2e:visual              # Screenshot comparison across viewports

# Accessibility compliance
npm run test:e2e:accessibility       # WCAG 2.1 AA compliance testing

# Cross-device testing
npm run test:e2e:mobile              # Mobile responsiveness validation
```

## Test File Organization

### **Current Test Files**
```
e2e/
├── quick-screenshots.spec.ts        # Fast screenshot generation
├── detail-pages-screenshots.spec.ts # Detail page screenshots
├── portfolio-redesign.spec.ts       # Main /2 functionality tests
├── navigation-component.spec.ts     # Navigation behavior (21 tests)
├── contact-component.spec.ts        # Form validation (19 tests)
├── visual-regression-2.spec.ts      # Visual consistency (100+ screenshots)
└── accessibility-enhanced.spec.ts   # Enterprise accessibility (24 tests)
```

### **Screenshot Output Locations**
```bash
# Quick screenshots (recommended for Claude review)
screenshots/quick-review/
├── homepage-desktop.png & homepage-mobile.png
├── case-studies-desktop.png & case-studies-mobile.png  
├── how-i-work-desktop.png & how-i-work-mobile.png
└── technical-expertise-desktop.png & technical-expertise-mobile.png
```

## Testing Workflows

### **Daily Development Pattern**
```bash
# 1. Quick validation before starting work
npm run test:e2e:smoke

# 2. During active development  
npm run test:e2e:dev

# 3. Visual review with Claude
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium

# 4. Pre-commit comprehensive validation
npm run test:e2e:portfolio
```

### **Quality Gates (Mandatory)**
```bash
# Before every commit
npm run validate                     # typecheck + lint + build (Playwright-only)
```

## Puppeteer Integration

### **Screenshot Automation**
```bash
# Hooks-based Puppeteer screenshots
npm run hooks:screenshot             # Calls puppeteer-screenshot-service.sh

# Manual Puppeteer testing
npm run test:e2e:puppeteer-quick     # Direct Puppeteer screenshot service
```

### **When to Use Puppeteer vs Playwright**
- **Playwright**: Standard testing, E2E validation, visual regression
- **Puppeteer**: Specialized screenshots, hooks integration, timeout-resistant operations

## Browser Coverage

### **Cross-Browser Testing**
```bash
# Specific browsers
npx playwright test --project=chromium   # Chrome
npx playwright test --project=firefox    # Firefox  
npx playwright test --project=webkit     # Safari

# Mobile testing
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

## Performance Testing

### **Core Web Vitals Monitoring**
- **LCP Target**: <2.5s (Enterprise credibility)
- **FID Target**: <100ms (Professional responsiveness)  
- **CLS Target**: <0.1 (Stable business presentation)

### **Animation Performance**
- **60fps Validation**: Smooth animation testing
- **Mobile Performance**: Touch-optimized interactions

## Accessibility Testing

### **WCAG 2.1 AA Compliance**
```bash
# Full accessibility audit
npm run test:e2e:accessibility

# Coverage includes
- Proper ARIA implementation
- Keyboard navigation flow
- Focus management and visibility
- Color contrast ratios
- Screen reader compatibility
```

## Troubleshooting

### **Common Issues**

**Test Timeouts**:
```bash
# Use sub-agent pattern for timeout-prone operations
# See CLAUDE-WORKFLOWS.md for sub-agent delegation patterns
```

**Server Not Running**:
```bash
# Check development server
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/2

# Start if needed
npm run dev
```

**Port Detection Issues**:
```bash
# Set environment variables for current shell
eval "$(./scripts/detect-active-port.sh quiet export)"

# Then run tests with correct URLs
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium
```

**Screenshot Generation Failures**:
```bash
# Create output directory
mkdir -p screenshots/quick-review

# Run simple screenshot mode
npx playwright test e2e/quick-screenshots.spec.ts --project=chromium --grep "homepage only"
```

### **First-Time Playwright Setup**
```bash
# Install system dependencies (REQUIRES SUDO)
sudo npx playwright install-deps

# Install browser binaries
npx playwright install

# Verify installation
npx playwright --version
```

## Environment Integration

### **Cloud Workstations Support**
- Automatic port detection for cloud environments
- Dynamic URL construction for preview URLs
- Google Cloud Workstations URL format support

### **Local Development**
- Standard localhost:3000 development
- Port conflict detection and resolution
- Multi-port development server support

---

**Focus**: Playwright-only testing with Puppeteer screenshot automation  
**Coverage**: 95%+ across all critical /2 redesign user flows  
**Performance**: Sub-2-minute development feedback cycles
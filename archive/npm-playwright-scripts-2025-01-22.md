# Archived Playwright npm Scripts - January 22, 2025

## Overview

These npm scripts were created before the Playwright MCP server was available. They have been archived in favor of direct MCP tool usage which provides better integration with Claude Code.

## Reason for Archival

- **Playwright MCP Server**: Direct tool integration eliminates need for complex npm script wrappers
- **Timeout Issues**: Many scripts required Agent tool usage due to cloud environment timeouts
- **Complexity**: Over-engineered script system that can be simplified with MCP tools
- **Maintenance**: Reducing npm script sprawl for cleaner package.json

## Archived Scripts

### **Core Testing Scripts**
```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed",
"test:e2e:portfolio": "./scripts/smart-playwright.sh test e2e/portfolio-redesign.spec.ts",
"test:e2e:navigation": "playwright test e2e/navigation-comprehensive.spec.ts",
"test:e2e:api": "playwright test e2e/api-integration.spec.ts",
"test:e2e:visual": "./scripts/smart-playwright.sh test --grep \"visual consistency\"",
"test:e2e:performance": "playwright test --grep \"performance|Core Web Vitals\"",
"test:e2e:accessibility": "playwright test --grep \"accessibility\"",
```

### **Browser-Specific Scripts**
```json
"test:e2e:mobile": "playwright test --project=\"Mobile Chrome\" --project=\"Mobile Safari\"",
"test:e2e:chrome": "playwright test --project=chromium",
"test:e2e:firefox": "playwright test --project=firefox",
"test:e2e:safari": "playwright test --project=webkit",
```

### **Screenshot Generation Scripts**
```json
"test:e2e:screenshot": "./scripts/smart-playwright.sh test e2e/screenshot-generation.spec.ts",
"test:e2e:screenshot:enhanced": "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium",
"test:e2e:screenshot:mobile": "playwright test e2e/screenshot-generation.spec.ts --grep \"mobile\"",
"test:e2e:claude-review": "playwright test e2e/screenshot-generation.spec.ts --grep \"Claude review\"",
"test:e2e:claude-review:current": "playwright test e2e/screenshot-generation.spec.ts --grep \"current state capture\"",
"test:e2e:preview": "playwright test e2e/screenshot-generation.spec.ts --grep \"quick preview\"",
```

### **Development & Debugging Scripts**
```json
"test:e2e:smoke": "FAST_MODE=true playwright test e2e/portfolio-redesign.spec.ts --grep \"homepage displays complete Enterprise Solutions Architect\" --reporter=line --project=chromium",
"test:e2e:smoke:enhanced": "npm run test:e2e:smoke",
"test:e2e:smoke:claude": "npm run test:e2e:smoke",
"test:e2e:dev": "SKIP_VISUAL=true playwright test e2e/portfolio-redesign.spec.ts --grep \"Navigation dropdown|Enterprise content|Skills dropdown|Process dropdown\" --reporter=line",
"test:e2e:dev:verbose": "SKIP_VISUAL=true playwright test --reporter=html",
"test:e2e:debug": "playwright test --headed --timeout=0",
```

### **Component Testing Scripts**
```json
"test:e2e:component": "playwright test --grep \"component\"",
"test:e2e:update-screenshots": "playwright test --update-snapshots",
```

### **Specialized Workflow Scripts**
```json
"test:e2e:with-server": "./scripts/smart-test-with-server.sh",
"test:e2e:managed": "npm run test:e2e:screenshot",
"test:e2e:task-managed": "echo 'Using VS Code Task-managed environment' && npm run test:e2e:smoke",
```

### **Hooks Integration Scripts**
```json
"hooks:screenshot": "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium",
"hooks:visual-workflow": "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium",
```

### **Puppeteer Hybrid Scripts**
```json
"test:e2e:puppeteer-quick": "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium",
"test:e2e:puppeteer-component": "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium", 
"test:e2e:puppeteer-mobile": "npx playwright test e2e/quick-screenshots.spec.ts --project=\"Mobile Chrome\"",
"test:e2e:strategy-test": "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium",
"test:e2e:hybrid-visual": "npx playwright test e2e/quick-screenshots.spec.ts --project=chromium",
"test:e2e:dev-fast": "PUPPETEER_FIRST=true npm run test:e2e:dev",
```

### **Advanced Scroll & Performance Testing Scripts**
```json
"test:e2e:scroll-integration": "playwright test --grep \"scroll.*integration|scroll.*effects.*together\" --project=chromium",
"test:e2e:performance-combined": "playwright test --grep \"performance.*combined|scroll.*performance\" --project=chromium",
"test:e2e:cross-browser-scroll": "playwright test --grep \"scroll\" --project=chromium --project=firefox --project=webkit",
"test:e2e:mobile-scroll-full": "playwright test --grep \"scroll|parallax|mobile.*optimization\" --project=\"Mobile Chrome\" --project=\"Mobile Safari\"",
"test:e2e:accessibility-scroll": "playwright test --grep \"accessibility.*scroll|scroll.*accessibility\" --project=chromium",
"test:performance:desktop-high": "playwright test --grep \"performance.*desktop.*high|120fps|webgl.*parallax\" --project=chromium",
"test:performance:desktop-std": "playwright test --grep \"performance.*desktop.*standard|60fps\" --project=chromium",
"test:performance:tablet": "playwright test --grep \"performance.*tablet|30fps.*tablet\" --project=\"Mobile Chrome\"",
"test:performance:mobile": "playwright test --grep \"performance.*mobile|mobile.*optimization\" --project=\"Mobile Safari\"",
"test:performance:memory-usage": "playwright test --grep \"memory.*usage|memory.*leak|resource.*usage\" --project=chromium",
```

### **Visual & Integration Testing Scripts**
```json
"test:e2e:visual-scroll": "playwright test --grep \"visual.*scroll|scroll.*visual\" --update-snapshots=missing",
"test:e2e:screenshot-integration": "playwright test e2e/scroll-effects-integration.spec.ts --project=chromium",
"test:e2e:client-presentation": "playwright test --grep \"client.*presentation|enterprise.*presentation\" --project=chromium"
```

## MCP Tool Equivalents

### **Instead of npm scripts, use MCP tools:**

**Screenshot Generation:**
```bash
# Old: npm run test:e2e:screenshot:enhanced
# New: mcp__playwright__take_screenshot
```

**Test Execution:**
```bash
# Old: npm run test:e2e:smoke
# New: mcp__playwright__run_test "e2e/portfolio-redesign.spec.ts" --grep="homepage displays"
```

**Visual Regression:**
```bash
# Old: npm run test:e2e:update-screenshots
# New: mcp__playwright__update_snapshots
```

**Browser-Specific Testing:**
```bash
# Old: npm run test:e2e:mobile
# New: mcp__playwright__run_test --project="Mobile Chrome"
```

## Retained Scripts

These essential scripts are kept for core workflows:

```json
"validate": "npm run typecheck && npm run lint && npm run build && npm run bundle-check",
"typecheck": "tsc --noEmit",
"lint": "next lint",
"build": "next build",
"bundle-check": "npm run build && node scripts/check-bundle-size.js"
```

## Benefits of MCP Migration

1. **Reduced Complexity**: Eliminated 50+ specialized npm scripts
2. **Better Integration**: Direct tool calls in Claude Code sessions
3. **No Timeouts**: MCP tools don't suffer from cloud environment timeout issues
4. **Cleaner package.json**: Focus on essential build/validation scripts
5. **Better Debugging**: Direct tool interaction for troubleshooting

## Migration Date

**January 22, 2025** - Migrated from npm script approach to Playwright MCP server integration

---

**Note**: This archive preserves the functionality that these scripts provided. The MCP server approach provides equivalent or better capabilities with direct tool integration.
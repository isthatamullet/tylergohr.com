# Playwright Testing Quick Reference

**Tyler Gohr Portfolio - /2 Redesign Testing Commands**

---

## 🚀 **Essential Commands**

### **Quality Gates (MANDATORY)**
```bash
npm run validate                    # typecheck + lint + build (Jest removed)
```

### **Core Test Suites**
```bash
npm run test:e2e:portfolio         # /2 redesign comprehensive tests
npm run test:e2e:navigation        # Navigation + intersection observers
npm run test:e2e:visual           # Visual regression (100+ screenshots)
npm run test:e2e:accessibility    # WCAG 2.1 AA/AAA compliance
npm run test:e2e:mobile           # Cross-device responsive testing
```

### **Individual Component Tests**
```bash
npx playwright test e2e/contact-component.spec.ts     # Form validation (19 tests)
npx playwright test e2e/navigation-component.spec.ts  # Navigation behavior (21 tests)
npx playwright test e2e/visual-regression-2.spec.ts   # Visual consistency (100+ screenshots)
npx playwright test e2e/accessibility-enhanced.spec.ts # Enterprise accessibility (24 tests)
```

---

## 🔧 **Development Workflow**

### **Before Making Changes**
```bash
npm run test:e2e:portfolio         # Establish baseline
```

### **After Making Changes**
```bash
npm run validate                   # Quality gates
npm run test:e2e:visual           # Check visual changes
npm run test:e2e:accessibility    # Verify accessibility
```

### **Update Visual Baselines (when intentional)**
```bash
npx playwright test e2e/visual-regression-2.spec.ts --update-snapshots
```

---

## 🐛 **Debugging Commands**

### **See Browser During Tests**
```bash
npx playwright test e2e/contact-component.spec.ts --headed
```

### **Run Specific Test**
```bash
npx playwright test --grep "validates email format"
```

### **Generate HTML Report**
```bash
npx playwright test --reporter=html
```

### **Test Single Browser**
```bash
npx playwright test e2e/contact-component.spec.ts --project=chromium
```

---

## 📋 **Test Files & Coverage**

| Test File | Purpose | Test Count | Coverage |
|-----------|---------|------------|----------|
| `contact-component.spec.ts` | Contact form validation & submission | 19 | Form validation, ARIA compliance, mobile UX |
| `navigation-component.spec.ts` | Navigation behavior & accessibility | 21 | Intersection observers, dropdowns, keyboard nav |
| `visual-regression-2.spec.ts` | Visual consistency validation | 100+ screenshots | Responsive design, components, animations |
| `accessibility-enhanced.spec.ts` | Enterprise accessibility compliance | 24 | WCAG 2.1 AA/AAA, Section 508, screen readers |

---

## ⚡ **Common Test Scenarios**

### **Test Contact Form**
```bash
npx playwright test e2e/contact-component.spec.ts --grep "Form Validation Logic"
```

### **Test Navigation Scrolling**
```bash
npx playwright test e2e/navigation-component.spec.ts --grep "Intersection Observer"
```

### **Test Responsive Design**
```bash
npx playwright test e2e/visual-regression-2.spec.ts --grep "Responsive Design"
```

### **Test Accessibility Compliance**
```bash
npx playwright test e2e/accessibility-enhanced.spec.ts --grep "WCAG 2.1 AA"
```

---

## 🎯 **Success Criteria**

- ✅ **100% Test Reliability** (vs. 25% with Jest)
- ✅ **Real Browser Testing** (no mocking required)
- ✅ **Visual Regression Prevention** (100+ screenshot validation)
- ✅ **WCAG 2.1 AA/AAA Compliance** (enterprise accessibility)
- ✅ **Cross-Device Validation** (mobile, tablet, desktop)
- ✅ **Performance Monitoring** (Core Web Vitals integration)

---

## 📚 **Full Documentation**

- **Complete Workflow**: [docs/testing/playwright-workflow.md](playwright-workflow.md)
- **Project Context**: [CLAUDE.md](../../CLAUDE.md) - Testing Strategy section
- **Decision Analysis**: [archive/investigations/testing-implementation-analysis-2025-07-01.md](../../archive/investigations/testing-implementation-analysis-2025-07-01.md)
- **Jest Archive**: [archive/jest-tests-2025-07-01/README.md](../../archive/jest-tests-2025-07-01/README.md)

---

**Strategy**: Playwright-Only Approach (July 2025)  
**Total Coverage**: 81 comprehensive tests across 4 test suites
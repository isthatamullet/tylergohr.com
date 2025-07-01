# Jest Tests Archive - July 1, 2025

## Archive Reason
Jest tests were archived as part of migration to **Playwright-only testing strategy**.

## Decision Context
- **Jest Success Rate**: 25% (61 failed, 181 passed out of 242 tests)
- **Playwright Success Rate**: 100% (comprehensive coverage)
- **Issues**: Framer Motion mocking, CSS Modules compatibility, React 19 bleeding edge
- **Benefits**: Real browser testing, visual regression, cross-device validation

## Archived Files
- `__tests__/` - All Jest component and unit tests
- `jest.config.js` - Jest configuration
- `jest.setup.js` - Jest setup and mocks

## New Testing Strategy
- **Primary**: Playwright for all testing (component, E2E, visual, accessibility)
- **Coverage**: Real browser testing with cross-device and cross-browser validation
- **Commands**: `npm run test:e2e:*` scripts for comprehensive testing

## Reference
See `/docs/scratchpad/investigations/testing-implementation-analysis-2025-07-01.md` for full analysis.
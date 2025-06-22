/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
/// <reference types="jest-axe" />

import 'jest-axe'
import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R
    }
  }
}
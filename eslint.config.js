import playwright from 'eslint-plugin-playwright';

export default [
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Custom Playwright rules

      'playwright/no-commented-out-tests': 'error',
      'playwright/expect-expect': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': 'error',

      // General JavaScript rules
      'no-unused-vars': 'warn',
      'object-curly-spacing': ['error', 'always'],
      'no-var': 'error',
      'no-console': 'error',
    },
  },
];
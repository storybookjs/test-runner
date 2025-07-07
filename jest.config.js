export default {
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '@storybook/test-runner/playwright/global-setup': '<rootDir>/playwright/global-setup.js',
    '@storybook/test-runner/playwright/global-teardown': '<rootDir>/playwright/global-teardown.js',
    '@storybook/test-runner/playwright/custom-environment':
      '<rootDir>/playwright/custom-environment.js',
    '@storybook/test-runner/playwright/jest-setup': '<rootDir>/playwright/jest-setup.js',
    '@storybook/test-runner/playwright/transform': '<rootDir>/playwright/transform.js',
  },
};

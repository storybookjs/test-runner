module.exports = {
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '@storybook/test-runner/playwright/global-setup': '<rootDir>/playwright/global-setup',
    '@storybook/test-runner/playwright/global-teardown': '<rootDir>/playwright/global-teardown',
    '@storybook/test-runner/playwright/custom-environment':
      '<rootDir>/playwright/custom-environment',
    '@storybook/test-runner/playwright/jest-setup': '<rootDir>/playwright/jest-setup',
    '@storybook/test-runner/playwright/transform': '<rootDir>/playwright/transform',
  },
};

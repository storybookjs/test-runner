module.exports = {
  cacheDirectory: 'node_modules/.cache/storybook/test-runner',
  rootDir: process.cwd(),
  testMatch: ['**/*.stories.[jt]s?(x)'],
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/test-runner/playwright/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  preset: 'jest-playwright-preset',
  globalSetup: '@storybook/test-runner/playwright/global-setup.js',
  globalTeardown: '@storybook/test-runner/playwright/global-teardown.js',
  testEnvironment: '@storybook/test-runner/playwright/custom-environment.js',
};

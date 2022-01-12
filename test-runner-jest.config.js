// !!! This file is used as an override to the test-runner configuration for this repo only !!!
// If you want to create your own override for your project, use playwright/test-runner-jest.config.js as base instead
module.exports = {
  cacheDirectory: 'node_modules/.cache/storybook/test-runner',
  rootDir: process.cwd(),
  testMatch: ['**/*.stories.[jt]s?(x)'],
  transform: {
    '^.+\\.stories\\.[jt]sx?$': './playwright/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  preset: 'jest-playwright-preset',
  globalSetup: './playwright/global-setup.js',
  globalTeardown: './playwright/global-teardown.js',
  testEnvironment: './playwright/custom-environment.js',
};

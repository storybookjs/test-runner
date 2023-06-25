// !!! This file is used as an override to the test-runner configuration for this repo only !!!
// If you want to create your own override for your project, run test-storybook eject instead

const { getJestConfig } = require('./dist');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  ...getJestConfig(),
  cacheDirectory: 'node_modules/.cache/storybook/test-runner',
  transform: {
    '^.+\\.stories\\.[jt]sx?$': './dist/playwright/transform',
    '^.+\\.[jt]sx?$': '@swc/jest',
  },
  globalSetup: './dist/playwright/global-setup.js',
  globalTeardown: './dist/playwright/global-teardown.js',
  testEnvironment: './dist/playwright/custom-environment.js',
  setupFilesAfterEnv: ['./dist/playwright/jest-setup.js'],
  // use local build when the package is referred
  moduleNameMapper: {
    '@storybook/test-runner': '<rootDir>/dist/index.js',
  },
};

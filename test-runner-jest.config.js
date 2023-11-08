// !!! This file is used as an override to the test-runner configuration for this repo only !!!
// If you want to create your own override for your project, run test-storybook eject instead
const path = require('path');
// we override the path here so that when running the test-runner locally, it resolves to local files instead when calling require.resolve
process.env.STORYBOOK_TEST_RUNNER_PATH = path.resolve(__dirname);

const { getJestConfig } = require('./dist');

const testRunnerConfig = getJestConfig();

module.exports = {
  ...testRunnerConfig,
  cacheDirectory: 'node_modules/.cache/storybook/test-runner',
  transform: {
    '^.+\\.(story|stories)\\.[jt]sx?$': './playwright/transform',
    '^.+\\.[jt]sx?$': '@swc/jest',
  },
  globalSetup: './playwright/global-setup.js',
  globalTeardown: './playwright/global-teardown.js',
  testEnvironment: './playwright/custom-environment.js',
  setupFilesAfterEnv: ['./playwright/jest-setup.js'],
  // use local build when the package is referred
  moduleNameMapper: {
    '@storybook/test-runner': '<rootDir>/dist/index.js',
  },
};

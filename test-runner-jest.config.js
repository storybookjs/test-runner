// !!! This file is used as an override to the test-runner configuration for this repo only !!!
// If you want to create your own override for your project, run test-storybook eject instead

const { getJestConfig } = require('./dist/cjs');

module.exports = {
  ...getJestConfig(),
  cacheDirectory: 'node_modules/.cache/storybook/test-runner',
  transform: {
    '^.+\\.stories\\.[jt]sx?$': './playwright/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  globalSetup: './playwright/global-setup.js',
  globalTeardown: './playwright/global-teardown.js',
  testEnvironment: './playwright/custom-environment.js',
  setupFilesAfterEnv: ['./playwright/jest-setup.js'],
  // use local build when the package is referred
  moduleNameMapper: {
    '@storybook/test-runner': '<rootDir>/dist/cjs/index.js'
  },
};

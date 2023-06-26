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
    '^.+\\.stories\\.[jt]sx?$': './dist/templates/transform',
    '^.+\\.[jt]sx?$': '@swc/jest',
  },
  globalSetup: './dist/templates/global-setup.js',
  globalTeardown: './dist/templates/global-teardown.js',
  testEnvironment: './dist/templates/custom-environment.js',
  setupFilesAfterEnv: ['./dist/templates/jest-setup.js'],
  // use local build when the package is referred
  moduleNameMapper: {
    '@storybook/test-runner': '<rootDir>/dist/index.js',
  },
};

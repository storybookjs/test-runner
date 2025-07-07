// !!! This file is used as an override to the test-runner configuration for this repo only !!!
// If you want to create your own override for your project, run test-storybook eject instead
import path from 'path';
import { fileURLToPath } from 'url';

// we override the path here so that when running the test-runner locally, it resolves to local files instead when calling require.resolve
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.STORYBOOK_TEST_RUNNER_PATH = path.resolve(__dirname);

import { getJestConfig } from './dist/index.js';

const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
export default {
  ...testRunnerConfig,
  cacheDirectory: 'node_modules/.cache/storybook/test-runner',
  transform: {
    '^.+\\.(story|stories)\\.[jt]sx?$': './playwright/transform.js',
    '^.+\\.[jt]sx?$': '@swc/jest',
  },
  globalSetup: './playwright/global-setup.js',
  globalTeardown: './playwright/global-teardown.js',
  testEnvironment: './playwright/custom-environment.js',
  setupFilesAfterEnv: ['./playwright/jest-setup.js'],
  // transformIgnorePatterns for the storybook package and make sure swc jest ignores it too
  // use local build when the package is referred
  moduleNameMapper: {
    '@storybook/test-runner': '<rootDir>/dist/index.js',
  },
};

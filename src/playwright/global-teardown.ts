// global-teardown.js
import { globalTeardown as playwrightGlobalTeardown } from 'jest-playwright-preset';
import { type Config as JestConfig } from '@jest/types';

module.exports = async function globalTeardown(globalConfig: JestConfig.GlobalConfig) {
  // Your global teardown
  await playwrightGlobalTeardown(globalConfig);
};

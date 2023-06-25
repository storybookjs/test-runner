// global-setup.js
import { globalSetup as playwrightGlobalSetup } from 'jest-playwright-preset';
import { type Config as JestConfig } from '@jest/types';

module.exports = function globalSetup(globalConfig: JestConfig.GlobalConfig) {
  return playwrightGlobalSetup(globalConfig);
};

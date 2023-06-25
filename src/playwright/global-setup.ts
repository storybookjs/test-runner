// global-setup.js
import { globalSetup as playwrightGlobalSetup } from 'jest-playwright-preset';

module.exports = function globalSetup(globalConfig: any) {
  return playwrightGlobalSetup(globalConfig);
};

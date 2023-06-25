// global-teardown.js
import { globalTeardown as playwrightGlobalTeardown } from 'jest-playwright-preset';

module.exports = async function globalTeardown(globalConfig: any) {
  // Your global teardown
  await playwrightGlobalTeardown(globalConfig);
};

// global-setup.js
import { globalSetup as playwrightGlobalSetup } from 'jest-playwright-preset';

module.exports = async function globalSetup(globalConfig) {
  console.log('GLOBAL SETUP!!');
  return playwrightGlobalSetup(globalConfig);
};

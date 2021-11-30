// global-setup.js
const { globalSetup: playwrightGlobalSetup } = require('jest-playwright-preset');

module.exports = async function globalSetup(globalConfig) {
  console.log('GLOBAL SETUP!!');
  return playwrightGlobalSetup(globalConfig);
};

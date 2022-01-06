// global-setup.js
const { globalSetup: playwrightGlobalSetup } = require('jest-playwright-preset');

module.exports = async function globalSetup(globalConfig) {
  return playwrightGlobalSetup(globalConfig);
};

// global-teardown.js
const { globalTeardown: playwrightGlobalTeardown } = require('jest-playwright-preset');

module.exports = async function globalTeardown(globalConfig) {
  // Your global teardown
  await playwrightGlobalTeardown(globalConfig);
};

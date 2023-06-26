const { playwrightGlobalTeardown } = require('../index');

module.exports = async function globalTeardown(globalConfig) {
  // Your global teardown
  await playwrightGlobalTeardown(globalConfig);
};

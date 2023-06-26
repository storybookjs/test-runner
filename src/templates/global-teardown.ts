import { playwrightGlobalTeardown, GlobalConfig } from '../index';

module.exports = async function globalTeardown(globalConfig: GlobalConfig) {
  // Your global teardown
  await playwrightGlobalTeardown(globalConfig);
};

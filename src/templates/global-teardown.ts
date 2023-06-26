import { playwrightGlobalTeardown, GlobalConfig } from '@storybook/test-runner';

module.exports = async function globalTeardown(globalConfig: GlobalConfig) {
  // Your global teardown
  await playwrightGlobalTeardown(globalConfig);
};

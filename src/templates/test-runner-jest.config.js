const { getJestConfig } = require('../index');

/**
 * @type {import('@storybook/test-runner').JestConfig}
 */
module.exports = {
  // The default configuration comes from @storybook/test-runner
  ...getJestConfig(),
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */
  globalSetup: './global-setup.js',
  globalTeardown: './global-teardown.js',
  testEnvironment: './custom-environment.js',
  setupFilesAfterEnv: ['./jest-setup.js'],
};

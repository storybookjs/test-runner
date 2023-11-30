const { defineConfig } = require('@storybook/test-runner');

/**
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
const config = {
  /** Add your own overrides below,
   * @see https://playwright.dev/docs/test-configuration
   */
};

// TODO: check how we want to allow users to override the config
module.exports = defineConfig(config);

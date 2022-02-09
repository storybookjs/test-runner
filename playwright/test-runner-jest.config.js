const { getJestConfig } = require('@storybook/playwright');

module.exports = {
  // The default configuration comes from @storybook/playwright
  ...getJestConfig()
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */
}
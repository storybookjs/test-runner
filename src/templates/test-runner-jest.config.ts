import { getJestConfig, type JestConfig } from '../index';

module.exports = {
  // The default configuration comes from @storybook/test-runner
  ...getJestConfig(),
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  testEnvironment: './custom-environment.ts',
  setupFilesAfterEnv: ['./jest-setup.ts'],
} satisfies JestConfig;

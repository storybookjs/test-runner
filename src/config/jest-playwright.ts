export const getJestConfig = () => {
  const { TEST_ROOT, TEST_MATCH, STORYBOOK_STORIES_PATTERN } = process.env;

  let config = {
    rootDir: process.cwd(),
    roots: TEST_ROOT ? [TEST_ROOT] : undefined,
    testMatch: STORYBOOK_STORIES_PATTERN && STORYBOOK_STORIES_PATTERN.split(';'),
    transform: {
      '^.+\\.stories\\.[jt]sx?$': '@storybook/test-runner/playwright/transform',
      '^.+\\.[jt]sx?$': 'babel-jest',
    },
    preset: 'jest-playwright-preset',
    globalSetup: '@storybook/test-runner/playwright/global-setup.js',
    globalTeardown: '@storybook/test-runner/playwright/global-teardown.js',
    testEnvironment: '@storybook/test-runner/playwright/custom-environment.js',
    // @TODO: setupFilesAfterEnv: ['@storybook/test-runner/setup']
  };

  if (TEST_MATCH) {
    config.testMatch = [TEST_MATCH];
  }

  return config;
};

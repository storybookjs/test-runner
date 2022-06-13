export const getJestConfig = () => {
  const { TEST_ROOT, TEST_MATCH, STORYBOOK_STORIES_PATTERN, TEST_BROWSERS, COLLECT_COVERAGE } =
    process.env;

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
    setupFilesAfterEnv: ['@storybook/test-runner/playwright/jest-setup.js'],
    snapshotSerializers: ['jest-serializer-html'],
    testEnvironmentOptions: {
      'jest-playwright': {
        browsers: TEST_BROWSERS.split(',')
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean),
        collectCoverage: COLLECT_COVERAGE === 'true',
      },
    },
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname'),
    ],
    watchPathIgnorePatterns: ['coverage', '.nyc_output', '.cache'],
  };

  if (TEST_MATCH) {
    config.testMatch = [TEST_MATCH];
  }

  return config;
};

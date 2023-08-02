import path from 'path';

/**
 * IMPORTANT NOTE:
 * Depending on the user's project and package manager, it's possible that jest-playwright-preset
 * is going to be located in @storybook/test-runner/node_modules OR in the root node_modules
 *
 * By setting `preset: 'jest-playwright-preset` the change of resolution issues is higher, because
 * the lib might be installed inside of @storybook/test-runner/node_modules but references as if it was
 * in the root node_modules.
 *
 * This function does the same thing as `preset: 'jest-playwright-preset` but makes sure that the
 * necessary moving parts are all required within the correct path.
 * */
const getJestPlaywrightConfig = () => {
  const presetBasePath = path.dirname(
    require.resolve('jest-playwright-preset', {
      paths: [path.join(__dirname, '../node_modules')],
    })
  );
  const expectPlaywrightPath = path.dirname(
    require.resolve('expect-playwright', {
      paths: [path.join(__dirname, '../node_modules')],
    })
  );
  return {
    runner: path.join(presetBasePath, 'runner.js'),
    globalSetup: '@storybook/test-runner/playwright/global-setup.js',
    globalTeardown: '@storybook/test-runner/playwright/global-teardown.js',
    testEnvironment: '@storybook/test-runner/playwright/custom-environment.js',
    setupFilesAfterEnv: [
      '@storybook/test-runner/playwright/jest-setup.js',
      expectPlaywrightPath,
      path.join(presetBasePath, 'lib', 'extends.js'),
    ],
  };
};

export const getJestConfig = () => {
  const {
    TEST_ROOT,
    TEST_MATCH,
    STORYBOOK_STORIES_PATTERN,
    TEST_BROWSERS,
    STORYBOOK_COLLECT_COVERAGE,
    STORYBOOK_JUNIT,
  } = process.env;

  const jestJunitPath = path.dirname(
    require.resolve('jest-junit', {
      paths: [path.join(__dirname, '../node_modules')],
    })
  );

  const jestSerializerHtmlPath = path.dirname(
    require.resolve('jest-serializer-html', {
      paths: [path.join(__dirname, '../node_modules')],
    })
  );

  const swcJestPath = path.dirname(
    require.resolve('@swc/jest', {
      paths: [path.join(__dirname, '../node_modules')],
    })
  );

  const reporters = STORYBOOK_JUNIT ? ['default', jestJunitPath] : ['default'];

  const testMatch = (STORYBOOK_STORIES_PATTERN && STORYBOOK_STORIES_PATTERN.split(';')) || [];
  const testRoots = new Set(['<rootDir>']);

  testMatch.forEach((match) => {
    // if any of the stories pattern contains <rootDir>/.. it means the user might be referencing
    // stories outside of the project they're executing the test-runner from, e.g. monorepo
    if (match.startsWith('<rootDir>/..')) {
      const rootDirLevels = match.split('/..').length - 1;
      // so we add those directories as roots to make sure jest can find the files
      const rootDir = ['<rootDir>'].concat(Array(rootDirLevels).fill('..')).join(path.sep);
      testRoots.add(rootDir);
    }
  });

  let config = {
    rootDir: process.cwd(),
    roots: TEST_ROOT ? [TEST_ROOT] : [...testRoots],
    reporters,
    testMatch,
    transform: {
      '^.+\\.stories\\.[jt]sx?$': '@storybook/test-runner/playwright/transform',
      '^.+\\.[jt]sx?$': swcJestPath,
    },
    snapshotSerializers: [jestSerializerHtmlPath],
    testEnvironmentOptions: {
      'jest-playwright': {
        browsers: TEST_BROWSERS.split(',')
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean),
        collectCoverage: STORYBOOK_COLLECT_COVERAGE === 'true',
      },
    },
    watchPlugins: [
      require.resolve('jest-watch-typeahead/filename'),
      require.resolve('jest-watch-typeahead/testname'),
    ],
    watchPathIgnorePatterns: ['coverage', '.nyc_output', '.cache'],
    ...getJestPlaywrightConfig(),
  };

  if (TEST_MATCH) {
    config.testMatch = [TEST_MATCH];
  }

  return config;
};

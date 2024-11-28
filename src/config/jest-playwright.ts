import path from 'path';
import { getProjectRoot } from 'storybook/internal/common';
import type { Config } from '@jest/types';

const getTestRunnerPath = () => process.env.STORYBOOK_TEST_RUNNER_PATH ?? '@storybook/test-runner';

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
const getJestPlaywrightConfig = (): Config.InitialOptions => {
  const TEST_RUNNER_PATH = getTestRunnerPath();
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
    globalSetup: require.resolve(`${TEST_RUNNER_PATH}/playwright/global-setup.js`),
    globalTeardown: require.resolve(`${TEST_RUNNER_PATH}/playwright/global-teardown.js`),
    testEnvironment: require.resolve(`${TEST_RUNNER_PATH}/playwright/custom-environment.js`),
    setupFilesAfterEnv: [
      require.resolve(`${TEST_RUNNER_PATH}/playwright/jest-setup.js`),
      expectPlaywrightPath,
      path.join(presetBasePath, 'lib', 'extends.js'),
    ],
  };
};

export const getJestConfig = (): Config.InitialOptions => {
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

  const testMatch = STORYBOOK_STORIES_PATTERN?.split(';') ?? [];
  const TEST_RUNNER_PATH = getTestRunnerPath();

  const config: Config.InitialOptions = {
    rootDir: getProjectRoot(),
    roots: TEST_ROOT ? [TEST_ROOT] : undefined,
    reporters,
    testMatch,
    transform: {
      '^.+\\.(story|stories)\\.[jt]sx?$': require.resolve(
        `${TEST_RUNNER_PATH}/playwright/transform`
      ),
      '^.+\\.[jt]sx?$': swcJestPath,
    },
    snapshotSerializers: [jestSerializerHtmlPath],
    testEnvironmentOptions: {
      'jest-playwright': {
        browsers: TEST_BROWSERS?.split(',')
          .map((p) => p.trim().toLowerCase())
          .filter(Boolean),
        collectCoverage: STORYBOOK_COLLECT_COVERAGE === 'true',
        exitOnPageError: false,
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

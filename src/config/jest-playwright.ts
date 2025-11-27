/** @jest-config-loader-options {"transpileOnly": true} */
import path from 'pathe';
import { getProjectRoot } from 'storybook/internal/common';
import type { Config } from '@jest/types';

const getTestRunnerPath = () => {
  return (
    process.env.STORYBOOK_TEST_RUNNER_PATH ??
    path.dirname(require.resolve('@storybook/test-runner/package.json'))
  );
};

/**
 * IMPORTANT NOTE:
 * Depending on the user's project and package manager, it's possible that jest-playwright-preset
 * is going to be located in @storybook/test-runner/node_modules OR in the root node_modules
 *
 * By setting `preset: 'jest-playwright-preset' the change of resolution issues is higher, because
 * the lib might be installed inside of @storybook/test-runner/node_modules but references as if it was
 * in the root node_modules.
 *
 * This function does the same thing as `preset: 'jest-playwright-preset' but makes sure that the
 * necessary moving parts are all required within the correct path.
 * */
const getJestPlaywrightConfig = (): Config.InitialOptions => {
  const resolvedRunnerPath = getTestRunnerPath();
  const expectPlaywrightPath = path.dirname(require.resolve('expect-playwright'));
  return {
    runner: path.join(resolvedRunnerPath, 'dist/jest-playwright-entries/runner.js'),
    testEnvironment: path.join(resolvedRunnerPath, 'playwright/custom-environment.js'),
    setupFilesAfterEnv: [
      path.join(resolvedRunnerPath, 'playwright/jest-setup.js'),
      expectPlaywrightPath,
      path.join(resolvedRunnerPath, 'dist/jest-playwright-entries/extends.js'),
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
    TEST_INDEX_JSON,
  } = process.env;

  const jestJunitPath = path.dirname(require.resolve('jest-junit'));

  const jestSerializerHtmlPath = path.dirname(require.resolve('jest-serializer-html'));

  const swcJestPath = path.dirname(require.resolve('@swc/jest'));

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
        `${TEST_RUNNER_PATH}/playwright/transform.js`
      ),
      '^.+\\.[jt]sx?$': swcJestPath,
    },
    extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
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
    testSequencer: TEST_INDEX_JSON ? require.resolve('./config/jest-filename-sequencer') : undefined,
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

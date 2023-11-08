import { getJestConfig } from './jest-playwright';
import path from 'path';

describe('getJestConfig', () => {
  it('returns the correct configuration 1', () => {
    const jestConfig = getJestConfig();

    expect(jestConfig).toEqual({
      rootDir: process.cwd(),
      reporters: ['default'],
      testMatch: [],
      transform: {
        '^.+\\.(story|stories)\\.[jt]sx?$': '@storybook/test-runner/dist/templates/transform',
        '^.+\\.[jt]sx?$': path.resolve('../test-runner/node_modules/@swc/jest'),
      },
      snapshotSerializers: [path.resolve('../test-runner/node_modules/jest-serializer-html')],
      testEnvironmentOptions: {
        'jest-playwright': {
          browsers: undefined,
          collectCoverage: false,
        },
      },
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
      ],
      watchPathIgnorePatterns: ['coverage', '.nyc_output', '.cache'],
      roots: undefined,
      runner: path.resolve('../test-runner/node_modules/jest-playwright-preset/runner.js'),
      globalSetup: path.resolve('dist/templates/global-setup.js'),
      globalTeardown: path.resolve('dist/templates/global-teardown.js'),
      testEnvironment: path.resolve('dist/templates/custom-environment.js'),
      setupFilesAfterEnv: [
        path.resolve('dist/templates/jest-setup.js'),
        path.resolve('../test-runner/node_modules/expect-playwright/lib'),
        path.resolve('../test-runner/node_modules/jest-playwright-preset/lib/extends.js'),
      ],
    });
  });

  it('parses TEST_BROWSERS environment variable correctly', () => {
    interface JestPlaywrightOptions {
      browsers?: string[];
      collectCoverage?: boolean;
    }
    process.env.TEST_BROWSERS = 'chromium, firefox, webkit';

    const jestConfig: {
      testEnvironmentOptions?: {
        'jest-playwright'?: JestPlaywrightOptions;
      };
    } = getJestConfig();

    expect(jestConfig.testEnvironmentOptions?.['jest-playwright']?.browsers as string[]).toEqual([
      'chromium',
      'firefox',
      'webkit',
    ]);
  });

  it('sets TEST_MATCH environment variable correctly', () => {
    process.env.TEST_MATCH = '**/*.test.js';

    const jestConfig = getJestConfig();

    expect(jestConfig.testMatch).toEqual(['**/*.test.js']);
  });

  it('returns the correct configuration 2', () => {
    process.env.STORYBOOK_JUNIT = 'true';

    const jestConfig = getJestConfig();

    expect(jestConfig.reporters).toEqual(['default', path.dirname(require.resolve('jest-junit'))]);
    expect(jestConfig).toMatchObject({
      rootDir: process.cwd(),
      roots: undefined,
      testMatch: ['**/*.test.js'],
      transform: {
        '^.+\\.(story|stories)\\.[jt]sx?$': '@storybook/test-runner/dist/templates/transform',
        '^.+\\.[jt]sx?$': path.dirname(require.resolve('@swc/jest')),
      },
      snapshotSerializers: [path.dirname(require.resolve('jest-serializer-html'))],
      testEnvironmentOptions: {
        'jest-playwright': {
          browsers: ['chromium', 'firefox', 'webkit'],
          collectCoverage: false,
        },
      },
      watchPlugins: [
        require.resolve('jest-watch-typeahead/filename'),
        require.resolve('jest-watch-typeahead/testname'),
      ],
      watchPathIgnorePatterns: ['coverage', '.nyc_output', '.cache'],
    });
  });

  it('returns the correct configuration 3', () => {
    process.env.TEST_ROOT = 'test';
    process.env.STORYBOOK_STORIES_PATTERN = '**/*.stories.tsx';

    const jestConfig = getJestConfig();

    expect(jestConfig).toMatchObject({
      roots: ['test'],
      reporters: ['default', path.resolve('../test-runner/node_modules/jest-junit')],
      testMatch: ['**/*.test.js'],
    });
  });
});

import type { Config } from '@jest/types';

export * from './playwright/hooks';
export * from './config/jest-playwright';
export * from './setup-page';
export * from './util/getTestRunnerConfig';

export {
  toMatchImageSnapshot,
  configureToMatchImageSnapshot,
  updateSnapshotState,
} from 'jest-image-snapshot';

type JestConfig = Config.InitialOptions;
type GlobalConfig = Config.GlobalConfig;

export { type JestConfig, type GlobalConfig };

export {
  injectAxe,
  configureAxe,
  getAxeResults,
  getViolations,
  reportViolations,
  checkA11y,
  DefaultTerminalReporter,
} from 'axe-playwright';

export const PlaywrightEnvironmentModule = require.resolve(
  'jest-playwright-preset/lib/PlaywrightEnvironment'
);

export { transformSync as swcTransform } from '@swc/core';

export { type Event } from 'jest-circus';

export {
  globalTeardown as playwrightGlobalTeardown,
  globalSetup as playwrightGlobalSetup,
} from 'jest-playwright-preset';

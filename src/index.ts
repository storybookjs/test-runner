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

export { type JestConfig };

export {
  injectAxe,
  configureAxe,
  getAxeResults,
  getViolations,
  reportViolations,
  checkA11y,
  DefaultTerminalReporter,
} from 'axe-playwright';

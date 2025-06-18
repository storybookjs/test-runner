import { join, resolve } from 'path';
import { TestRunnerConfig } from '../playwright/hooks';
import { serverRequire } from './serverRequire';

let testRunnerConfig: TestRunnerConfig;
let loaded = false;

export const getTestRunnerConfig = (
  configDir = process.env.STORYBOOK_CONFIG_DIR ?? '.storybook'
): TestRunnerConfig | undefined => {
  // testRunnerConfig can be undefined
  if (loaded) {
    return testRunnerConfig;
  }

  try {
    testRunnerConfig = serverRequire(join(resolve(configDir), 'test-runner'));
    loaded = true;
    return testRunnerConfig;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

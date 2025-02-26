import { join, resolve } from 'path';
import { serverRequire } from 'storybook/internal/common';
import { TestRunnerConfig } from '../playwright/hooks';

let testRunnerConfig: TestRunnerConfig;
let loaded = false;

export const getTestRunnerConfig = (
  configDir = process.env.STORYBOOK_CONFIG_DIR ?? '.storybook'
): TestRunnerConfig | undefined => {
  // testRunnerConfig can be undefined
  if (loaded) {
    return testRunnerConfig;
  }

  testRunnerConfig = serverRequire(join(resolve(configDir), 'test-runner'));
  loaded = true;
  return testRunnerConfig;
};

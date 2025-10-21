import { join, resolve } from 'path';
import { serverRequire } from 'storybook/internal/common';
import { TestRunnerConfig } from '../playwright/hooks';

let testRunnerConfig: TestRunnerConfig;
let loaded = false;

export const getTestRunnerConfig = async (
  configDir = process.env.STORYBOOK_CONFIG_DIR ?? '.storybook'
): Promise<TestRunnerConfig | undefined> => {
  // testRunnerConfig can be undefined
  if (loaded) {
    return testRunnerConfig;
  }

  testRunnerConfig = await serverRequire(join(resolve(configDir), 'test-runner'));
  loaded = true;
  return testRunnerConfig;
};

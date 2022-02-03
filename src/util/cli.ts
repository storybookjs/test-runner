import { join, resolve } from 'path';
import { serverRequire, StorybookConfig } from '@storybook/core-common';
import { getParsedCliOptions } from './helpers';

type CliOptions = {
  runnerOptions: {
    storiesJson: boolean;
    configDir: string;
  };
  jestOptions: string[];
};

type StorybookRunnerCommand = keyof CliOptions['runnerOptions'];

const STORYBOOK_RUNNER_COMMANDS: StorybookRunnerCommand[] = ['storiesJson', 'configDir'];

export const defaultRunnerOptions: CliOptions['runnerOptions'] = {
  configDir: '.storybook',
  storiesJson: false,
};

let storybookMainConfig: StorybookConfig;

export const getCliOptions = () => {
  const allOptions = getParsedCliOptions();

  const defaultOptions: CliOptions = {
    runnerOptions: { ...defaultRunnerOptions },
    jestOptions: process.argv.splice(0, 2),
  };

  return Object.keys(allOptions).reduce((acc, key: any) => {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      //@ts-ignore
      acc.runnerOptions[key] = allOptions[key];
    } else {
      if (allOptions[key] === true) {
        acc.jestOptions.push(`--${key}`);
      } else if (allOptions[key] === false) {
        acc.jestOptions.push(`--no-${key}`);
      } else {
        acc.jestOptions.push(`--${key}`, allOptions[key]);
      }
    }

    return acc;
  }, defaultOptions);
};

export const getStorybookMain = (configDir: string) => {
  if (storybookMainConfig) {
    return storybookMainConfig;
  }

  storybookMainConfig = serverRequire(join(resolve(configDir), 'main'));
  if (!storybookMainConfig) {
    throw new Error(
      `Could not load main.js in ${configDir}. Is the config directory correct? You can change it by using --config-dir <path-to-dir>`
    );
  }

  return storybookMainConfig;
};

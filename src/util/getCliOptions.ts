import { getParsedCliOptions } from './getParsedCliOptions';
import type { BrowserType } from 'jest-playwright-preset';

export type StorybookTestType = 'play' | 'smoke';

type CliOptions = {
  runnerOptions: {
    indexJson?: boolean;
    url?: string;
    configDir?: string;
    eject?: boolean;
    coverage?: boolean;
    junit?: boolean;
    browsers?: BrowserType | BrowserType[];
    onlyType?: StorybookTestType;
  };
  jestOptions: string[];
};

type StorybookRunnerCommand = keyof CliOptions['runnerOptions'];

const STORYBOOK_RUNNER_COMMANDS: StorybookRunnerCommand[] = [
  'indexJson',
  'configDir',
  'browsers',
  'eject',
  'onlyType',
  'url',
  'coverage',
  'junit',
];

export const getCliOptions = () => {
  const { options: allOptions, extraArgs } = getParsedCliOptions();

  const defaultOptions: CliOptions = {
    runnerOptions: {},
    jestOptions: process.argv.splice(0, 2),
  };

  const finalOptions = Object.keys(allOptions).reduce((acc, key: any) => {
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

  if (extraArgs.length) {
    finalOptions.jestOptions.push(...extraArgs);
  }

  return finalOptions;
};

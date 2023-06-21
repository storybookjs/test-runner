import { getParsedCliOptions } from './getParsedCliOptions';
import type { BrowserType } from 'jest-playwright-preset';

export type JestOptions = {
  [key: string]: any;
};

export type CliOptions = {
  runnerOptions: {
    indexJson?: boolean;
    url?: string;
    configDir?: string;
    eject?: boolean;
    coverage?: boolean;
    junit?: boolean;
    browsers?: BrowserType | BrowserType[];
    checkConsole?: boolean;
  };
  jestOptions: JestOptions;
};

type StorybookRunnerCommand = keyof CliOptions['runnerOptions'];

const STORYBOOK_RUNNER_COMMANDS: StorybookRunnerCommand[] = [
  'indexJson',
  'configDir',
  'browsers',
  'eject',
  'url',
  'coverage',
  'junit',
  'checkConsole',
];

function copyOption<ObjType extends object, KeyType extends keyof ObjType>(
  obj: ObjType,
  key: KeyType,
  value: ObjType[KeyType]
) {
  obj[key] = value;
}

export const getCliOptions = (): CliOptions => {
  const { options: allOptions, extraArgs } = getParsedCliOptions();

  const defaultOptions: CliOptions = {
    runnerOptions: {},
    jestOptions: process.argv.splice(0, 2),
  };

  const finalOptions = Object.keys(allOptions).reduce((acc, key: StorybookRunnerCommand) => {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      copyOption(acc.runnerOptions, key, allOptions[key]);
    } else {
      if (allOptions[key] === true) {
        acc.jestOptions.push(`--${key}`);
      } else if (allOptions[key] === false) {
        acc.jestOptions.push(`--no-${key}`);
      } else {
        acc.jestOptions.push(`--${key}`, allOptions[key] as string);
      }
    }

    return acc;
  }, defaultOptions);

  if (extraArgs.length) {
    finalOptions.jestOptions.push(...[extraArgs]);
  }

  return finalOptions;
};

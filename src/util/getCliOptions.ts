import { getParsedCliOptions } from './getParsedCliOptions';
import type { BrowserType } from 'jest-playwright-preset';

export type JestOptions = string[];

export type CliOptions = {
  runnerOptions: {
    indexJson?: boolean;
    url?: string;
    configDir?: string;
    eject?: boolean;
    coverage?: boolean;
    coverageDirectory?: string;
    junit?: boolean;
    browsers?: BrowserType | BrowserType[];
    failOnConsole?: boolean;
  } & Record<string, unknown>;
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
  'coverageDirectory',
  'junit',
  'failOnConsole',
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

  const finalOptions = Object.keys(allOptions).reduce((acc: CliOptions, key: string) => {
    if (STORYBOOK_RUNNER_COMMANDS.includes(key as StorybookRunnerCommand)) {
      copyOption(
        acc.runnerOptions,
        key as StorybookRunnerCommand,
        allOptions[key as StorybookRunnerCommand]
      );
    } else {
      if (allOptions[key as StorybookRunnerCommand] === true) {
        acc.jestOptions.push(`--${key}`);
      } else if (allOptions[key as StorybookRunnerCommand] === false) {
        acc.jestOptions.push(`--no-${key}`);
      } else {
        acc.jestOptions.push(`--${key}="${allOptions[key as StorybookRunnerCommand]}"`);
      }
    }

    return acc;
  }, defaultOptions);

  if (extraArgs.length) {
    finalOptions.jestOptions.push(...extraArgs);
  }

  return finalOptions;
};

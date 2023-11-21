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
    includeTags?: string;
    excludeTags?: string;
    skipTags?: string;
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
  'coverageDirectory',
  'junit',
  'failOnConsole',
  'includeTags',
  'excludeTags',
  'skipTags',
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

  const finalOptions = Object.keys(allOptions).reduce((acc: CliOptions, _key: string) => {
    let key = _key as StorybookRunnerCommand;
    let optionValue = allOptions[key];

    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      copyOption(acc.runnerOptions, key, optionValue);
    } else {
      if (optionValue === true) {
        acc.jestOptions.push(`--${key}`);
      } else if (optionValue === false) {
        acc.jestOptions.push(`--no-${key}`);
      } else {
        acc.jestOptions.push(`--${key}`, `${optionValue}`);
      }
    }

    return acc;
  }, defaultOptions);

  if (extraArgs.length) {
    finalOptions.jestOptions.push(...extraArgs);
  }

  return finalOptions;
};

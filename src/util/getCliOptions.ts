import { getParsedCliOptions } from './getParsedCliOptions';

export type PlaywrightOptions = string[];

export type CliOptions = {
  runnerOptions: {
    indexJson?: boolean;
    url?: string;
    configDir?: string;
    eject?: boolean;
    coverage?: boolean;
    coverageDirectory?: string;
    junit?: boolean;
    browsers?: string | string[];
    failOnConsole?: boolean;
    includeTags?: string;
    excludeTags?: string;
    skipTags?: string;
  } & Record<string, string | boolean>;
  playwrightOptions: PlaywrightOptions;
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
    playwrightOptions: process.argv.splice(0, 2),
  };

  const finalOptions = Object.keys(allOptions).reduce((acc: CliOptions, _key: string) => {
    let key = _key as StorybookRunnerCommand;
    let optionValue = allOptions[key];

    if (STORYBOOK_RUNNER_COMMANDS.includes(key)) {
      copyOption(acc.runnerOptions, key, optionValue);
    } else {
      if (optionValue === true) {
        acc.playwrightOptions.push(`--${key}`);
      } else if (optionValue === false) {
        acc.playwrightOptions.push(`--no-${key}`);
      } else {
        acc.playwrightOptions.push(`--${key}`, `${optionValue}`);
      }
    }

    return acc;
  }, defaultOptions);

  if (extraArgs.length) {
    finalOptions.playwrightOptions.push(...extraArgs);
  }

  return finalOptions;
};

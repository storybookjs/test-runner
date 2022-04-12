import * as storybookMain from './getStorybookMain';

import { getStorybookMetadata } from './getStorybookMetadata';

describe.only('getStorybookMetadata', () => {
  afterAll(() => {
    process.env.STORYBOOK_CONFIG_DIR = undefined;
  });

  it('should return configDir coming from environment variable', () => {
    const mockedMain = {
      stories: [],
    };

    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { configDir } = getStorybookMetadata();
    expect(configDir).toEqual(process.env.STORYBOOK_CONFIG_DIR);
  });

  it('should return storiesPath with default glob from CSF3 style config', () => {
    const mockedMain = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    };

    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { storiesPaths } = getStorybookMetadata();
    expect(storiesPaths).toMatchInlineSnapshot(
      `"<rootDir>/stories/basic/**/*.stories.@(mdx|tsx|ts|jsx|js)"`
    );
  });

  it('should return storiesPath with glob defined in CSF2 style config', () => {
    const mockedMain = {
      stories: ['../**/stories/*.stories.@(js|ts)'],
    };

    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { storiesPaths } = getStorybookMetadata();
    expect(storiesPaths).toMatchInlineSnapshot(`"<rootDir>/**/stories/*.stories.@(js|ts)"`);
  });

  it('should return storiesPath from mixed CSF2 and CSF3 style config', () => {
    const mockedMain = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
        '../stories/complex/*.stories.@(js|ts)',
      ],
    };

    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { storiesPaths } = getStorybookMetadata();
    expect(storiesPaths).toMatchInlineSnapshot(
      `"<rootDir>/stories/basic/**/*.stories.@(mdx|tsx|ts|jsx|js);<rootDir>/stories/complex/*.stories.@(js|ts)"`
    );
  });

  it('should return lazyCompilation=false when unset', () => {
    const mockedMain = { stories: [] };

    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    expect(getStorybookMetadata().lazyCompilation).toBe(false);
  });
  it('should return lazyCompilation=true when set', () => {
    const mockedMain = {
      stories: [],
      core: { builder: { name: 'webpack5', options: { lazyCompilation: true } } },
    };

    jest.spyOn(storybookMain, 'getStorybookMain').mockReturnValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    expect(getStorybookMetadata().lazyCompilation).toBe(true);
  });
});

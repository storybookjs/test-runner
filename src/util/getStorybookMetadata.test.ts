import { StorybookConfig } from 'storybook/internal/types';

import * as storybookMain from './getStorybookMain';
import { getStorybookMetadata } from './getStorybookMetadata';
import { describe, it, expect, afterAll, vi } from 'vitest';

vi.mock('storybook/internal/common', () => ({
  getProjectRoot: vi.fn(() => '/foo/bar'),
  normalizeStories: vi.fn(() => [
    {
      titlePrefix: 'Example',
      files: '**/*.stories.@(mdx|tsx|ts|jsx|js)',
      directory: './stories/basic',
      importPathMatcher:
        /^\.[\\/](?:stories\/basic(?:\/(?!\.)(?:(?:(?!(?:^|\/)\.).)*?)\/|\/|$)(?!\.)(?=.)[^/]*?\.stories\.(mdx|tsx|ts|jsx|js))$/,
    },
  ]),
}));

describe('getStorybookMetadata', () => {
  afterAll(() => {
    process.env.STORYBOOK_CONFIG_DIR = undefined;
  });

  it('should return configDir coming from environment variable', async () => {
    const mockedMain: Pick<StorybookConfig, 'stories'> = {
      stories: [],
    };

    vi.spyOn(storybookMain, 'getStorybookMain').mockResolvedValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { configDir } = await getStorybookMetadata();
    expect(configDir).toEqual(process.env.STORYBOOK_CONFIG_DIR);
  });

  it('should return storiesPath with default glob from CSF3 style config', async () => {
    const mockedMain: Pick<StorybookConfig, 'stories'> = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    };

    vi.spyOn(storybookMain, 'getStorybookMain').mockResolvedValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { storiesPaths } = await getStorybookMetadata();
    expect(storiesPaths).toMatchInlineSnapshot(
      `"/foo/bar/stories/basic/**/*.stories.@(mdx|tsx|ts|jsx|js)"`
    );
  });

  it('should return storiesPath with glob defined in CSF2 style config', async () => {
    const mockedMain: Pick<StorybookConfig, 'stories'> = {
      stories: ['../**/stories/*.stories.@(js|ts)'],
    };

    vi.spyOn(storybookMain, 'getStorybookMain').mockResolvedValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { storiesPaths } = await getStorybookMetadata();
    expect(storiesPaths).toMatchInlineSnapshot(
      `"/foo/bar/stories/basic/**/*.stories.@(mdx|tsx|ts|jsx|js)"`
    );
  });

  it('should return storiesPath from mixed CSF2 and CSF3 style config', async () => {
    const mockedMain: Pick<StorybookConfig, 'stories'> = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
        '../stories/complex/*.stories.@(js|ts)',
      ],
    };

    vi.spyOn(storybookMain, 'getStorybookMain').mockResolvedValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const { storiesPaths } = await getStorybookMetadata();
    expect(storiesPaths).toMatchInlineSnapshot(
      `"/foo/bar/stories/basic/**/*.stories.@(mdx|tsx|ts|jsx|js)"`
    );
  });

  it('should return lazyCompilation=false when unset', async () => {
    const mockedMain: Pick<StorybookConfig, 'stories'> = { stories: [] };

    vi.spyOn(storybookMain, 'getStorybookMain').mockResolvedValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    expect((await getStorybookMetadata()).lazyCompilation).toBe(false);
  });
  it('should return lazyCompilation=true when set', async () => {
    const mockedMain: Pick<StorybookConfig, 'stories' | 'core'> = {
      stories: [],
      core: { builder: { name: 'webpack5', options: { lazyCompilation: true } } },
    };

    vi.spyOn(storybookMain, 'getStorybookMain').mockResolvedValueOnce(mockedMain);
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    expect((await getStorybookMetadata()).lazyCompilation).toBe(true);
  });
});

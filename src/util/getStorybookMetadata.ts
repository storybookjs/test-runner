import { relative, resolve } from 'path';
import { normalizeStories } from '@storybook/core-common';
import { getStorybookMain } from './getStorybookMain';
import type { StoriesEntry } from '@storybook/types';

export const getStorybookMetadata = () => {
  const workingDir = resolve();
  const configDir = process.env.STORYBOOK_CONFIG_DIR || '';

  const main = getStorybookMain(configDir);
  const normalizedStoriesEntries = normalizeStories(main?.stories as StoriesEntry[], {
    configDir,
    workingDir,
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: new RegExp(specifier.importPathMatcher),
  }));

  const storiesPaths = normalizedStoriesEntries
    .map((entry) => entry.directory + '/' + entry.files)
    .map((dir) => '<rootDir>/' + relative(workingDir, dir))
    .join(';');

  // @ts-ignore -- this is added in @storybook/core-common@6.5, which we don't depend on
  const lazyCompilation = !!main?.core?.builder?.options?.lazyCompilation;

  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation,
  };
};

import { join } from 'path';
import { normalizeStories, getProjectRoot } from 'storybook/internal/common';
import { StoriesEntry } from 'storybook/internal/types';

import { getStorybookMain } from './getStorybookMain';

export const getStorybookMetadata = () => {
  const workingDir = getProjectRoot();
  const configDir = process.env.STORYBOOK_CONFIG_DIR ?? '.storybook';

  const main = getStorybookMain(configDir);
  const normalizedStoriesEntries = normalizeStories(main.stories as StoriesEntry[], {
    configDir,
    workingDir,
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: new RegExp(specifier.importPathMatcher),
  }));

  const storiesPaths = normalizedStoriesEntries
    .map((entry) => `${entry.directory}/${entry.files}`)
    .map((dir) => join(workingDir, dir))
    .join(';');

  // @ts-expect-error -- this is added in storybook/internal/common@6.5, which we don't depend on
  const lazyCompilation = !!main.core?.builder?.options?.lazyCompilation;

  // @ts-expect-error -- need to update to latest sb version
  const { disableTelemetry, enableCrashReports } = main.core || {};

  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation,
    disableTelemetry,
    enableCrashReports,
  };
};

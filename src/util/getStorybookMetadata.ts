import { join } from 'path';
import { normalizeStories, getProjectRoot } from 'storybook/internal/common';
import { StoriesEntry } from 'storybook/internal/types';

import { getStorybookMain } from './getStorybookMain';

export const getStorybookMetadata = async () => {
  const workingDir = getProjectRoot();
  const configDir = process.env.STORYBOOK_CONFIG_DIR ?? '.storybook';

  const main = await getStorybookMain(configDir);
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

  const lazyCompilation = !!main.core?.builder?.options?.lazyCompilation;

  const frameworkName =
    main.framework && typeof main.framework === 'string' ? main.framework : main.framework?.name;

  const { disableTelemetry, enableCrashReports } = main.core || {};

  return {
    configDir,
    workingDir,
    storiesPaths,
    normalizedStoriesEntries,
    lazyCompilation,
    disableTelemetry,
    enableCrashReports,
    frameworkName,
  };
};

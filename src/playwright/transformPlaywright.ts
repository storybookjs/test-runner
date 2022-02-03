import { resolve, relative } from 'path';
import template from '@babel/template';
import { normalizeStories } from '@storybook/core-common';
import { autoTitle } from '@storybook/store';

import { getStorybookMain } from '../util/cli';
import { transformCsf } from '../csf/transformCsf';

export const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });
      });

      return page.evaluate(({ id }) => __test(id), {
        id: %%id%%
      });
    }
  `,
  {
    plugins: ['jsx'],
  }
);

const getDefaultTitle = (filename: string) => {
  const workingDir = resolve();
  const configDir = process.env.STORYBOOK_CONFIG_DIR;

  const main = getStorybookMain(configDir);

  const normalizedStoriesEntries = normalizeStories(main.stories, {
    configDir,
    workingDir,
  }).map((specifier) => ({
    ...specifier,
    importPathMatcher: new RegExp(specifier.importPathMatcher),
  }));

  const filePath = './' + relative(workingDir, filename);

  return autoTitle(filePath, normalizedStoriesEntries);
};

export const transformPlaywright = (src: string, filename: string) => {
  const defaultTitle = getDefaultTitle(filename);
  const result = transformCsf(src, {
    // @ts-ignore
    testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
    defaultTitle,
  });
  return result;
};

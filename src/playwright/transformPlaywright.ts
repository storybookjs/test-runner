import { resolve, relative } from 'path';
import template from '@babel/template';
import { normalizeStories } from '@storybook/core-common';
import { autoTitle } from '@storybook/store';

import { getStorybookMain } from '../util/cli';
import { transformCsf } from '../csf/transformCsf';

const filePrefixer = template(`
  import global from 'global';
`);

export const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      const context = { id: %%id%%, title: %%title%%, name: %%name%% };

      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });
      });

      if(global.__sbPreRender) {
        await global.__sbPreRender(page, context);
      }

      const result = await page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
        id: %%id%%,
      });

      if(global.__sbPostRender) {
        await global.__sbPostRender(page, context);
      }

      return result;
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
    filePrefixer,
    // @ts-ignore
    testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
    defaultTitle,
  });
  return result;
};

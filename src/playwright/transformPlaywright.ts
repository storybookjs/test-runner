import { resolve, join, relative } from 'path';
import template from '@babel/template';
import { serverRequire, normalizeStories } from '@storybook/core-common';
import { autoTitle } from '@storybook/store';

import { transformCsf } from '../csf/transformCsf';

export const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });
      });

      return page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
        id: %%id%%,
        hasPlayFn: %%hasPlayFn%%,
      });
    }
  `,
  {
    plugins: ['jsx'],
  }
);

const getDefaultTitle = (filename: string) => {
  // we'll need to figure this out for different cases
  // e.g. --config-dir
  const configDir = resolve('.storybook');
  const workingDir = resolve();

  const main = serverRequire(join(configDir, 'main'));

  if (!main) {
    throw new Error('could not load main.js');
  }

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

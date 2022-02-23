import { relative } from 'path';
import template from '@babel/template';
import { autoTitle } from '@storybook/store';

import { getStorybookMetadata } from '../util';
import { transformCsf } from '../csf/transformCsf';

const filePrefixer = template(`
  import global from 'global';
  const { setupPage } = require('../../dist/cjs');
`);

export const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      const testFn = async() => {
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
      };

      try {
        await testFn();
      } catch(err) {
        if(err.toString().includes('Execution context was destroyed')) {
          await jestPlaywright.resetPage();
          await setupPage(global.page);
          await testFn();
        } else {
          throw err;
        }
      }
    }
  `,
  {
    plugins: ['jsx'],
  }
);

const getDefaultTitle = (filename: string) => {
  const { workingDir, normalizedStoriesEntries } = getStorybookMetadata();
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

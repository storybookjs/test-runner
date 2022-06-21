import { relative } from 'path';
import template from '@babel/template';
import { userOrAutoTitle } from '@storybook/store';

import { getStorybookMetadata } from '../util';
import { transformCsf } from '../csf/transformCsf';

const filePrefixer = template(`
  import global from 'global';
  const { setupPage } = require('@storybook/test-runner');
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

        if(global.__sbCollectCoverage) {
          await jestPlaywright.saveCoverage(page);
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

const makeTitleFactory = (filename: string) => {
  const { workingDir, normalizedStoriesEntries } = getStorybookMetadata();
  const filePath = './' + relative(workingDir, filename);

  return (userTitle: string) => userOrAutoTitle(filePath, normalizedStoriesEntries, userTitle);
};

export const transformPlaywright = (src: string, filename: string) => {
  const result = transformCsf(src, {
    filePrefixer,
    // @ts-ignore
    testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
    makeTitle: makeTitleFactory(filename),
  });
  return result;
};

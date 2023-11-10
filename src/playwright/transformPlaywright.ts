import { relative } from 'path';
import template from '@babel/template';
import { userOrAutoTitle } from '@storybook/preview-api';

import { getStorybookMetadata } from '../util';
import { transformCsf } from '../csf/transformCsf';
import type { TestPrefixer } from '../csf/transformCsf';
import dedent from 'ts-dedent';

const coverageErrorMessage = dedent`
  [Test runner] An error occurred when evaluating code coverage:
  The code in this story is not instrumented, which means the coverage setup is likely not correct.
  More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage
`;

export const testPrefixer: TestPrefixer = (context) => {
  return template(
    `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      const testFn = async() => {
        const context = { id: %%id%%, title: %%title%%, name: %%name%% };

        page.on('pageerror', (err) => {
          page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });
        });

        if(globalThis.__sbPreRender) {
          await globalThis.__sbPreRender(page, context);
        }

        const result = await page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
          id: %%id%%,
        });
  
        if(globalThis.__sbPostRender) {
          await globalThis.__sbPostRender(page, context);
        }

        if(globalThis.__sbCollectCoverage) {
          const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
          if (!isCoverageSetupCorrectly) {
            throw new Error(\`${coverageErrorMessage}\`);
          }

          await jestPlaywright.saveCoverage(page);
        }

        return result;
      };

      try {
        await testFn();
      } catch(err) {
        if(err.toString().includes('Execution context was destroyed')) {
          console.log(\`An error occurred in the following story, most likely because of a navigation: "\${%%title%%}/\${%%name%%}". Retrying...\`);
          await jestPlaywright.resetPage();
          await globalThis.__sbSetupPage(globalThis.page, globalThis.context);
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
  )({
    id: context.id,
    title: context.title,
    name: context.name,
    storyExport: context.storyExport,
  });
};

const makeTitleFactory = (filename: string) => {
  const { workingDir, normalizedStoriesEntries } = getStorybookMetadata();
  const filePath = `./${relative(workingDir, filename)}`;

  return (userTitle: string) =>
    userOrAutoTitle(filePath, normalizedStoriesEntries, userTitle) as string;
};

export const transformPlaywright = (src: string, filename: string) => {
  const result = transformCsf(src, {
    testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
    makeTitle: makeTitleFactory(filename),
  });
  return result;
};

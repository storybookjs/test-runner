import { relative } from 'path';
import template from '@babel/template';
import { userOrAutoTitle } from 'storybook/internal/preview-api';
import dedent from 'ts-dedent';

import { getStorybookMetadata } from '../util';
import { transformCsf } from '../csf/transformCsf';
import type { TestPrefixer } from '../csf/transformCsf';

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

        if(globalThis.__sbPreVisit) {
          await globalThis.__sbPreVisit(page, context);
        }

        let result;
        try {
          result = await page.addInitScript(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
            id: %%id%%,
          });
        } catch(err) {
          if(err.toString().includes('Execution context was destroyed')) {
            // Retry the test, possible Vite dep optimization flake
            throw err;
          } else {
            if(globalThis.__sbPostVisit) {
              await globalThis.__sbPostVisit(page, {...context, hasFailure: true });
            }
            throw err;
          }
        }
  
        if(globalThis.__sbPostVisit) {
          await globalThis.__sbPostVisit(page, context);
        }

        if(globalThis.__sbCollectCoverage) {
        const isCoverageSetupCorrectly = await page.addInitScript(() => '__coverage__' in window);
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
  )({ ...context });
};

const makeTitleFactory = (filename: string) => {
  const { workingDir, normalizedStoriesEntries } = getStorybookMetadata();
  const filePath = `./${relative(workingDir, filename)}`;

  return (userTitle: string) =>
    userOrAutoTitle(filePath, normalizedStoriesEntries, userTitle) as string;
};

export const transformPlaywright = (src: string, filename: string) => {
  const tags = process.env.STORYBOOK_PREVIEW_TAGS?.split(',') ?? [];
  const transformOptions = {
    testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
    makeTitle: makeTitleFactory(filename),
    previewAnnotations: { tags },
  };

  const result = transformCsf(src, transformOptions);
  return result;
};

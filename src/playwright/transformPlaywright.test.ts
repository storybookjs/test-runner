import dedent from 'ts-dedent';
import path from 'path';
import * as coreCommon from '@storybook/core-common';
import * as storybookMain from '../util/getStorybookMain';

import { transformPlaywright } from './transformPlaywright';

jest.mock('@storybook/core-common');

expect.addSnapshotSerializer({
  print: (val: any) => val.trim(),
  test: (val: any) => true,
});

describe('Playwright', () => {
  beforeEach(() => {
    const relativeSpy = jest.spyOn(path, 'relative');
    relativeSpy.mockReturnValueOnce('stories/basic/Header.stories.js');
    jest.spyOn(storybookMain, 'getStorybookMain').mockImplementation(() => ({
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    }));
    jest.spyOn(coreCommon, 'normalizeStories').mockImplementation(() => [
      {
        titlePrefix: 'Example',
        files: '**/*.stories.@(mdx|tsx|ts|jsx|js)',
        directory: './stories/basic',
        importPathMatcher:
          /^\.[\\/](?:stories\/basic(?:\/(?!\.)(?:(?:(?!(?:^|\/)\.).)*?)\/|\/|$)(?!\.)(?=.)[^/]*?\.stories\.(mdx|tsx|ts|jsx|js))$/,
      },
    ]);
  });

  const filename = './stories/basic/Header.stories.js';
  it('should generate a play test when the story has a play function', () => {
    expect(
      transformPlaywright(
        dedent`
        export default { title: 'foo/bar', component: Button };
        export const A = () => {};
        A.play = () => {};
      `,
        filename
      )
    ).toMatchInlineSnapshot(`
      import global from 'global';

      const {
        setupPage,
        waitFor
      } = require('@storybook/test-runner');

      if (!require.main) {
        describe("Example/foo/bar", () => {
          describe("A", () => {
            it("play-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-foo-bar--a",
                  title: "Example/foo/bar",
                  name: "A"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: "example-foo-bar--a",
                    err: err.message
                  });
                });
        
                if (global.__sbPreRender) {
                  await global.__sbPreRender(page, context);
                }
        
                await waitFor(() => page.evaluate(() => {
                  return typeof __test !== 'undefined';
                }));
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: "example-foo-bar--a"
                });
        
                if (global.__sbPostRender) {
                  await global.__sbPostRender(page, context);
                }
        
                return result;
              };
        
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  await jestPlaywright.resetPage();
                  await setupPage(global.page);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
  it('should generate a smoke test when story does not have a play function', () => {
    expect(
      transformPlaywright(
        dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
      `,
        filename
      )
    ).toMatchInlineSnapshot(`
      import global from 'global';

      const {
        setupPage,
        waitFor
      } = require('@storybook/test-runner');

      if (!require.main) {
        describe("Example/foo/bar", () => {
          describe("A", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-foo-bar--a",
                  title: "Example/foo/bar",
                  name: "A"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: "example-foo-bar--a",
                    err: err.message
                  });
                });
        
                if (global.__sbPreRender) {
                  await global.__sbPreRender(page, context);
                }
        
                await waitFor(() => page.evaluate(() => {
                  return typeof __test !== 'undefined';
                }));
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: "example-foo-bar--a"
                });
        
                if (global.__sbPostRender) {
                  await global.__sbPostRender(page, context);
                }
        
                return result;
              };
        
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  await jestPlaywright.resetPage();
                  await setupPage(global.page);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });

  it('should generate a smoke test with auto title', () => {
    expect(
      transformPlaywright(
        dedent`
        export default { component: Button };
        export const A = () => {};
      `,
        filename
      )
    ).toMatchInlineSnapshot(`
      import global from 'global';

      const {
        setupPage,
        waitFor
      } = require('@storybook/test-runner');

      if (!require.main) {
        describe("Example/Header", () => {
          describe("A", () => {
            it("smoke-test", async () => {
              const testFn = async () => {
                const context = {
                  id: "example-header--a",
                  title: "Example/Header",
                  name: "A"
                };
                page.on('pageerror', err => {
                  page.evaluate(({
                    id,
                    err
                  }) => __throwError(id, err), {
                    id: "example-header--a",
                    err: err.message
                  });
                });
        
                if (global.__sbPreRender) {
                  await global.__sbPreRender(page, context);
                }
        
                await waitFor(() => page.evaluate(() => {
                  return typeof __test !== 'undefined';
                }));
                const result = await page.evaluate(({
                  id,
                  hasPlayFn
                }) => __test(id, hasPlayFn), {
                  id: "example-header--a"
                });
        
                if (global.__sbPostRender) {
                  await global.__sbPostRender(page, context);
                }
        
                return result;
              };
        
              try {
                await testFn();
              } catch (err) {
                if (err.toString().includes('Execution context was destroyed')) {
                  await jestPlaywright.resetPage();
                  await setupPage(global.page);
                  await testFn();
                } else {
                  throw err;
                }
              }
            });
          });
        });
      }
    `);
  });
});

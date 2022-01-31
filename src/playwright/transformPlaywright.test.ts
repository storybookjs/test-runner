import dedent from 'ts-dedent';
import path from 'path';
import * as coreCommon from '@storybook/core-common';

import { transformPlaywright } from './transformPlaywright';

jest.mock('@storybook/core-common');

expect.addSnapshotSerializer({
  print: (val: any) => val.trim(),
  test: (val: any) => true,
});

describe('Playwright', () => {
  beforeEach(() => {
    const basePath = '/Users/yannbraga/open-source/test-runner';
    const pathSpy = jest.spyOn(path, 'resolve');
    pathSpy.mockReturnValueOnce(basePath + '/.storybook');
    pathSpy.mockReturnValueOnce(basePath);
    jest.spyOn(coreCommon, 'serverRequire').mockImplementation(() => ({
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
      if (!require.main) {
        describe("foo/bar", () => {
        describe("A", () => {
          it("play-test", async () => {
            page.on('pageerror', err => {
              page.evaluate(({
                id,
                err
              }) => __throwError(id, err), {
                id: "foo-bar--a",
                err: err.message
              });
            });
            return page.evaluate(({
              id,
              hasPlayFn
            }) => __test(id, hasPlayFn), {
              id: "foo-bar--a",
              hasPlayFn: true
            });
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
      if (!require.main) {
        describe("foo/bar", () => {
        describe("A", () => {
          it("smoke-test", async () => {
            page.on('pageerror', err => {
              page.evaluate(({
                id,
                err
              }) => __throwError(id, err), {
                id: "foo-bar--a",
                err: err.message
              });
            });
            return page.evaluate(({
              id,
              hasPlayFn
            }) => __test(id, hasPlayFn), {
              id: "foo-bar--a",
              hasPlayFn: false
            });
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
      if (!require.main) {
        describe("Example/Header", () => {
        describe("A", () => {
          it("smoke-test", async () => {
            page.on('pageerror', err => {
              page.evaluate(({
                id,
                err
              }) => __throwError(id, err), {
                id: "example-header--a",
                err: err.message
              });
            });
            return page.evaluate(({
              id,
              hasPlayFn
            }) => __test(id, hasPlayFn), {
              id: "example-header--a",
              hasPlayFn: false
            });
          });
        });
      });
      }
    `);
  });
});

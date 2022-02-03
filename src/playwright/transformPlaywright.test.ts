import dedent from 'ts-dedent';
import path from 'path';
import * as coreCommon from '@storybook/core-common';
import * as cli from '../util/cli';

import { transformPlaywright } from './transformPlaywright';

jest.mock('@storybook/core-common');
jest.mock('../util/cli');

expect.addSnapshotSerializer({
  print: (val: any) => val.trim(),
  test: (val: any) => true,
});

describe('Playwright', () => {
  beforeEach(() => {
    const relativeSpy = jest.spyOn(path, 'relative');
    relativeSpy.mockReturnValueOnce('stories/basic/Header.stories.js');
    jest.spyOn(cli, 'getStorybookMain').mockImplementation(() => ({
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
              id
            }) => __test(id), {
              id: "foo-bar--a"
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
              id
            }) => __test(id), {
              id: "foo-bar--a"
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
              id
            }) => __test(id), {
              id: "example-header--a"
            });
          });
        });
      });
      }
    `);
  });
});

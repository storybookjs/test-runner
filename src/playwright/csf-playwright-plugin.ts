import { join, relative } from 'path';
import type { PluginObj } from '@babel/core';
import type * as T from '@babel/types';
import template from '@babel/template';
import { CsfFile } from '@storybook/csf-tools';
import { userOrAutoTitle } from '@storybook/preview-api';
import { getStorybookMetadata } from '../util';

const describeTemplate = template(`
  test.describe(%%title%%, () => {
    %%body%%
  });
`);

const testTemplate = template(`
  test(%%name%%, async ({ page }) => {
    const context = { id: %%id%%, title: %%title%%, name: %%name%% };
    const storyPage = new StoryPage(page);
    await storyPage.test(context);
  });
`);

type BabelTypes = typeof T;

const makePlaywrightImport = (t: BabelTypes) =>
  t.importDeclaration(
    [t.importSpecifier(t.identifier('test'), t.identifier('test'))],
    t.stringLiteral('@playwright/test')
  );

const makeFixtureImport = (t: BabelTypes) =>
  t.importDeclaration(
    [t.importSpecifier(t.identifier('StoryPage'), t.identifier('StoryPage'))],
    t.stringLiteral(join(__dirname, 'StoryPage'))
  );

const makeTitleFactory = (filename: string) => {
  try {
    const { workingDir, normalizedStoriesEntries } = getStorybookMetadata();
    const filePath = `./${relative(workingDir, filename)}`;

    return (userTitle: string) =>
      userOrAutoTitle(filePath, normalizedStoriesEntries, userTitle) as string;
  } catch (e) {
    return (title: string) => title || '';
  }
};

export default function (babelContext: { types: BabelTypes }): PluginObj {
  const { types: t } = babelContext;

  return {
    visitor: {
      Program: {
        enter(path, state) {
          const { filename } = state;
          // FIXME: this makes use of a loophole that both
          // CsfFile and Playwright Test are using babel!
          // In the future, this probably won't be the case.

          if (!filename) {
            return;
          }
          // @ts-expect-error parent file is not typed
          const csf = new CsfFile(path.parent, {
            fileName: filename, // || join(cwd, 'default'),
            makeTitle: makeTitleFactory(filename),
          }).parse();

          const title = csf.meta.title as string;
          // console.log({ title });
          const body = csf.stories.map((story) => {
            const id = story.id;
            const name = story.name!;
            return testTemplate({
              id: t.stringLiteral(id),
              title: t.stringLiteral(title),
              name: t.stringLiteral(name),
            });
          });

          path.node.body = [
            makePlaywrightImport(t),
            makeFixtureImport(t),
            describeTemplate({
              title: t.stringLiteral(title),
              body,
            }) as T.Statement,
          ];
          return false;
        },
      },
    },
  };
}

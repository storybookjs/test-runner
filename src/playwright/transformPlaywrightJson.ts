import * as t from '@babel/types';
import generate from '@babel/generator';
import { ComponentTitle, StoryId, StoryName, toId } from 'storybook/internal/csf';

import { testPrefixer } from './transformPlaywright';
import { getTagOptions } from '../util/getTagOptions';

const makeTest = ({
  entry,
  shouldSkip,
  metaOrStoryPlay,
}: {
  entry: V4Entry;
  shouldSkip: boolean;
  metaOrStoryPlay: boolean;
}): t.Statement => {
  const result = testPrefixer({
    name: t.stringLiteral(entry.name),
    title: t.stringLiteral(entry.title),
    id: t.stringLiteral(entry.id),
    // FIXME
    storyExport: t.identifier(entry.id),
  });
  const stmt = (result as Array<t.ExpressionStatement>)[1];
  return t.expressionStatement(
    t.callExpression(shouldSkip ? t.identifier('it.skip') : t.identifier('it'), [
      t.stringLiteral(metaOrStoryPlay ? 'play-test' : 'smoke-test'),
      stmt.expression,
    ])
  );
};

export const makeDescribe = (title: string, stmts: t.Statement[]) => {
  // When there are no tests at all, we skip. The reason is that the file already went through Jest's transformation,
  // so we have to skip the describe to achieve a "excluded test" experience.
  // The code below recreates the following source:
  // describe.skip(`${title}`, () => { it('no-op', () => {}) });
  if (stmts.length === 0) {
    const noOpIt = t.expressionStatement(
      t.callExpression(t.identifier('it'), [
        t.stringLiteral('no-op'),
        t.arrowFunctionExpression([], t.blockStatement([])),
      ])
    );

    return t.expressionStatement(
      t.callExpression(t.memberExpression(t.identifier('describe'), t.identifier('skip')), [
        t.stringLiteral(title),
        t.arrowFunctionExpression([], t.blockStatement([noOpIt])),
      ])
    );
  }

  return t.expressionStatement(
    t.callExpression(t.identifier('describe'), [
      t.stringLiteral(title),
      t.arrowFunctionExpression([], t.blockStatement(stmts)),
    ])
  );
};

type V3Story = Omit<V4Entry, 'type'> & { parameters?: StoryParameters };
export type V3StoriesIndex = {
  v: 3;
  stories: Record<StoryId, V3Story>;
};
type V4Entry = {
  type?: 'story' | 'docs';
  id: StoryId;
  name: StoryName;
  title: ComponentTitle;
  tags?: string[];
};
export type V4Index = {
  v: 4;
  entries: Record<StoryId, V4Entry>;
};

type V5Entry = V4Entry & { tags: string[] };
export type V5Index = {
  v: 5;
  entries: Record<StoryId, V5Entry>;
};

type StoryParameters = {
  __id: StoryId;
  docsOnly?: boolean;
  fileName?: string;
};

export type UnsupportedVersion = { v: number };
const isV3DocsOnly = (stories: V3Story[]) => stories.length === 1 && stories[0].name === 'Page';

function v3TitleMapToV4TitleMap(titleIdToStories: Record<string, V3Story[]>) {
  return Object.fromEntries(
    Object.entries(titleIdToStories).map(([id, stories]) => [
      id,
      stories.map(
        ({ parameters, ...story }) =>
          ({
            type: isV3DocsOnly(stories) ? 'docs' : 'story',
            tags: isV3DocsOnly(stories) ? [] : ['test', 'dev'],
            ...story,
          } satisfies V4Entry)
      ),
    ])
  );
}

/**
 * Storybook 8.0 and below did not automatically tag stories with 'dev'.
 * Therefore Storybook 8.1 and above would not show composed 8.0 stories by default.
 * This function adds the 'dev' tag to all stories in the index to workaround this issue.
 */
function v4TitleMapToV5TitleMap(titleIdToStories: Record<string, V4Entry[]>) {
  return Object.fromEntries(
    Object.entries(titleIdToStories).map(([id, stories]) => [
      id,
      stories.map(
        (story) =>
          ({
            ...story,
            tags: story.tags ? ['test', 'dev', ...story.tags] : ['test', 'dev'],
          } satisfies V4Entry)
      ),
    ])
  );
}

function groupByTitleId<T extends { title: ComponentTitle }>(entries: T[]) {
  return entries.reduce<Record<string, T[]>>((acc, entry) => {
    const titleId = toId(entry.title);
    acc[titleId] = acc[titleId] || [];
    acc[titleId].push(entry);
    return acc;
  }, {});
}

/**
 * Generate one test file per component so that Jest can
 * run them in parallel.
 */
export const transformPlaywrightJson = async (
  index: V3StoriesIndex | V4Index | UnsupportedVersion
) => {
  let titleIdToEntries: Record<string, V4Entry[]>;
  if (index.v === 3) {
    const titleIdToStories = groupByTitleId<V3Story>(
      Object.values((index as V3StoriesIndex).stories)
    );
    titleIdToEntries = v3TitleMapToV4TitleMap(titleIdToStories);
  } else if (index.v === 4) {
    // TODO: Once Storybook 8.0 is released, we should only support v4 and higher
    titleIdToEntries = groupByTitleId<V4Entry>(Object.values((index as V4Index).entries));
    titleIdToEntries = v4TitleMapToV5TitleMap(titleIdToEntries);
  } else if (index.v === 5) {
    titleIdToEntries = groupByTitleId<V4Entry>(Object.values((index as V4Index).entries));
  } else {
    throw new Error(`Unsupported version ${index.v}`);
  }

  const { includeTags, excludeTags, skipTags } = await getTagOptions();

  const titleIdToTest = Object.entries(titleIdToEntries).reduce<Record<string, string>>(
    (acc, [titleId, entries]) => {
      const stories = entries.filter((s) => s.type !== 'docs');
      if (stories.length) {
        const storyTests = stories
          .filter((story) => {
            // If includeTags is passed, check if the story has any of them - else include by default
            const isIncluded =
              includeTags.length === 0 || includeTags.some((tag) => story.tags?.includes(tag));

            // If excludeTags is passed, check if the story does not have any of them
            const isNotExcluded = excludeTags.every((tag) => !story.tags?.includes(tag));

            return isIncluded && isNotExcluded;
          })
          .map((story) => {
            const shouldSkip = skipTags.some((tag) => story.tags?.includes(tag));

            return makeDescribe(story.name, [
              makeTest({
                entry: story,
                shouldSkip,
                metaOrStoryPlay: story.tags?.includes('play-fn') ?? false,
              }),
            ]);
          });
        const program = t.program([makeDescribe(stories[0].title, storyTests)]);

        const { code } = generate(program, {});

        acc[titleId] = code;
      }
      return acc;
    },
    {}
  );

  return titleIdToTest;
};

import * as t from '@babel/types';
import generate from '@babel/generator';
import { ComponentTitle, StoryId, StoryName, toId } from '@storybook/csf';

import { testPrefixer } from './transformPlaywright';

const makeTest = (entry: V4Entry): t.Statement => {
  const result = testPrefixer({
    name: t.stringLiteral(entry.name),
    title: t.stringLiteral(entry.title),
    id: t.stringLiteral(entry.id),
    // FIXME
    storyExport: t.identifier(entry.id),
  });
  const stmt = (result as Array<t.ExpressionStatement>)[1];
  return t.expressionStatement(
    t.callExpression(t.identifier('it'), [t.stringLiteral('test'), stmt.expression])
  );
};

const makeDescribe = (title: string, stmts: t.Statement[]) => {
  return t.expressionStatement(
    t.callExpression(t.identifier('describe'), [
      t.stringLiteral(title),
      t.arrowFunctionExpression([], t.blockStatement(stmts)),
    ])
  );
};

type V4Entry = { type?: 'story' | 'docs'; id: StoryId; name: StoryName; title: ComponentTitle };
export type V4Index = {
  v: 4;
  entries: Record<StoryId, V4Entry>;
};

type StoryParameters = {
  __id: StoryId;
  docsOnly?: boolean;
  fileName?: string;
};

type V3Story = Omit<V4Entry, 'type'> & { parameters?: StoryParameters };
export type V3StoriesIndex = {
  v: 3;
  stories: Record<StoryId, V3Story>;
};
export type UnsupportedVersion = { v: number };
const isV3DocsOnly = (stories: V3Story[]) => stories.length === 1 && stories[0].name === 'Page';

function v3TitleMapToV4TitleMap(
  titleIdToStories: Record<string, V3Story[]>
): Record<string, V4Entry[]> {
  return Object.fromEntries(
    Object.entries(titleIdToStories).map(([id, stories]) => [
      id,
      stories.map(
        ({ parameters, ...story }) =>
          ({
            type: isV3DocsOnly(stories) ? 'docs' : 'story',
            ...story,
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
export const transformPlaywrightJson = (index: V3StoriesIndex | V4Index | UnsupportedVersion) => {
  let titleIdToEntries: Record<string, V4Entry[]>;
  if (index.v === 3) {
    const titleIdToStories = groupByTitleId<V3Story>(
      Object.values((index as V3StoriesIndex).stories)
    );
    titleIdToEntries = v3TitleMapToV4TitleMap(titleIdToStories);
  } else if (index.v === 4) {
    titleIdToEntries = groupByTitleId<V4Entry>(Object.values((index as V4Index).entries));
  } else {
    throw new Error(`Unsupported version ${index.v}`);
  }

  const titleIdToTest = Object.entries(titleIdToEntries).reduce<Record<string, string>>(
    (acc, [titleId, entries]) => {
      const stories = entries.filter((s) => s.type !== 'docs');
      if (stories.length) {
        const storyTests = stories.map((story) => makeDescribe(story.name, [makeTest(story)]));
        const program = t.program([makeDescribe(stories[0].title, storyTests)]) as babel.types.Node;

        const { code } = generate(program, {});

        acc[titleId] = code;
      }
      return acc;
    },
    {}
  );

  return titleIdToTest;
};

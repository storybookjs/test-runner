import * as t from '@babel/types';
import generate from '@babel/generator';
import { toId } from '@storybook/csf';

import { testPrefixer } from './transformPlaywright';

type Story = { id: string; name: string; title: string; parameters?: Record<string, any>, kind: string, story: string };

const makeTest = (story: Story): t.Statement => {
  const result: any = testPrefixer({
    name: t.stringLiteral(story.name),
    title: t.stringLiteral(story.title),
    id: t.stringLiteral(story.id),
    // FIXME
    storyExport: t.identifier(story.id),
  });
  const stmt = result[1] as t.ExpressionStatement;
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

// FIXME: this should be a CSF helper
const isDocsOnly = (stories: Story[]) => stories.length === 1 && stories[0].name === 'Page';

/**
 * Generate one test file per component so that Jest can
 * run them in parallel.
 */
export const transformPlaywrightJson = (src: string) => {
  const json = JSON.parse(src);
  if (json.v !== 3) {
    throw new Error(`Unsupported version ${json.v}`);
  }
  const stories = Object.values(json.stories) as Story[];
  const titleIdToStories = stories.reduce((acc, story) => {
    const titleId = toId(story.kind, story.story);
    acc[titleId] = acc[titleId] || [];
    acc[titleId].push(story);
    return acc;
  }, {} as { [key: string]: Story[] });

  const titleIdToTest = Object.entries(titleIdToStories).reduce((acc, [titleId, stories]) => {
    if (!isDocsOnly(stories)) {
      const storyTests = stories.map((story) => makeDescribe(story.name, [makeTest(story)]));
      const program = t.program([makeDescribe(stories[0].title, storyTests)]);

      const { code } = generate(program, {});

      acc[titleId] = code;
    }
    return acc;
  }, {} as { [key: string]: string });

  return titleIdToTest;
};

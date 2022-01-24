import * as t from '@babel/types';
import generate from '@babel/generator';

import { testPrefixer } from './transformPlaywright';

type Story = { id: string; name: string; title: string };

const makeTest = (story: Story): t.Statement => {
  const result: any = testPrefixer({
    name: t.stringLiteral(story.name),
    title: t.stringLiteral(story.title),
    id: t.stringLiteral(story.id),
    // FIXME
    storyExport: t.identifier(story.id),
    hasPlayFn: t.booleanLiteral(false),
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

export const transformPlaywrightJson = (src: string) => {
  const json = JSON.parse(src);
  if (json.v !== 3) {
    throw new Error(`Unsupported version ${json.v}`);
  }
  const stories = Object.values(json.stories) as Story[];
  const storyGroups = stories.reduce((acc, story) => {
    acc[story.title] = acc[story.title] || [];
    acc[story.title].push(story);
    return acc;
  }, {} as { [key: string]: Story[] });

  const storyTests = stories.map((story) => makeDescribe(story.name, [makeTest(story)]));
  const program = t.program(
    Object.entries(storyGroups).map(([title, stories]) => makeDescribe(title, storyTests))
  );

  const { code } = generate(program, {});
  return code;
};

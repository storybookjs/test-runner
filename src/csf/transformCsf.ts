/* eslint-disable no-underscore-dangle */
import { loadCsf } from '@storybook/csf-tools';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { storyNameFromExport, toId } from '@storybook/csf';
import dedent from 'ts-dedent';

const logger = console;

export interface TestContext {
  storyExport?: t.Identifier;
  name: t.Literal;
  title: t.Literal;
  id: t.Literal;
}
type TemplateResult = t.Statement | t.Statement[];
type FilePrefixer = () => TemplateResult;
export type TestPrefixer = (context: TestContext) => TemplateResult;

interface TransformOptions {
  clearBody?: boolean;
  filePrefixer?: FilePrefixer;
  beforeEachPrefixer?: FilePrefixer;
  testPrefixer?: TestPrefixer;
  insertTestIfEmpty?: boolean;
  makeTitle?: (userTitle: string) => string;
}

const prefixFunction = (
  key: string,
  title: string,
  input: t.Expression,
  testPrefixer?: TestPrefixer
) => {
  const name = storyNameFromExport(key);
  const context: TestContext = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name), // FIXME .name annotation
    title: t.stringLiteral(title),
    id: t.stringLiteral(toId(title, name)),
  };

  const result = makeArray(testPrefixer(context));
  const stmt = result[1] as t.ExpressionStatement;
  return stmt.expression;
};

const makePlayTest = (
  key: string,
  title: string,
  metaOrStoryPlay: t.Node,
  testPrefix?: TestPrefixer
): t.Statement[] => {
  return [
    t.expressionStatement(
      t.callExpression(t.identifier('it'), [
        t.stringLiteral(!!metaOrStoryPlay ? 'play-test' : 'smoke-test'),
        prefixFunction(key, title, metaOrStoryPlay as t.Expression, testPrefix),
      ])
    ),
  ];
};

const makeDescribe = (
  key: string,
  tests: t.Statement[],
  beforeEachBlock?: t.ExpressionStatement
): t.Statement | null => {
  const blockStatements = beforeEachBlock ? [beforeEachBlock, ...tests] : tests;
  return t.expressionStatement(
    t.callExpression(t.identifier('describe'), [
      t.stringLiteral(key),
      t.arrowFunctionExpression([], t.blockStatement(blockStatements)),
    ])
  );
};

const makeBeforeEach = (beforeEachPrefixer: FilePrefixer) => {
  const stmt = beforeEachPrefixer() as t.ExpressionStatement;

  return t.expressionStatement(t.callExpression(t.identifier('beforeEach'), [stmt.expression]));
};

export const makeArray = (templateResult: TemplateResult) =>
  Array.isArray(templateResult) ? templateResult : [templateResult];

export const transformCsf = (
  code: string,
  {
    filePrefixer,
    clearBody = false,
    testPrefixer,
    beforeEachPrefixer,
    insertTestIfEmpty,
    makeTitle,
  }: TransformOptions = {}
) => {
  const csf = loadCsf(code, { makeTitle });
  csf.parse();

  const storyExports = Object.keys(csf._stories);
  const title = csf.meta.title;

  const storyPlays = storyExports.reduce((acc, key) => {
    const annotations = csf._storyAnnotations[key];
    if (annotations?.play) {
      acc[key] = annotations.play;
    }
    return acc;
  }, {} as Record<string, t.Node>);
  const playTests = storyExports
    .map((key: string) => {
      let tests: t.Statement[] = [];
      tests = [...tests, ...makePlayTest(key, title, storyPlays[key], testPrefixer)];

      if (tests.length) {
        return makeDescribe(key, tests);
      }
      return null;
    })
    .filter(Boolean);

  const allTests = playTests;

  let result = '';

  // FIXME: insert between imports
  if (filePrefixer) {
    const { code: prefixCode } = generate(t.program(makeArray(filePrefixer())), {});
    result = `${prefixCode}\n`;
  }
  if (!clearBody) result = `${result}${code}\n`;
  if (allTests.length) {
    const describe = makeDescribe(
      csf.meta.title,
      allTests,
      beforeEachPrefixer ? makeBeforeEach(beforeEachPrefixer) : undefined
    );
    const { code: describeCode } = generate(describe, {});
    result = dedent`
      ${result}
      if (!require.main) {
        ${describeCode}
      }
    `;
  } else if (insertTestIfEmpty) {
    result = `describe('${csf.meta.title}', () => { it('no-op', () => {}) });`;
  }
  return result;
};

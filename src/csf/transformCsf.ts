/* eslint-disable no-underscore-dangle */
import { loadCsf } from '@storybook/csf-tools';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { toId, storyNameFromExport } from '@storybook/csf';
import dedent from 'ts-dedent';

const logger = console;

export interface TestContext {
  storyExport?: t.Identifier;
  name: t.Literal;
  title: t.Literal;
  id: t.Literal;
  hasPlayFn?: t.BooleanLiteral;
}
type FilePrefixer = () => t.Statement[];
type TestPrefixer = (context: TestContext) => t.Statement[];
const JEST_GLOBAL_REGEX = /(before|after)(All|Each)$/;

interface TransformOptions {
  clearBody?: boolean;
  filePrefixer?: FilePrefixer;
  testPrefixer?: TestPrefixer;
  insertTestIfEmpty?: boolean;
}

const prefixFunction = (
  key: string,
  title: string,
  input: t.Expression,
  testPrefixer?: TestPrefixer
) => {
  const clone = t.cloneDeepWithoutLoc(input);
  const name = storyNameFromExport(key);
  const context: TestContext = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name), // FIXME .name annotation
    title: t.stringLiteral(title), // FIXME: auto-title
    id: t.stringLiteral(toId(title, name)),
    hasPlayFn: t.booleanLiteral(!!input),
  };

  // instead, let's just make the prefixer return the function
  const result = testPrefixer(context);
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
        t.stringLiteral('play'),
        prefixFunction(key, title, metaOrStoryPlay as t.Expression, testPrefix),
      ])
    ),
  ];
};

const makeDescribe = (key: string, tests: t.Statement[]): t.Statement | null => {
  return t.expressionStatement(
    t.callExpression(t.identifier('describe'), [
      t.stringLiteral(key),
      t.arrowFunctionExpression([], t.blockStatement(tests)),
    ])
  );
};

export const transformCsf = (
  code: string,
  { filePrefixer, clearBody = false, testPrefixer, insertTestIfEmpty }: TransformOptions = {}
) => {
  const csf = loadCsf(code, { defaultTitle: 'FIXME' });
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
    const { code: prefixCode } = generate(t.program(filePrefixer()), {});
    result = `${prefixCode}\n`;
  }
  if (!clearBody) result = `${result}${code}\n`;
  if (allTests.length) {
    const describe = makeDescribe(csf.meta.title, allTests);
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

/* eslint-disable no-underscore-dangle */
import { loadCsf } from '@storybook/csf-tools';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { toId, storyNameFromExport } from '@storybook/csf';

const logger = console;

export interface TestContext {
  storyExport?: t.Identifier;
  name: t.Literal;
  title: t.Literal;
  id: t.Literal;
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
  };
  /*
  This prefixes the play function with setup code

  if (t.isArrowFunctionExpression(clone) && testPrefixer) {
    const { body } = clone;
    if (t.isBlockStatement(body)) {
      const prefix = testPrefixer(context);
      prefix.reverse();
      prefix.forEach((s) => body.body.unshift(s));
    } else if (t.isExpression(body)) {
      const prefix = testPrefixer(context);
      const block = t.blockStatement([...prefix, t.expressionStatement(body)]);
      clone.body = block;
    } else {
      logger.info(`Skipping test prefix for "${key}" of type: ${body}`);
    }
  }
  return clone;
  */

  // instead, let's just make the prefixer return the function
  const result = testPrefixer(context);
  const stmt = result[1] as t.ExpressionStatement;
  return stmt.expression;
};

const makeJestGlobals = (metaTests: t.Node): t.Statement[] => {
  if (t.isObjectExpression(metaTests)) {
    return metaTests.properties
      .map((p: t.ObjectProperty) => {
        if (t.isIdentifier(p.key)) {
          const testName = p.key.name;
          if (!JEST_GLOBAL_REGEX.test(p.key.name)) {
            return null;
          }
          const globalFunction = p.value as t.Expression;
          return t.expressionStatement(
            t.callExpression(t.identifier(p.key.name), [globalFunction])
          );
        }
        logger.log(`Skipping non-identifier ${p.key}`);
        return null;
      })
      .filter(Boolean);
  }
  return [];
};

const makeStoryTests = (
  key: string,
  title: string,
  metaOrStoryTests: t.Node,
  testPrefix?: TestPrefixer
): t.Statement[] => {
  if (t.isObjectExpression(metaOrStoryTests)) {
    return metaOrStoryTests.properties
      .map((p: t.ObjectProperty) => {
        if (t.isIdentifier(p.key)) {
          const testName = p.key.name;
          if (JEST_GLOBAL_REGEX.test(p.key.name)) {
            return null;
          }
          const testFunction = p.value as t.Expression;
          return t.expressionStatement(
            t.callExpression(t.identifier('it'), [
              t.stringLiteral(testName),
              prefixFunction(key, title, testFunction, testPrefix),
            ])
          );
        }
        logger.log(`Skipping non-identifier ${p.key}`);
        return null;
      })
      .filter(Boolean);
  }
  if (metaOrStoryTests) {
    logger.log(`Skipping unknown test type for "${key}": ${metaOrStoryTests.type}`);
  }
  return [];
};

const makePlayTest = (
  key: string,
  title: string,
  metaOrStoryPlay: t.Node,
  testPrefix?: TestPrefixer
): t.Statement[] => {
  //if (metaOrStoryPlay) {
  return [
    t.expressionStatement(
      t.callExpression(t.identifier('it'), [
        t.stringLiteral('play'),
        prefixFunction(key, title, metaOrStoryPlay as t.Expression, testPrefix),
      ])
    ),
  ];
  //}
  //return [];
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
  const csf = loadCsf(code);
  csf.parse();

  const storyExports = Object.keys(csf._stories);
  const storyTests = storyExports.reduce((acc, key) => {
    const annotations = csf._storyAnnotations[key];
    if (annotations?.tests) {
      acc[key] = annotations.tests;
    }
    return acc;
  }, {} as Record<string, t.Node>);

  const metaTests = csf._metaAnnotations.tests;
  const metaJestGlobals = makeJestGlobals(metaTests);
  const title = csf.meta.title;
  const combinedTests = storyExports
    .map((key: string) => {
      let tests: t.Statement[] = [];

      // tests: ...
      // tests = [...tests, ...makeStoryTests(key, title, metaTests, testPrefixer)];
      tests = [...tests, ...makeStoryTests(key, title, storyTests[key], testPrefixer)];

      const storyJestGlobals = makeJestGlobals(storyTests[key]);
      if (tests.length) {
        return makeDescribe(key, [...storyJestGlobals, ...tests]);
      }
      return null;
    })
    .filter(Boolean);

  // Alternative "play" proposal
  const storyPlays = storyExports.reduce((acc, key) => {
    const annotations = csf._storyAnnotations[key];
    if (annotations?.play) {
      acc[key] = annotations.play;
    }
    return acc;
  }, {} as Record<string, t.Node>);
  const metaPlay = csf._metaAnnotations.play;
  const playTests = storyExports
    .map((key: string) => {
      let tests: t.Statement[] = [];

      // tests: ...
      // tests = [...tests, ...makePlayTest(key, title, metaPlay, testPrefixer)];
      tests = [...tests, ...makePlayTest(key, title, storyPlays[key], testPrefixer)];

      if (tests.length) {
        return makeDescribe(key, tests);
      }
      return null;
    })
    .filter(Boolean);

  const allTests = [...playTests, ...combinedTests];

  let result = '';

  // FIXME: insert between imports
  if (filePrefixer) {
    const { code: prefixCode } = generate(t.program(filePrefixer()), {});
    result = `${prefixCode}\n`;
  }
  if (!clearBody) result = `${result}${code}\n`;
  for (let i = 0; i < metaJestGlobals.length; i += 1) {
    const { code: globalCode } = generate(metaJestGlobals[i], {});
    result = `${result}${globalCode}\n`;
  }
  // if (allTests.length) {
  //   const describe = makeDescribe(csf.meta.title, allTests);
  //   const { code: describeCode } = generate(describe, {});
  //   result = `${result}${describeCode}`;
  // } else if (insertTestIfEmpty) {
  result = `describe('${csf.meta.title}', () => { it('no-op', () => {}) });`;
  //}
  return result;
};

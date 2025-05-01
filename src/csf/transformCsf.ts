/* eslint-disable no-underscore-dangle */
import { toId, storyNameFromExport, combineTags } from 'storybook/internal/csf';
import { loadCsf } from 'storybook/internal/csf-tools';
import * as t from '@babel/types';
import generate from '@babel/generator';
import dedent from 'ts-dedent';

import { getTagOptions } from '../util/getTagOptions';

export interface TestContext {
  storyExport?: t.Identifier;
  name: t.Literal;
  title: t.Literal;
  id: t.Literal;
}
type TemplateResult = t.Statement | t.Statement[];
type FilePrefixer = () => TemplateResult;
export type TestPrefixer = (context: TestContext) => TemplateResult;

export interface TransformOptions {
  clearBody?: boolean;
  beforeEachPrefixer?: FilePrefixer;
  testPrefixer: TestPrefixer;
  insertTestIfEmpty?: boolean;
  makeTitle?: (userTitle: string) => string;
  includeTags?: string[];
  excludeTags?: string[];
  skipTags?: string[];
}

export const prefixFunction = ({
  key,
  testPrefixer,
  title,
  id,
}: {
  key: string;
  title: string;
  testPrefixer: TestPrefixer;
  id?: string;
}) => {
  const name = storyNameFromExport(key);
  const context: TestContext = {
    storyExport: t.identifier(key),
    name: t.stringLiteral(name), // FIXME .name annotation
    title: t.stringLiteral(title),
    id: t.stringLiteral(toId(id ?? title, name)),
  };

  const result = makeArray(testPrefixer(context));
  const stmt = result[1] as t.ExpressionStatement;
  return stmt.expression;
};

const makePlayTest = ({
  key,
  metaOrStoryPlay,
  title,
  id,
  testPrefix,
  shouldSkip,
}: {
  key: string;
  title: string;
  id?: string;
  metaOrStoryPlay?: boolean;
  testPrefix: TestPrefixer;
  shouldSkip?: boolean;
}): t.ExpressionStatement[] => {
  return [
    t.expressionStatement(
      t.callExpression(shouldSkip ? t.identifier('it.skip') : t.identifier('it'), [
        t.stringLiteral(metaOrStoryPlay ? 'play-test' : 'render-test'),
        prefixFunction({ key, title, testPrefixer: testPrefix, id }),
      ])
    ),
  ];
};

const makeDescribe = (
  key: string,
  tests: t.Statement[],
  beforeEachBlock?: t.ExpressionStatement
): t.ExpressionStatement => {
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

const makeArray = (templateResult: TemplateResult) =>
  Array.isArray(templateResult) ? templateResult : [templateResult];

export const transformCsf = (
  code: string,
  {
    clearBody = false,
    testPrefixer,
    beforeEachPrefixer,
    insertTestIfEmpty,
    makeTitle,
    previewAnnotations = { tags: [] },
  }: TransformOptions & { previewAnnotations?: Record<string, any> }
) => {
  const { includeTags, excludeTags, skipTags } = getTagOptions();

  const csf = loadCsf(code, { makeTitle: makeTitle ?? ((userTitle: string) => userTitle) });
  csf.parse();

  const storyExports = Object.keys(csf._stories);
  const title = csf.meta?.title;

  const storyAnnotations = storyExports.reduce<Record<string, { play?: t.Node; tags?: string[] }>>(
    (acc, key) => {
      const annotations = csf._storyAnnotations[key];
      acc[key] = {};
      if (annotations?.play) {
        // @ts-expect-error type mismatch – check later
        acc[key].play = annotations.play;
      }

      acc[key].tags = combineTags(
        'test',
        'dev',
        ...previewAnnotations.tags,
        ...(csf.meta?.tags || []),
        ...(csf._stories[key].tags || [])
      );

      return acc;
    },
    {}
  );

  const allTests = storyExports
    .filter((key) => {
      // If includeTags is passed, check if the story has any of them - else include by default
      const isIncluded =
        includeTags.length === 0 ||
        includeTags.some((tag) => storyAnnotations[key].tags?.includes(tag));

      // If excludeTags is passed, check if the story does not have any of them
      const isNotExcluded = excludeTags.every((tag) => !storyAnnotations[key].tags?.includes(tag));

      return isIncluded && isNotExcluded;
    })
    .map((key: string) => {
      let tests: t.Statement[] = [];
      const shouldSkip = skipTags.some((tag) => storyAnnotations[key].tags?.includes(tag));
      if (title) {
        tests = [
          ...tests,
          ...makePlayTest({
            key,
            title,
            id: csf.meta.id,
            metaOrStoryPlay: !!storyAnnotations[key]?.play,
            testPrefix: testPrefixer,
            shouldSkip,
          }),
        ];
      }

      if (tests.length) {
        return makeDescribe(key, tests);
      }
    })
    .filter(Boolean) as t.Statement[];

  let result = '';

  if (!clearBody) result = `${result}${code}\n`;
  if (allTests.length) {
    const describe = makeDescribe(
      csf.meta?.title as string,
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
    // When there are no tests at all, we skip. The reason is that the file already went through Jest's transformation,
    // so we have to skip the describe to achieve a "excluded test" experience.
    result = `describe.skip('${csf.meta?.title}', () => { it('no-op', () => {}) });`;
  }
  return result;
};

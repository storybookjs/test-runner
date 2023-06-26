import { prefixFunction, transformCsf } from './transformCsf';
import { testPrefixer } from '../playwright/transformPlaywright';
import template from '@babel/template';
import * as t from '@babel/types';

describe('transformCsf', () => {
  it('inserts a no-op test if there are no stories', () => {
    const csfCode = `
      export default {
        title: 'Button',
      };
    `;
    const expectedCode = `describe('Button', () => { it('no-op', () => {}) });`;

    const result = transformCsf(csfCode, { insertTestIfEmpty: true });

    expect(result).toEqual(expectedCode);
  });

  it('calls the testPrefixer function for each test', () => {
    const csfCode = `
      export default {
        title: 'Button',
        parameters: {
          play: {
            steps: [
              { id: 'step1', action: 'click', target: 'button' },
              { id: 'step2', action: 'click', target: 'button' },
            ],
          },
        },
      };

      export const Primary = () => '<button>Primary</button>';
    `;

    const result = transformCsf(csfCode, { testPrefixer });

    expect(result).toMatchSnapshot();
  });

  it('calls the beforeEachPrefixer function once', () => {
    const csfCode = `
      export default {
        title: 'Button',
        parameters: {
          play: {
            steps: [
              { id: 'step1', action: 'click', target: 'button' },
              { id: 'step2', action: 'click', target: 'button' },
            ],
          },
        },
      };

      export const Primary = () => '<button>Primary</button>';
    `;
    const result = transformCsf(csfCode, { testPrefixer, beforeEachPrefixer: undefined });

    expect(result).toMatchSnapshot();
  });

  it('clears the body if clearBody option is true', () => {
    const csfCode = `
      export default {
        title: 'Button',
        parameters: {
          play: {
            steps: [
              { id: 'step1', action: 'click', target: 'button' },
              { id: 'step2', action: 'click', target: 'button' },
            ],
          },
        },
      };

      export const Primary = () => '<button>Primary</button>';
    `;

    const result = transformCsf(csfCode, { testPrefixer, clearBody: true });

    expect(result).toMatchSnapshot();
  });

  it('executes beforeEach code before each test', () => {
    const code = `
    export default {
        title: 'Button',
        parameters: {
          play: {
            steps: [
              { id: 'step1', action: 'click', target: 'button' },
              { id: 'step2', action: 'click', target: 'button' },
            ],
          },
        },
      };

      export const Primary = () => '<button>Primary</button>';
    `;
    const beforeEachPrefixer = () => {
      const logStatement = template.expression`console.log("beforeEach called")`;
      const beforeEachBlock = template.statement`beforeEach(() => { ${logStatement()} })`;
      return beforeEachBlock();
    };
    const result = transformCsf(code, { beforeEachPrefixer });

    expect(result).toMatchSnapshot();
  });
});

describe('prefixFunction', () => {
  it('returns input expression if testPrefixer is not provided', () => {
    const key = 'key';
    const title = 'title';
    const input = t.identifier('input');
    const result = prefixFunction(key, title, input);
    expect(result).toEqual(input);
  });

  it('returns null literal if testPrefixer returns undefined', () => {
    const key = 'key';
    const title = 'title';
    const input = t.identifier('input');
    const result = prefixFunction(key, title, input, testPrefixer);
    expect(result).toMatchSnapshot();
  });

  it('returns expression from testPrefixer if it returns a valid expression', () => {
    const key = 'key';
    const title = 'title';
    const input = t.identifier('input');
    const testPrefixer = () => t.expressionStatement(t.identifier('prefix'));
    const result = prefixFunction(key, title, input, testPrefixer);
    expect(result).toEqual(t.identifier('input'));
  });
});

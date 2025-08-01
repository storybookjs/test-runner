import { TestPrefixer, TransformOptions, transformCsf } from './transformCsf';
import { testPrefixer } from '../playwright/transformPlaywright';
import template from '@babel/template';
import { describe, it, expect } from 'vitest';

describe('transformCsf', async () => {
  it('inserts a no-op test if there are no stories', async () => {
    const csfCode = `
      export default {
        title: 'Button',
      };
    `;
    const expectedCode = `describe.skip('Button', () => { it('no-op', () => {}) });`;

    const result = await transformCsf(csfCode, { insertTestIfEmpty: true } as TransformOptions);

    expect(result).toEqual(expectedCode);
  });

  it('returns empty result if there are no stories', async () => {
    const csfCode = `
      export default {
        title: 'Button',
      };
    `;

    const result = await transformCsf(csfCode, { testPrefixer });

    expect(result).toMatchSnapshot();
  });

  it('calls the testPrefixer function for each test', async () => {
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

    const result = await transformCsf(csfCode, { testPrefixer });

    expect(result).toMatchSnapshot();
  });

  it('calls the beforeEachPrefixer function once', async () => {
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
    const result = await transformCsf(csfCode, { testPrefixer, beforeEachPrefixer: undefined });

    expect(result).toMatchSnapshot();
  });

  it('clears the body if clearBody option is true', async () => {
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

    const result = await transformCsf(csfCode, { testPrefixer, clearBody: true });

    expect(result).toMatchSnapshot();
  });

  it('executes beforeEach code before each test', async () => {
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
    const testPrefixer = template(`
      console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
      async () => {}`) as unknown as TestPrefixer;

    const result = await transformCsf(code, {
      beforeEachPrefixer,
      testPrefixer,
    } as TransformOptions);

    expect(result).toMatchSnapshot();
  });
});

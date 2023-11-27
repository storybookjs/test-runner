import { TestPrefixer, TransformOptions, transformCsf } from './transformCsf';
import { testPrefixer } from '../playwright/transformPlaywright';
import template from '@babel/template';

describe('transformCsf', () => {
  it('inserts a no-op test if there are no stories', () => {
    const csfCode = `
      export default {
        title: 'Button',
      };
    `;
    const expectedCode = `describe.skip('Button', () => { it('no-op', () => {}) });`;

    const result = transformCsf(csfCode, { insertTestIfEmpty: true } as TransformOptions);

    expect(result).toEqual(expectedCode);
  });

  it('returns empty result if there are no stories', () => {
    const csfCode = `
      export default {
        title: 'Button',
      };
    `;

    const result = transformCsf(csfCode, { testPrefixer });

    expect(result).toMatchSnapshot();
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
    const testPrefixer = template(`
      console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
      async () => {}`) as unknown as TestPrefixer;

    const result = transformCsf(code, { beforeEachPrefixer, testPrefixer } as TransformOptions);

    expect(result).toMatchSnapshot();
  });
});

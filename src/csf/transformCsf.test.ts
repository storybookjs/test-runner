import dedent from 'ts-dedent';
import * as t from '@babel/types';
import { transformCsf } from './transformCsf';

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => true,
});

const transform = (code: string) => transformCsf(code, { clearBody: true }).trim();

describe('test csf', () => {
  describe('test generation', () => {
    it('no stories', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar', tests: { baz: () => {} } };
        `)
      ).toMatchInlineSnapshot(``);
    });

    it('no tests', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          export const B = () => {};
        `)
      ).toMatchInlineSnapshot(``);
    });

    it('component tests', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar', tests: { baz: () => {} } };
          export const A = () => {};
          export const B = () => {};
       `)
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {});
          });
          describe("B", () => {
            it("baz", () => {});
          });
        });
      `);
    });

    it('story tests', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          A.tests = { baz: () => {} };
        `)
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {});
          });
        });
      `);
    });

    it('async tests', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          A.tests = { baz: async () => {} };
        `)
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", async () => {});
          });
        });
      `);
    });
  });

  describe('jest globals', () => {
    it('handles meta globals', () => {
      expect(
        transform(dedent`
          export default {
            title: 'foo/bar',
            tests: {
              baz: () => {},
              beforeAll: () => {},
              beforeEach: () => {},
              afterAll: () => {},
              afterEach: () => {},
            },
          };
          export const A = () => {};
          export const B = () => {};
        `)
      ).toMatchInlineSnapshot(`
        beforeAll(() => {});
        beforeEach(() => {});
        afterAll(() => {});
        afterEach(() => {});
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {});
          });
          describe("B", () => {
            it("baz", () => {});
          });
        });
      `);
    });

    it('handles story globals', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          A.tests = {
            beforeAll: () => {},
            beforeEach: () => {},
            afterAll: () => {},
            afterEach: () => {},
            baz: () => {},
          }
        `)
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            beforeAll(() => {});
            beforeEach(() => {});
            afterAll(() => {});
            afterEach(() => {});
            it("baz", () => {});
          });
        });
      `);
    });
  });

  describe('options', () => {
    const single = dedent`
      export default { title: 'foo/bar' };
      export const A = () => {};
      A.tests = { baz: () => {} };
    `;

    it('preserve body', () => {
      expect(
        transformCsf(single, {
          // clearBody: false, (default)
        })
      ).toMatchInlineSnapshot(`
        export default { title: 'foo/bar' };
        export const A = () => {};
        A.tests = { baz: () => {} };
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {});
          });
        });
      `);
    });

    it('file prefix', () => {
      expect(
        transformCsf(single, {
          filePrefix: ['import { foo } from "bar"', 'import bar from "baz"'],
          clearBody: true,
        })
      ).toMatchInlineSnapshot(`
        import { foo } from "bar";
        import bar from "baz";
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {});
          });
        });
      `);
    });

    const testPrefix = (key: string) => [
      t.variableDeclaration('const', [
        t.variableDeclarator(t.identifier('haha'), t.identifier(key)),
      ]),
    ];

    it('test prefix', () => {
      expect(transformCsf(single, { testPrefix, clearBody: true })).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {
              const haha = A;
            });
          });
        });
      `);
    });

    it('test prefix with expression', () => {
      expect(
        transformCsf(
          dedent`
            export default { title: 'foo/bar' };
            export const A = () => {};
            A.tests = { baz: () => 'blah' };
      `,
          { testPrefix, clearBody: true }
        )
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {
              const haha = A;
              'blah';
            });
          });
        });
      `);
    });

    it('test prefix xN', () => {
      expect(
        transformCsf(
          dedent`
        export default { title: 'foo/bar', tests: { baz: () => {} } };
        export const A = () => {};
        export const B = () => {};
     `,
          { testPrefix, clearBody: true }
        )
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("baz", () => {
              const haha = A;
            });
          });
          describe("B", () => {
            it("baz", () => {
              const haha = B;
            });
          });
        });
      `);
    });

    it('insert test if empty', () => {
      expect(
        transformCsf(`export default { title: 'foo/bar' };`, {
          clearBody: true,
          insertTestIfEmpty: true,
        })
      ).toMatchInlineSnapshot(`describe.skip('foo/bar', () => { it('', () => {}) });`);
    });
  });

  describe('setup', () => {
    it('meta-level', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar', setup: () => {} };
          export const A = () => {};
          export const B = () => {};
       `)
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("setup", () => {});
          });
          describe("B", () => {
            it("setup", () => {});
          });
        });
      `);
    });

    it('story level', () => {
      expect(
        transform(dedent`
          export default { title: 'foo/bar' };
          export const A = () => {};
          A.setup = () => {};
      `)
      ).toMatchInlineSnapshot(`
        describe("foo/bar", () => {
          describe("A", () => {
            it("setup", () => {});
          });
        });
      `);
    });
  });
});

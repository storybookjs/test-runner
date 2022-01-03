import dedent from 'ts-dedent';
import { transformPlaywright } from './transformPlaywright';

expect.addSnapshotSerializer({
  print: (val: any) => val.trim(),
  test: (val: any) => true,
});

describe('Playwright', () => {
  it('basic', () => {
    expect(
      transformPlaywright(dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
        A.play = () => {};
      `)
    ).toMatchInlineSnapshot(`
      if (!require.main) {
        describe("foo/bar", () => {
        describe("A", () => {
          it("play", async () => {
            page.on('pageerror', err => {
              page.evaluate(({
                id,
                err
              }) => __throwError(id, err), {
                id: "foo-bar--a",
                err: err.message
              });
            });
            return page.evaluate(({
              id,
              hasPlayFn
            }) => __test(id, hasPlayFn), {
              id: "foo-bar--a",
              hasPlayFn: true
            });
          });
        });
      });
      }
    `);
  });
});

import dedent from 'ts-dedent';
import { transformPlaywright } from './transformPlaywright';

expect.addSnapshotSerializer({
  print: (val: any) => val.trim(),
  test: (val: any) => true,
});

describe('Playwright', () => {
  it('should generate a play test when the story has a play function', () => {
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
          it("play-test", async () => {
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
  it('should generate a smoke test when story does not have a play function', () => {
    expect(
      transformPlaywright(dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
      `)
    ).toMatchInlineSnapshot(`
      if (!require.main) {
        describe("foo/bar", () => {
        describe("A", () => {
          it("smoke-test", async () => {
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
              hasPlayFn: false
            });
          });
        });
      });
      }
    `);
  });
});

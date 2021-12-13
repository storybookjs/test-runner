import dedent from 'ts-dedent';
import { transformPlaywright } from './transformPlaywright';

expect.addSnapshotSerializer({
  print: (val: any) => val,
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
          it("play", async () => page.evaluate(id => __test(id), "foo-bar--a"));
        });
      });
      }
    `);
  });
});

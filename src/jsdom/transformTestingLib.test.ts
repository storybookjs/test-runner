import dedent from 'ts-dedent';
import { transformTestingLib } from './transformTestingLib';

// @ts-ignore
expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val: any) => true,
});

describe('transformTestingLib', () => {
  it('basic', () => {
    expect(
      transformTestingLib(dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
        A.tests = { baz: () => {} };
      `)
    ).toMatchInlineSnapshot(`
      import { render, screen } from "@testing-library/react";
      import { composeStory } from "@storybook/testing-react";
      export default { title: 'foo/bar' };
      export const A = () => {};
      A.tests = { baz: () => {} };

      if (!require.main) {
        describe("foo/bar", () => {
        describe("A", () => {
          it("play", async () => {
            const Composed = await composeStory(A, exports.default);
            const {
              container
            } = render(<Composed />);

            if (Composed.play) {
              await Composed.play({
                canvasElement: container
              });
            }
          });
        });
        describe("A", () => {
          it("baz", async () => {
            const Composed = await composeStory(A, exports.default);
            const {
              container
            } = render(<Composed />);

            if (Composed.play) {
              await Composed.play({
                canvasElement: container
              });
            }
          });
        });
      });
      }
    `);
  });
});

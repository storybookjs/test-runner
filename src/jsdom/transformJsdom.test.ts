import dedent from 'ts-dedent';
import { transformJsdom } from './transformJsdom';

// @ts-ignore
expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val: any) => true,
});

describe('transformJsdom', () => {
  it('basic', () => {
    expect(
      transformJsdom(dedent`
        export default { title: 'foo/bar' };
        export const A = () => {};
      `)
    ).toMatchInlineSnapshot(`
      import { render, screen } from "@testing-library/react";
      import { composeStory } from "@storybook/testing-react";
      export default { title: 'foo/bar' };
      export const A = () => {};

      if (!require.main) {
        describe("foo/bar", () => {
        describe("A", () => {
          it("smoke-test", async () => {
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

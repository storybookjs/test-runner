import template from '@babel/template';
import { transformCsf } from '../csf/transformCsf';

const filePrefixer = template(`
  import { render, screen } from "@testing-library/react";
  import { composeStory } from "@storybook/testing-react";
`);

const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%%, hasPlayFn: %%hasPlayFn%%});
    async () => {
      const Composed = await composeStory(%%storyExport%%, exports.default);
      const { container } = render(<Composed />);
      if(Composed.play) {
        await Composed.play({ canvasElement: container });
      }
    }
  `,
  {
    plugins: ['jsx'],
  }
);

export const transformTestingLib = (src: string) => {
  // const start = new Date();
  // @ts-ignore
  const result = transformCsf(src, { filePrefixer, testPrefixer, insertTestIfEmpty: true });
  // @ts-ignore
  // console.log('transform', new Date() - start);
  return result;
};

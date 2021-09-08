import * as t from '@babel/types';
import template, { PublicReplacements } from '@babel/template';
import { transformCsf } from '../csf/transformCsf';

const filePrefixer = template(`
  import { render, screen } from "@testing-library/react";
  import { composeStory } from "@storybook/testing-react";
`);

const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      const Composed = await composeStory(%%storyExport%%, exports.default);
      await render(<Composed />);  
    }
  `,
  {
    plugins: ['jsx'],
  }
);

export const transformTestingLib = (src: string) => {
  const start = new Date();
  // @ts-ignore
  const result = transformCsf(src, { filePrefixer, testPrefixer, insertTestIfEmpty: true });
  // @ts-ignore
  console.log('transform', new Date() - start);
  return result;
};

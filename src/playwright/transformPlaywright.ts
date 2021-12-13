import template from '@babel/template';
import { transformCsf } from '../csf/transformCsf';

const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => page.evaluate((id) => __test(id), %%id%%);
  `,
  {
    plugins: ['jsx'],
  }
);

export const transformPlaywright = (src: string) => {
  const result = transformCsf(src, {
    // @ts-ignore
    testPrefixer,
    insertTestIfEmpty: true,
    clearBody: true,
  });
  return result;
};

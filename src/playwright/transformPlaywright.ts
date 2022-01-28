import template from '@babel/template';
import { transformCsf } from '../csf/transformCsf';

export const testPrefixer = template(
  `
    console.log({ id: %%id%%, title: %%title%%, name: %%name%%, storyExport: %%storyExport%% });
    async () => {
      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), { id: %%id%%, err: err.message });
      });

      return page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
        id: %%id%%,
        hasPlayFn: %%hasPlayFn%%,
      });
    }
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

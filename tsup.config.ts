import { defineConfig, type Options } from 'tsup';
import { resolve } from 'path';

type Plugin = Required<Options>['esbuildPlugins'][0];

export default defineConfig([
  {
    clean: true,
    entry: ['./src/**/!(*.{d,test,content-script}).{js,jsx,ts,tsx}'],
    format: ['cjs', 'esm'],
    dts: true,
    esbuildOptions(options, context) {
      options.platform = 'node';
    },
    esbuildPlugins: [scriptToText()],
  },
]);

export function scriptToText(): Plugin {
  return {
    name: 'script-to-text',
    setup({ onResolve, onLoad, esbuild }) {
      onResolve({ filter: /^script-to-text:.+/ }, (args) => {
        const path = resolve(args.resolveDir, args.path.slice('script-to-text:'.length));
        return { path: `${path}?script-to-text`, namespace: 'script-to-text' };
      });
      onLoad({ filter: /.*/, namespace: 'script-to-text' }, async (args) => {
        const path = args.path.slice(0, -'?script-to-text'.length);
        const result = await esbuild.build({
          entryPoints: [path],
          bundle: true,
          write: false,
        });
        const contents = result.outputFiles[0].text;
        return { contents, loader: 'text' };
      });
    },
  };
}

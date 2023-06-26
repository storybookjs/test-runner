import { defineConfig } from 'tsup';
import tsPaths from 'esbuild-ts-paths';

export default defineConfig([
  {
    clean: true,
    entry: ['./src/**/!(*.{d,test}).{js,jsx,ts,tsx}', '!./src/templates/*.js'],
    format: ['cjs', 'esm'],
    splitting: false,
    dts: true,
    minify: false,
    treeshake: false,
    esbuildOptions(options, context) {
      options.platform = 'node';
    },
  },
]);

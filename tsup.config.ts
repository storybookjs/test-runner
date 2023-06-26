import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    entry: ['./src/**/!(*.{d,test}).{js,jsx,ts,tsx}', '!./src/templates/*.js'],
    format: ['cjs', 'esm'],
    splitting: false,
    dts: true,
    minify: false,
    treeshake: false,
    bundle: false,
    esbuildOptions(options, context) {
      options.platform = 'node';
    },
  },
]);

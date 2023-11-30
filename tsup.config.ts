import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    entry: [
      './src/**/*.{js,jsx,ts,tsx,cjs,mjs,mts}',
      '!./src/**/*.d.{js,jsx,ts,tsx}',
      '!./src/**/*test.{js,jsx,ts,tsx}',
    ],
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

import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/test-storybook.ts'],
    format: ['cjs'],
    splitting: false,
    dts: true,
    minify: false,
    treeshake: true,
    bundle: true,
    platform: 'node',
    external: ['@storybook/test-runner'],
    esbuildOptions(options) {
      options.platform = 'node';
    },
  },
  {
    entry: ['./src/setup-page-script.ts'],
    format: ['esm'],
    dts: false,
    bundle: false,
    minify: false,
    treeshake: false,
    platform: 'browser',
  },
]);

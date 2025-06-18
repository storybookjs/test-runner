import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/test-storybook.ts'],
    format: ['cjs', 'esm'],
    splitting: false,
    dts: true,
    minify: false,
    treeshake: false,
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
    treeshake: false,
    platform: 'browser',
  },
]);

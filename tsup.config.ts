import { defineConfig } from 'tsup';

export default defineConfig([
  {
    clean: true,
    entry: [
      './src/index.ts',
      './src/test-storybook.ts',
      './src/config/global.setup.ts',
      './src/playwright/csf-playwright-plugin.ts',
      './src/playwright/StoryPage.ts',
    ],
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

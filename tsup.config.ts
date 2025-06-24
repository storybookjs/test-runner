import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const corePkgJson = JSON.parse(readFileSync('./node_modules/storybook/package.json', 'utf8'));

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/test-storybook.ts'],
    format: ['cjs'],
    splitting: false,
    noExternal: [
      'storybook',
      'storybook/internal/common',
      'storybook/internal/csf-tools',
      'storybook/internal/csf',
      'storybook/internal/node-logger',
      'storybook/internal/preview-api',
      'storybook/internal/telemetry',
      'storybook/internal/types',
    ],
    dts: true,
    minify: false,
    treeshake: true,
    bundle: true,
    platform: 'node',
    external: [
      '@storybook/test-runner',
      ...Object.keys(corePkgJson.dependencies),
      // explicitly exclude the `storybook` package, we want it bundled in, as it's ESM-only
      // ...Object.keys(corePkgJson.peerDependencies),
    ],
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

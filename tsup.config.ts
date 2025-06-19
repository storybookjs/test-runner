import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

const corePkgJson = JSON.parse(readFileSync('./node_modules/storybook/package.json', 'utf8'));

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/test-storybook.ts'],
    format: ['cjs', 'esm'],
    splitting: false,
    noExternal: ['storybook/internal/common'],
    dts: true,
    minify: false,
    treeshake: true,
    bundle: true,
    platform: 'node',
    external: [
      '@storybook/test-runner',
      ...Object.keys(corePkgJson.dependencies),
      ...Object.keys(corePkgJson.peerDependencies),
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
    treeshake: false,
    platform: 'browser',
  },
]);

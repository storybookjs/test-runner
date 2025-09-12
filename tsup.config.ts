import { resolve } from 'node:path';
import { defineConfig } from 'tsup';

const packageMap = {
  'storybook/internal/babel': 'node_modules/storybook-src/code/core/src/babel/index.ts',
  'storybook/internal/common': 'node_modules/storybook-src/code/core/src/common/index.ts',
  'storybook/internal/csf-tools': 'node_modules/storybook-src/code/core/src/csf-tools/index.ts',
  'storybook/internal/csf': 'node_modules/storybook-src/code/core/src/csf/index.ts',
  'storybook/internal/node-logger': 'node_modules/storybook-src/code/core/src/node-logger/index.ts',
  'storybook/internal/preview-api': 'node_modules/storybook-src/code/core/src/preview-api/index.ts',
  'storybook/internal/telemetry': 'node_modules/storybook-src/code/core/src/telemetry/index.ts',
  'storybook/internal/types': 'node_modules/storybook-src/code/core/src/types/index.ts',
  'storybook/internal/server-errors': 'node_modules/storybook-src/code/core/src/server-errors.ts',
  'storybook/internal/preview-errors': 'node_modules/storybook-src/code/core/src/preview-errors.ts',
};

export default defineConfig([
  {
    // entry: ['./src/core.ts'],
    entry: ['./src/index.ts', './src/test-storybook.ts'],
    format: ['cjs'],
    splitting: true,
    dts: true,
    minify: false,
    treeshake: true,
    bundle: true,
    platform: 'node',
    noExternal: ['storybook-src', 'storybook'],
    external: ['@storybook/test-runner', 'prettier'],
    esbuildPlugins: [
      {
        name: 'alias',
        setup(build) {
          build.onResolve({ filter: /\/storybook\// }, (args) => {
            const p = resolve(packageMap[args.path] ?? args.path);
            console.log({ p, f: args.importer });
            return {
              path: p,
            };
          });
        },
      },
    ],
    esbuildOptions(options) {
      options.platform = 'node';
    },
  },
  {
    entry: ['./src/setup-page-script.ts'],
    format: ['esm'],
    dts: true,
    bundle: false,
    minify: false,
    treeshake: false,
    platform: 'browser',
  },
]);

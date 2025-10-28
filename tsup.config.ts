import { dedent } from 'ts-dedent';
import { defineConfig } from 'tsup';
import { builtinModules } from 'node:module';

export default defineConfig([
  {
    clean: true,
    entry: [
      './src/index.ts',
      './src/test-storybook.ts',
      './src/jest-playwright-entries/extends.ts',
      './src/jest-playwright-entries/setup.ts',
      './src/jest-playwright-entries/teardown.ts',
      './src/jest-playwright-entries/test-environment.ts',
      './src/jest-playwright-entries/runner.ts',
    ],
    format: ['esm'],
    splitting: false,
    dts: true,
    minify: false,
    treeshake: false,
    bundle: true,
    platform: 'neutral',
    external: [
      '@storybook/test-runner',
      ...[...builtinModules, 'module'].flatMap((m) => [m, `node:${m}`]),
    ],
    outExtension: ({ format }) => ({
      js: `.${format === 'esm' ? 'js' : 'cjs'}`,
    }),
    esbuildOptions(options) {
      options.platform = 'neutral';
    },
    banner: {
      js: dedent`
      import ESM_COMPAT_Module from "node:module";
      import { fileURLToPath as ESM_COMPAT_fileURLToPath } from 'node:url';
      const __filename = ESM_COMPAT_fileURLToPath(import.meta.url);
      const require = ESM_COMPAT_Module.createRequire(import.meta.url);
    `,
    },
  },
  {
    entry: ['./src/setup-page-script.ts'],
    format: ['esm'],
    dts: false,
    bundle: false,
    treeshake: false,
    platform: 'browser',
    outExtension: ({ format }) => ({
      js: `.${format === 'esm' ? 'js' : 'cjs'}`,
    }),
  },
]);

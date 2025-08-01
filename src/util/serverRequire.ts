let registered = false;

export function serverRequire(path: string) {
  const hasEsbuildBeenRegistered = !!require('module')._extensions['.ts'];

  if (registered === false && !hasEsbuildBeenRegistered) {
    const { register } = require('esbuild-register/dist/node');
    registered = true;
    register({
      target: `node${process.version.slice(1)}`,
      format: 'cjs',
      hookIgnoreNodeModules: true,
      // Some frameworks, like Stylus, rely on the 'name' property of classes or functions
      // https://github.com/storybookjs/storybook/issues/19049
      keepNames: true,
      tsconfigRaw: `{
        "compilerOptions": {
          "strict": false,
          "skipLibCheck": true,
        },
      }`,
    });
  }

  const located = serverResolve(path);
  if (!located) {
    throw new Error(`Could not find ${path}`);
  }

  const result = require(located);

  const isES6DefaultExported =
    typeof result === 'object' && result !== null && typeof result.default !== 'undefined';

  return isES6DefaultExported ? result.default : result;
}

function getCandidate(paths: string[]) {
  for (let i = 0; i < paths.length; i += 1) {
    const candidate = getInterpretedFileWithExt(paths[i]);

    if (candidate) {
      return candidate;
    }
  }

  return undefined;
}

export function serverResolve(filePath: string | string[]): string | null {
  const paths = Array.isArray(filePath) ? filePath : [filePath];
  const existingCandidate = getCandidate(paths);

  if (!existingCandidate) {
    return null;
  }

  return existingCandidate.path;
}

import { existsSync } from 'node:fs';

export const boost = new Set(['.js', '.jsx', '.ts', '.tsx', '.cts', '.mts', '.cjs', '.mjs']);

function sortExtensions() {
  return [...Array.from(boost)];
}

const possibleExtensions = sortExtensions();

export function getInterpretedFile(pathToFile: string) {
  return possibleExtensions
    .map((ext) => (pathToFile.endsWith(ext) ? pathToFile : `${pathToFile}${ext}`))
    .find((candidate) => existsSync(candidate));
}

export function getInterpretedFileWithExt(pathToFile: string) {
  return possibleExtensions
    .map((ext) => ({ path: pathToFile.endsWith(ext) ? pathToFile : `${pathToFile}${ext}`, ext }))
    .find((candidate) => existsSync(candidate.path));
}

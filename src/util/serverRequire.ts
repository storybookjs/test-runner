import { serverResolve } from 'storybook/internal/common';
const { register } = require('esbuild-register/dist/node');

register();

export function serverRequire(path: string) {
  const located = serverResolve(path);
  if (!located) {
    throw new Error(`Could not find ${path}`);
  }

  const result = require(located);

  if (result.default) {
    return result.default;
  }

  return result;
}

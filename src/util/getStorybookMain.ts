import { join, resolve } from 'path';
import { serverRequire } from '@storybook/core-common';
import type { StorybookConfig } from '@storybook/core-common';

let storybookMainConfig: StorybookConfig;

export const getStorybookMain = (configDir: string) => {
  if (storybookMainConfig) {
    return storybookMainConfig;
  }

  storybookMainConfig = serverRequire(join(resolve(configDir), 'main'));
  if (!storybookMainConfig) {
    throw new Error(
      `Could not load main.js in ${configDir}. Is the config directory correct? You can change it by using --config-dir <path-to-dir>`
    );
  }

  return storybookMainConfig;
};

import { join, resolve } from 'path';
import { serverRequire } from '@storybook/core-common';
import type { StorybookConfig } from '@storybook/types';
import dedent from 'ts-dedent';

let storybookMainConfig = new Map<string, StorybookConfig>();

export const getStorybookMain = (configDir: string) => {
  if (storybookMainConfig.has(configDir)) {
    return storybookMainConfig.get(configDir);
  } else {
    storybookMainConfig.set(configDir, serverRequire(join(resolve(configDir), 'main')));
  }

  const mainConfig = storybookMainConfig.get(configDir);

  if (!mainConfig) {
    throw new Error(
      `Could not load main.js in ${configDir}. Is the config directory correct? You can change it by using --config-dir <path-to-dir>`
    );
  }

  if (!mainConfig.stories || mainConfig.stories.length === 0) {
    throw new Error(
      dedent`
        Could not find stories in main.js in ${configDir}. 
        If you are using a mono-repository, please run the test-runner only against your sub-package, which contains a .storybook folder with "stories" defined in main.js.
        You can change the config directory by using --config-dir <path-to-dir>
        `
    );
  }

  return mainConfig;
};

export function resetStorybookMainCache() {
  storybookMainConfig.clear();
}

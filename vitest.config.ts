import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    alias: {
      '@storybook/test-runner/playwright/global-setup': '/playwright/global-setup.js',
      '@storybook/test-runner/playwright/global-teardown': '/playwright/global-teardown.js',
      '@storybook/test-runner/playwright/custom-environment': '/playwright/custom-environment.js',
      '@storybook/test-runner/playwright/jest-setup': '/playwright/jest-setup.js',
      '@storybook/test-runner/playwright/transform': '/playwright/transform.js',
    },
  },
});

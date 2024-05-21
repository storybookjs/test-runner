import path from 'path';
import {
  defineConfig as playwrightDefineConfig,
  devices,
  PlaywrightTestConfig,
} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const defineConfig = (config: PlaywrightTestConfig) => {
  const { STORYBOOK_STORIES_PATTERN } = process.env;

  // @ts-ignore use _contextReuseMode
  return playwrightDefineConfig({
    testDir: process.env.TEST_ROOT || process.cwd(),
    testMatch: STORYBOOK_STORIES_PATTERN?.split(';'),
    globalSetup: path.join(__dirname, 'config', 'global.setup.js'),
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'list',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
      /* Base URL to use in actions like `await page.goto('/')`. */
      // baseURL: 'http://127.0.0.1:3000',

      /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
      trace: 'on-first-retry',
      // @ts-ignore use _contextReuseMode
      _contextReuseMode: 'when-possible',
    },

    /* Configure projects for major browsers */
    projects: [
      // {
      //   name: 'setup',
      //   testMatch: /global.setup\.ts/,
      // },
      {
        // dependencies: ['setup'],
        name: 'chromium',
        use: { ...devices['Desktop Chrome'], headless: true },
      },
    ],

    build: {
      babelPlugins: [[path.join(__dirname, 'playwright', 'csf-playwright-plugin.js')]],
      // @ts-ignore
      external: [/test-runner\/.*.js$/],
    },

    /* Run your local dev server before starting the tests */
    webServer: {
      command: 'yarn storybook',
      cwd: process.cwd(),
      url: 'http://127.0.0.1:6006',
      reuseExistingServer: true, //!process.env.CI,
    },
    ...config,
  });
};

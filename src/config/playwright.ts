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
export const defineConfig = (config: PlaywrightTestConfig) =>
  playwrightDefineConfig({
    testDir: process.env.TEST_ROOT || './stories/',
    testMatch: /Button.stories.(js|jsx|ts|tsx|mjs|mts)$/,
    globalSetup: path.join(__dirname, 'global.setup.js'),
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
      // @ts-expect-error use _contextReuseMode
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
      // @ts-ignore
      babelPlugins: [[path.join(__dirname, '..', 'playwright', 'csf-playwright-plugin.js')]],
      // @ts-ignore
      external: [/test-runner\/.*.js$/],
    },

    /* Run your local dev server before starting the tests */
    webServer: {
      command: 'yarn storybook',
      url: 'http://127.0.0.1:6006',
      reuseExistingServer: true, //!process.env.CI,
    },
    ...config,
  });

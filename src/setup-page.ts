import type { Page, BrowserContext } from 'playwright';
import readPackageUp, { NormalizedReadResult } from 'read-pkg-up';
import { PrepareContext } from './playwright/hooks';
import { getTestRunnerConfig } from './util/getTestRunnerConfig';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * This is a default prepare function which can be overridden by the user.
 *
 * In order to test stories, we need to prepare the environment first.
 * This is done by accessing the /iframe.html page of the Storybook instance. The test-runner then injects a script which prepares the environment for testing, then visits the stories.
 */
const defaultPrepare = async ({ page, browserContext, testRunnerConfig }: PrepareContext) => {
  const targetURL = process.env.TARGET_URL;
  const iframeURL = new URL('iframe.html', targetURL).toString();

  if (testRunnerConfig?.getHttpHeaders) {
    const headers = await testRunnerConfig.getHttpHeaders(iframeURL);
    await browserContext.setExtraHTTPHeaders(headers);
  }

  await page.goto(iframeURL, { waitUntil: 'load' }).catch((err) => {
    if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
      const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?\n\n${err.message}`;
      throw new Error(errorMessage);
    }

    throw err;
  });
};

export const setupPage = async (page: Page, browserContext: BrowserContext) => {
  const targetURL = process.env.TARGET_URL;
  const failOnConsole = process.env.TEST_CHECK_CONSOLE;

  const viewMode = process.env.VIEW_MODE ?? 'story';
  const renderedEvent = viewMode === 'docs' ? 'docsRendered' : 'storyRendered';
  const { packageJson } = (await readPackageUp()) as NormalizedReadResult;
  const { version: testRunnerVersion } = packageJson;

  const referenceURL = process.env.REFERENCE_URL;
  const debugPrintLimit = process.env.DEBUG_PRINT_LIMIT
    ? Number(process.env.DEBUG_PRINT_LIMIT)
    : 1000;

  if ('TARGET_URL' in process.env && !process.env.TARGET_URL) {
    console.warn(
      `Received TARGET_URL but with a falsy value: ${process.env.TARGET_URL}. Please fix it.`
    );
  }

  const testRunnerConfig = getTestRunnerConfig() || {};
  if (testRunnerConfig?.prepare) {
    await testRunnerConfig.prepare({ page, browserContext, testRunnerConfig });
  } else {
    await defaultPrepare({ page, browserContext, testRunnerConfig });
  }

  // if we ever want to log something from the browser to node
  await page.exposeBinding('logToPage', (_, message) => console.log(message));

  const finalStorybookUrl = referenceURL ?? targetURL ?? '';
  const scriptLocation = require.resolve(path.join(__dirname, 'setup-page-script.mjs'));

  // read the content of setup-page-script.mjs and replace the placeholders with the actual values
  const content = (await readFile(scriptLocation, 'utf-8'))
    .replaceAll('{{storybookUrl}}', finalStorybookUrl)
    .replaceAll('{{failOnConsole}}', failOnConsole ?? 'false')
    .replaceAll('{{renderedEvent}}', renderedEvent)
    .replaceAll('{{testRunnerVersion}}', testRunnerVersion)
    .replaceAll('{{logLevel}}', testRunnerConfig.logLevel ?? 'info')
    .replaceAll('{{debugPrintLimit}}', debugPrintLimit.toString());

  await page.addScriptTag({ content });
};

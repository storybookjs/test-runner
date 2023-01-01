import type { Page } from 'playwright';
import readPackageUp from 'read-pkg-up';
import contentScript from 'script-to-text:./page.content-script.ts';

const sanitizeURL = (url: string) => {
  let finalURL = url;
  // prepend URL protocol if not there
  if (finalURL.indexOf('http://') === -1 && finalURL.indexOf('https://') === -1) {
    finalURL = 'http://' + finalURL;
  }

  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, '');

  // remove index.html if present
  finalURL = finalURL.replace(/index.html\s*$/, '');

  // add forward slash at the end if not there
  if (finalURL.slice(-1) !== '/') {
    finalURL = finalURL + '/';
  }

  return finalURL;
};

export const setupPage = async (page: Page) => {
  const targetURL = process.env.TARGET_URL;

  const viewMode = process.env.VIEW_MODE || 'story';
  const __CONTENT_SCRIPT_viewMode = viewMode;
  const __CONTENT_SCRIPT_renderedEvent = viewMode === 'docs' ? 'docsRendered' : 'storyRendered';
  const { packageJson } = await readPackageUp();
  const { version: __CONTENT_SCRIPT_testRunnerVersion } = packageJson;

  const __CONTENT_SCRIPT_referenceURL =
    process.env.REFERENCE_URL && sanitizeURL(process.env.REFERENCE_URL);
  const __CONTENT_SCRIPT_debugPrintLimit = process.env.DEBUG_PRINT_LIMIT
    ? Number(process.env.DEBUG_PRINT_LIMIT)
    : 1000;

  if ('TARGET_URL' in process.env && !process.env.TARGET_URL) {
    console.log(
      `Received TARGET_URL but with a falsy value: ${process.env.TARGET_URL}, will fallback to ${targetURL} instead.`
    );
  }

  const iframeURL = new URL('iframe.html', process.env.TARGET_URL).toString();
  await page.goto(iframeURL, { waitUntil: 'load' }).catch((err) => {
    if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
      const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?\n\n${err.message}`;
      throw new Error(errorMessage);
    }

    throw err;
  });

  // if we ever want to log something from the browser to node
  await page.exposeBinding('logToPage', (_, message) => console.log(message));

  await page.addScriptTag({
    content: `
const __CONTENT_SCRIPT_viewMode = ${JSON.stringify(__CONTENT_SCRIPT_viewMode)};
const __CONTENT_SCRIPT_renderedEvent = ${JSON.stringify(__CONTENT_SCRIPT_renderedEvent)};
const __CONTENT_SCRIPT_testRunnerVersion = ${JSON.stringify(__CONTENT_SCRIPT_testRunnerVersion)};
const __CONTENT_SCRIPT_referenceURL = ${JSON.stringify(__CONTENT_SCRIPT_referenceURL)};
const __CONTENT_SCRIPT_debugPrintLimit = ${JSON.stringify(__CONTENT_SCRIPT_debugPrintLimit)};
const __CONTENT_SCRIPT_targetURL = ${JSON.stringify(null)};
${contentScript}`,
  });
};

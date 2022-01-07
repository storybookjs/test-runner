import { test, chromium } from '@playwright/test';
let page;

const sanitizeURL = (url) => {
  let finalURL = url;
  // prepend URL protocol if not there
  if (finalURL.indexOf('http://') === -1 && finalURL.indexOf('https://') === -1) {
    finalURL = 'http://' + finalURL;
  }

  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, '');

  // add forward slash at the end if not there
  if (finalURL.slice(-1) !== '/') {
    finalURL = finalURL + '/';
  }

  return finalURL;
};

test.beforeAll(async () => {
  const targetURL = sanitizeURL(process.env.TARGET_URL || 'http://localhost:6006');
  const browser = await chromium.launch();
  page = await browser.newPage();

  await page.goto(`${targetURL}iframe.html`, { waitUntil: 'load' }).catch((err) => {
    if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
      const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?\n\n${err.message}`;
      throw new Error(errorMessage);
    }

    throw err;
  }); // FIXME: configure

  await page.exposeBinding('logToPage', (_, message) => console.log(message));

  await page.addScriptTag({
    content: `
      class StorybookTestRunnerError extends Error {
        constructor(storyId, hasPlayFn, errorMessage) {
          super(errorMessage);
          this.name = 'StorybookTestRunnerError';
          const storyUrl = \`${targetURL}?path=/story/\${storyId}\`;
          const finalStoryUrl = storyUrl + (hasPlayFn ? '&addonPanel=storybook/interactions/panel' : '');

          this.message = \`\nAn error occurred in the following story:\n\${finalStoryUrl}\n\nMessage:\n \${errorMessage}\`;
        }
      }

      async function __throwError(storyId, errorMessage) {
        throw new StorybookTestRunnerError(storyId, errorMessage);
      }

      async function __waitForElement(selector) {
        return new Promise((resolve, reject) => {

          const timeout = setTimeout(() => {
            reject();
          }, 10000);

          if (document.querySelector(selector)) {
            clearTimeout(timeout);
            return resolve(document.querySelector(selector));
          }

          const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
              clearTimeout(timeout);
              resolve(document.querySelector(selector));
              observer.disconnect();
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      }

      async function __test(storyId, hasPlayFn) {
        try {
          await __waitForElement('#root');
        } catch(err) {
          const message = \`Timed out waiting for Storybook to load after 10 seconds. Are you sure the Storybook is running correctly in that URL?\n\n\nHTML: \${document.body.innerHTML}\`;
          throw new StorybookTestRunnerError(storyId, hasPlayFn, message);
        }

        const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
        if(!channel) {
          throw new StorybookTestRunnerError(
            storyId,
            hasPlayFn,
            'The test runner could not access the Storybook channel. Are you sure the Storybook is running correctly in that URL?'
          );
        }

        return new Promise((resolve, reject) => {
          channel.on('storyRendered', () => resolve(document.getElementById('root')));
          channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
          channel.on('storyErrored', ({ description }) => reject(
            new StorybookTestRunnerError(storyId, hasPlayFn, description))
          );
          channel.on('storyThrewException', (error) => reject(
            new StorybookTestRunnerError(storyId, hasPlayFn, error.message))
          );
          channel.on('storyMissing', (id) => id === storyId && reject(
            new StorybookTestRunnerError(storyId, hasPlayFn, 'The story was missing when trying to access it.'))
          );

          channel.emit('setCurrentStory', { storyId });
        });
      };
    `,
  });
});

test.describe('Example/Button', () => {
  test.describe('Primary', () => {
    test('smoke-test', async () => {
      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), {
          id: 'example-button--primary',
          err: err.message,
        });
      });
      return page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
        id: 'example-button--primary',
        hasPlayFn: false,
      });
    });
  });
  test.describe('Secondary', () => {
    test('smoke-test', async () => {
      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), {
          id: 'example-button--secondary',
          err: err.message,
        });
      });
      return page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
        id: 'example-button--secondary',
        hasPlayFn: false,
      });
    });
  });
  test.describe('Large', () => {
    test('smoke-test', async () => {
      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), {
          id: 'example-button--large',
          err: err.message,
        });
      });
      return page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
        id: 'example-button--large',
        hasPlayFn: false,
      });
    });
  });
  test.describe('Small', () => {
    test('smoke-test', async () => {
      page.on('pageerror', (err) => {
        page.evaluate(({ id, err }) => __throwError(id, err), {
          id: 'example-button--small',
          err: err.message,
        });
      });
      return page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), {
        id: 'example-button--small',
        hasPlayFn: false,
      });
    });
  });
});

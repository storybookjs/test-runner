import type { Page } from 'playwright';
import dedent from 'ts-dedent';

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
  const targetURL = new URL('iframe.html', process.env.TARGET_URL).toString();
  const viewMode = process.env.VIEW_MODE || 'story';
  const isCoverageMode = process.env.STORYBOOK_COLLECT_COVERAGE === 'true';
  const renderedEvent = viewMode === 'docs' ? 'docsRendered' : 'storyRendered';

  const referenceURL = process.env.REFERENCE_URL && sanitizeURL(process.env.REFERENCE_URL);
  const debugPrintLimit = process.env.DEBUG_PRINT_LIMIT
    ? Number(process.env.DEBUG_PRINT_LIMIT)
    : 1000;

  if ('TARGET_URL' in process.env && !process.env.TARGET_URL) {
    console.log(
      `Received TARGET_URL but with a falsy value: ${process.env.TARGET_URL}, will fallback to ${targetURL} instead.`
    );
  }

  await page.goto(targetURL, { waitUntil: 'load' }).catch((err) => {
    if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
      const errorMessage = `Could not access the Storybook instance at ${targetURL}. Are you sure it's running?\n\n${err.message}`;
      throw new Error(errorMessage);
    }

    throw err;
  });

  if (isCoverageMode) {
    const isCoverageSetupCorrectly = await page.evaluate(() => '__coverage__' in window);
    if (!isCoverageSetupCorrectly) {
      throw new Error(
        dedent`
          [Test runner] An error occurred when evaluating code coverage:
          The code in Storybook is not instrumented, which means the coverage setup is not correct.
          More info: https://github.com/storybookjs/test-runner#setting-up-code-coverage
        `
      );
    }
  }

  // if we ever want to log something from the browser to node
  await page.exposeBinding('logToPage', (_, message) => console.log(message));

  await page.addScriptTag({
    content: `
      // colorizes the console output
      const bold = (message) => \`\\u001b[1m\${message}\\u001b[22m\`;
      const magenta = (message) => \`\\u001b[35m\${message}\\u001b[39m\`;
      const blue = (message) => \`\\u001b[34m\${message}\\u001b[39m\`;
      const red = (message) => \`\\u001b[31m\${message}\\u001b[39m\`;
      const yellow = (message) => \`\\u001b[33m\${message}\\u001b[39m\`;
      
      // removes circular references from the object
      function serializer(replacer, cycleReplacer) {
        let stack = [],
          keys = [];

        if (cycleReplacer == null)
          cycleReplacer = function (_key, value) {
            if (stack[0] === value) return '[Circular]';
            return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']';
          };

        return function (key, value) {
          if (stack.length > 0) {
            let thisPos = stack.indexOf(this);
            ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
            ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
            if (~stack.indexOf(value)) value = cycleReplacer.call(this, key, value);
          } else {
            stack.push(value);
          }

          return replacer == null ? value : replacer.call(this, key, value);
        };
      }

      function safeStringify(obj, replacer, spaces, cycleReplacer) {
        return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
      }

      function composeMessage(args) {
        if (typeof args === 'undefined') return "undefined";
        if (typeof args === 'string') return args;
        return safeStringify(args);
      }

      function truncate(input, limit) {
        if (input.length > limit) {
          return input.substring(0, limit) + '…';
        }
        return input;
      }
      
      class StorybookTestRunnerError extends Error {
        constructor(storyId, errorMessage, logs) {
          super(errorMessage);
          this.name = 'StorybookTestRunnerError';
          const storyUrl = \`${referenceURL || targetURL}?path=/story/\${storyId}\`;
          const finalStoryUrl = \`\${storyUrl}&addonPanel=storybook/interactions/panel\`;
          const separator = '\\n\\n--------------------------------------------------';
          const extraLogs = logs.length > 0 ? separator + "\\n\\nBrowser logs:\\n\\n"+ logs.join('\\n\\n') : '';

          this.message = \`\nAn error occurred in the following story. Access the link for full output:\n\${finalStoryUrl}\n\nMessage:\n \${truncate(errorMessage,${debugPrintLimit})}\n\${extraLogs}\`;
        }
      }

      async function __throwError(storyId, errorMessage, logs) {
        throw new StorybookTestRunnerError(storyId, errorMessage, logs);
      }

      async function __waitForStorybook() {
        return new Promise((resolve, reject) => {

          const timeout = setTimeout(() => {
            reject();
          }, 10000);

          if (document.querySelector('#root') || document.querySelector('#storybook-root')) {
            clearTimeout(timeout);
            return resolve();
          }

          const observer = new MutationObserver(mutations => {
            if (document.querySelector('#root') || document.querySelector('#storybook-root')) {
              clearTimeout(timeout);
              resolve();
              observer.disconnect();
            }
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true
          });
        });
      }

      async function __getContext(storyId) {
        return globalThis.__STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId });
      }

      async function __test(storyId) {
        try {
          await __waitForStorybook();
        } catch(err) {
          const message = \`Timed out waiting for Storybook to load after 10 seconds. Are you sure the Storybook is running correctly in that URL? Is the Storybook private (e.g. under authentication layers)?\n\n\nHTML: \${document.body.innerHTML}\`;
          throw new StorybookTestRunnerError(storyId, message);
        }

        const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
        if(!channel) {
          throw new StorybookTestRunnerError(
            storyId,
            'The test runner could not access the Storybook channel. Are you sure the Storybook is running correctly in that URL?'
          );
        }
        
        // collect logs to show upon test error
        let logs = [];

        const spyOnConsole = (method, name) => {
          const originalFn = console[method];
          return function () {
            const message = [...arguments].map(composeMessage).join(', ');
            const prefix = \`\${bold(name)}: \`;
            logs.push(prefix + message);
            originalFn.apply(console, arguments);
          };
        };

        // console methods + color function for their prefix
        const spiedMethods = {
          log: blue,
          warn: yellow,
          error: red,
          trace: magenta,
          group: magenta,
          groupCollapsed: magenta,
        }
        
        Object.entries(spiedMethods).forEach(([method, color]) => {
          console[method] = spyOnConsole(method, color(method))
        })

        return new Promise((resolve, reject) => {
          channel.on('${renderedEvent}', () => resolve(document.getElementById('root')));
          channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
          channel.on('storyErrored', ({ description }) => reject(
            new StorybookTestRunnerError(storyId, description, logs))
          );
          channel.on('storyThrewException', (error) => reject(
            new StorybookTestRunnerError(storyId, error.message, logs))
          );
          channel.on('storyMissing', (id) => id === storyId && reject(
            new StorybookTestRunnerError(storyId, 'The story was missing when trying to access it.', logs))
          );

          channel.emit('setCurrentStory', { storyId, viewMode: '${viewMode}' });
        });
      };
    `,
  });
};

//@ts-nocheck
const sanitizeURL = (url) => {
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

export const setupPage = async (page) => {
  const targetURL = new URL('iframe.html', process.env.TARGET_URL).toString();
  const viewMode = process.env.VIEW_MODE || 'story';
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
  }); // FIXME: configure

  // if we ever want to log something from the browser to node
  await page.exposeBinding('logToPage', (_, message) => console.log(message));

  await page.addScriptTag({
    content: `
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
          const extraLogs = logs.length > 0 ? separator + "\\n\\nBrowser logs:\\n\\n"+ logs.join('\\n') : '';

          this.message = \`\nAn error occurred in the following story. Access the link for full output:\n\${finalStoryUrl}\n\nMessage:\n \${truncate(errorMessage,${debugPrintLimit})}\n\${extraLogs}\`;
        }
      }

      async function __throwError(storyId, errorMessage, logs) {
        throw new StorybookTestRunnerError(storyId, errorMessage, logs);
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

      async function __getContext(storyId) {
        return globalThis.__STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId });
      }

      async function __test(storyId) {
        try {
          await __waitForElement('#root');
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

        let logs = [];

        const spyOnConsole = (originalFn) => {
          return function() {
            const [txt, ...args] = arguments;
            logs.push(originalFn.name + ": " + txt + (args.length > 0 ? " " + JSON.stringify(args) : ""));
            originalFn.apply(console, arguments);
          }
        }
        console.log = spyOnConsole(console.log);
        console.warn = spyOnConsole(console.warn);
        console.error = spyOnConsole(console.error);

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

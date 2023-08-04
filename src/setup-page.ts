import type { Page, BrowserContext } from 'playwright';
import readPackageUp from 'read-pkg-up';
import { PrepareContext } from './playwright/hooks';
import { getTestRunnerConfig } from './util';

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

export const setupPage = async (page: Page, browserContext: BrowserContext) => {
  const targetURL = process.env.TARGET_URL;
  const failOnConsole = process.env.TEST_CHECK_CONSOLE;

  const viewMode = process.env.VIEW_MODE || 'story';
  const renderedEvent = viewMode === 'docs' ? 'docsRendered' : 'storyRendered';
  const { packageJson } = await readPackageUp();
  const { version: testRunnerVersion } = packageJson;

  const referenceURL = process.env.REFERENCE_URL && sanitizeURL(process.env.REFERENCE_URL);
  const debugPrintLimit = process.env.DEBUG_PRINT_LIMIT
    ? Number(process.env.DEBUG_PRINT_LIMIT)
    : 1000;

  if ('TARGET_URL' in process.env && !process.env.TARGET_URL) {
    console.warn(
      `Received TARGET_URL but with a falsy value: ${process.env.TARGET_URL}. Please fix it.`
    );
  }

  const testRunnerConfig = getTestRunnerConfig();
  if (testRunnerConfig?.prepare) {
    await testRunnerConfig.prepare({ page, browserContext, testRunnerConfig });
  } else {
    await defaultPrepare({ page, browserContext, testRunnerConfig });
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
      
      // Code taken and adjusted from https://github.com/davidmarkclements/fast-safe-stringify
      var LIMIT_REPLACE_NODE = '[...]'
      var CIRCULAR_REPLACE_NODE = '[Circular]'

      var arr = []
      var replacerStack = []

      function defaultOptions () {
        return {
          depthLimit: Number.MAX_SAFE_INTEGER,
          edgesLimit: Number.MAX_SAFE_INTEGER
        }
      }

      // Regular stringify
      function stringify (obj, replacer, spacer, options) {
        if (typeof options === 'undefined') {
          options = defaultOptions()
        }

        decirc(obj, '', 0, [], undefined, 0, options)
        var res
        try {
          if (replacerStack.length === 0) {
            res = JSON.stringify(obj, replacer, spacer)
          } else {
            res = JSON.stringify(obj, replaceGetterValues(replacer), spacer)
          }
        } catch (_) {
          return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]')
        } finally {
          while (arr.length !== 0) {
            var part = arr.pop()
            if (part.length === 4) {
              Object.defineProperty(part[0], part[1], part[3])
            } else {
              part[0][part[1]] = part[2]
            }
          }
        }
        return res
      }

      function setReplace (replace, val, k, parent) {
        var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k)
        if (propertyDescriptor.get !== undefined) {
          if (propertyDescriptor.configurable) {
            Object.defineProperty(parent, k, { value: replace })
            arr.push([parent, k, val, propertyDescriptor])
          } else {
            replacerStack.push([val, k, replace])
          }
        } else {
          parent[k] = replace
          arr.push([parent, k, val])
        }
      }

      function decirc (val, k, edgeIndex, stack, parent, depth, options) {
        depth += 1
        var i
        if (typeof val === 'object' && val !== null) {
          for (i = 0; i < stack.length; i++) {
            if (stack[i] === val) {
              setReplace(CIRCULAR_REPLACE_NODE, val, k, parent)
              return
            }
          }

          if (
            typeof options.depthLimit !== 'undefined' &&
            depth > options.depthLimit
          ) {
            setReplace(LIMIT_REPLACE_NODE, val, k, parent)
            return
          }

          if (
            typeof options.edgesLimit !== 'undefined' &&
            edgeIndex + 1 > options.edgesLimit
          ) {
            setReplace(LIMIT_REPLACE_NODE, val, k, parent)
            return
          }

          stack.push(val)
          // Optimize for Arrays. Big arrays could kill the performance otherwise!
          if (Array.isArray(val)) {
            for (i = 0; i < val.length; i++) {
              decirc(val[i], i, i, stack, val, depth, options)
            }
          } else {
            var keys = Object.keys(val)
            for (i = 0; i < keys.length; i++) {
              var key = keys[i]
              decirc(val[key], key, i, stack, val, depth, options)
            }
          }
          stack.pop()
        }
      }

      // wraps replacer function to handle values we couldn't replace
      // and mark them as replaced value
      function replaceGetterValues (replacer) {
        replacer =
          typeof replacer !== 'undefined'
            ? replacer
            : function (k, v) {
              return v
            }
        return function (key, val) {
          if (replacerStack.length > 0) {
            for (var i = 0; i < replacerStack.length; i++) {
              var part = replacerStack[i]
              if (part[1] === key && part[0] === val) {
                val = part[2]
                replacerStack.splice(i, 1)
                break
              }
            }
          }
          return replacer.call(this, key, val)
        }
      }
      // end of fast-safe-stringify code
      
      function composeMessage(args) {
        if (args instanceof Error) {
          return \`\${args.name}: \${args.message}\\n\${args.stack}\`;
        }
        if (typeof args === 'undefined') return "undefined";
        if (typeof args === 'string') return args;
        return stringify(args, null, null, { depthLimit: 5, edgesLimit: 100 });
      }

      function truncate(input, limit) {
        if (input.length > limit) {
          return input.substring(0, limit) + '…';
        }
        return input;
      }
      
      function addToUserAgent(extra) {
        const originalUserAgent = globalThis.navigator.userAgent;
        if (!originalUserAgent.includes(extra)) {
          Object.defineProperty(globalThis.navigator, 'userAgent', {
            get: function () {
              return [originalUserAgent, extra].join(' ');
            },
          });
        }
      };

      class StorybookTestRunnerError extends Error {
        constructor(storyId, errorMessage, logs = []) {
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
        
        addToUserAgent(\`(StorybookTestRunner@${testRunnerVersion})\`);

        // collect logs to show upon test error
        let logs = [];
        let hasErrors = false;

        const spyOnConsole = (method, name) => {
          const originalFn = console[method];
          return function () {
            if (\`${failOnConsole}\`==='true' && method==='error') {
              hasErrors = true;
            }
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
          channel.on('${renderedEvent}', () => { 
            if (hasErrors) {
              return reject(new StorybookTestRunnerError(storyId, 'Browser console errors', logs));
            }
            return resolve(document.getElementById('root'));             
          });
          channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
          channel.on('storyErrored', ({ description }) => reject(
            new StorybookTestRunnerError(storyId, description, logs))
          );
          channel.on('storyThrewException', (error) => reject(
            new StorybookTestRunnerError(storyId, error.message, logs))
          );
          channel.on('playFunctionThrewException', (error) => reject(
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

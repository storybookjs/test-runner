/**
 * PLEASE READ THIS BEFORE EDITING THIS FILE:
 *
 * This file is a template to the content which is injected to the Playwright page via the ./setup-page.ts file.
 * setup-page.ts will read the contents of this file and replace values that use {{x}} pattern, and they should be put right below:
 */

// All of these variables will be replaced once this file is processed.
const referenceURL: string | undefined = '{{referenceURL}}';
const targetURL: string = '{{targetURL}}';
const testRunnerVersion: string = '{{testRunnerVersion}}';
const failOnConsole: string = '{{failOnConsole}}';
const renderedEvent: string = '{{renderedEvent}}';
const viewMode: string = '{{viewMode}}';
const debugPrintLimit = parseInt('{{debugPrintLimit}}', 10);

// Type definitions for function parameters and return types
type Colorizer = (message: string) => string;

const bold: Colorizer = (message: string) => `\u001b[1m${message}\u001b[22m`;
const magenta: Colorizer = (message: string) => `\u001b[35m${message}\u001b[39m`;
const blue: Colorizer = (message: string) => `\u001b[34m${message}\u001b[39m`;
const red: Colorizer = (message: string) => `\u001b[31m${message}\u001b[39m`;
const yellow: Colorizer = (message: string) => `\u001b[33m${message}\u001b[39m`;

// Constants
var LIMIT_REPLACE_NODE = '[...]';
var CIRCULAR_REPLACE_NODE = '[Circular]';

// Arrays for tracking replacements
var arr: any[] = [];
var replacerStack: any[] = [];

// Default options for stringification
function defaultOptions(): { depthLimit: number; edgesLimit: number } {
  return {
    depthLimit: Number.MAX_SAFE_INTEGER,
    edgesLimit: Number.MAX_SAFE_INTEGER,
  };
}

// Stringify function
function stringify(
  obj: any,
  replacer: ((key: string, value: any) => any) | null,
  spacer: string | number | null,
  options?: { depthLimit: number; edgesLimit: number }
): string {
  if (typeof options === 'undefined') {
    options = defaultOptions();
  }

  decirc(obj, '', 0, [], undefined, 0, options);
  var res: string;
  try {
    if (replacerStack.length === 0) {
      // @ts-expect-error TODO: check why TS complains about this
      res = JSON.stringify(obj, replacer, spacer);
    } else {
      // @ts-expect-error TODO: check why TS complains about this
      res = JSON.stringify(obj, replaceGetterValues(replacer), spacer);
    }
  } catch (_) {
    return JSON.stringify('[unable to serialize, circular reference is too complex to analyze]');
  } finally {
    while (arr.length !== 0) {
      var part = arr.pop();
      if (part && part.length === 4) {
        Object.defineProperty(part[0], part[1], part[3]);
      } else if (part) {
        part[0][part[1]] = part[2];
      }
    }
  }
  return res;
}

// Handle circular references and limits
function decirc(
  val: any,
  k: string,
  edgeIndex: number,
  stack: any[],
  parent: any | undefined,
  depth: number,
  options: { depthLimit: number; edgesLimit: number }
): void {
  depth += 1;
  var i: number;
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        setReplace(CIRCULAR_REPLACE_NODE, val, k, parent);
        return;
      }
    }

    if (depth > options.depthLimit || edgeIndex + 1 > options.edgesLimit) {
      setReplace(LIMIT_REPLACE_NODE, val, k, parent);
      return;
    }

    stack.push(val);
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i.toString(), i, stack, val, depth, options);
      }
    } else {
      var keys = Object.keys(val);
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        decirc(val[key], key, i, stack, val, depth, options);
      }
    }
    stack.pop();
  }
}

// Set replacement values in objects
function setReplace(replace: any, val: any, k: string, parent: any | undefined): void {
  if (!parent) return;
  var propertyDescriptor = Object.getOwnPropertyDescriptor(parent, k);
  if (propertyDescriptor && propertyDescriptor.get !== undefined) {
    if (propertyDescriptor.configurable) {
      Object.defineProperty(parent, k, { value: replace });
      arr.push([parent, k, val, propertyDescriptor]);
    } else {
      replacerStack.push([val, k, replace]);
    }
  } else {
    parent[k] = replace;
    arr.push([parent, k, val]);
  }
}

// Replace getter values
function replaceGetterValues(
  replacer?: (this: any, key: string, value: any) => any
): (this: any, key: string, value: any) => any {
  const effectiveReplacer = replacer ?? ((_k: string, v: any) => v);
  return function (this: any, key: string, val: any): any {
    if (replacerStack.length > 0) {
      for (var i = 0; i < replacerStack.length; i++) {
        var part = replacerStack[i];
        if (part[1] === key && part[0] === val) {
          val = part[2];
          replacerStack.splice(i, 1);
          break;
        }
      }
    }
    return effectiveReplacer.call(this, key, val);
  };
}

// Compose message function
function composeMessage(args: any): string {
  if (args instanceof Error) {
    return `${args.name}: ${args.message}\n${args.stack}`;
  }
  if (typeof args === 'undefined') return 'undefined';
  if (typeof args === 'string') return args;
  return stringify(args, null, null, { depthLimit: 5, edgesLimit: 100 });
}

// Truncate long strings
function truncate(input: string, limit: number): string {
  if (input.length > limit) {
    return input.substring(0, limit) + '…';
  }
  return input;
}

// Add extra information to the user agent
function addToUserAgent(extra: string): void {
  const originalUserAgent = globalThis.navigator.userAgent;
  if (!originalUserAgent.includes(extra)) {
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      get: function () {
        return [originalUserAgent, extra].join(' ');
      },
      configurable: true,
    });
  }
}

// Custom error class
class StorybookTestRunnerError extends Error {
  constructor(storyId: string, errorMessage: string, logs: string[] = []) {
    super(errorMessage);
    this.name = 'StorybookTestRunnerError';
    const storyUrl = `${referenceURL ?? targetURL}?path=/story/${storyId}`;
    const finalStoryUrl = `${storyUrl}&addonPanel=storybook/interactions/panel`;
    const separator = '\n\n--------------------------------------------------';
    const extraLogs =
      logs.length > 0 ? separator + '\n\nBrowser logs:\n\n' + logs.join('\n\n') : '';

    this.message = `\nAn error occurred in the following story. Access the link for full output:\n${finalStoryUrl}\n\nMessage:\n ${truncate(
      errorMessage,
      debugPrintLimit
    )}\n${extraLogs}`;
  }
}

// @ts-expect-error Global function to throw custom error, used by the test runner or user
async function __throwError(storyId: string, errorMessage: string, logs: string[]): Promise<void> {
  throw new StorybookTestRunnerError(storyId, errorMessage, logs);
}

// Wait for Storybook to load
async function __waitForStorybook(): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject();
    }, 10000);

    if (document.querySelector('#root') || document.querySelector('#storybook-root')) {
      clearTimeout(timeout);
      return resolve();
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector('#root') || document.querySelector('#storybook-root')) {
        clearTimeout(timeout);
        resolve();
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

// Get context from Storybook
// @ts-expect-error Global function to get context, used by the test runner or user
async function __getContext(storyId: string): Promise<any> {
  // @ts-expect-error globally defined via Storybook
  return globalThis.__STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId });
}

// @ts-expect-error Global main test function, used by the test runner
async function __test(storyId: string): Promise<any> {
  try {
    await __waitForStorybook();
  } catch (err) {
    const message = `Timed out waiting for Storybook to load after 10 seconds. Are you sure the Storybook is running correctly in that URL? Is the Storybook private (e.g. under authentication layers)?\n\n\nHTML: ${document.body.innerHTML}`;
    throw new StorybookTestRunnerError(storyId, message);
  }

  // @ts-expect-error globally defined via Storybook
  const channel = globalThis.__STORYBOOK_ADDONS_CHANNEL__;
  if (!channel) {
    throw new StorybookTestRunnerError(
      storyId,
      'The test runner could not access the Storybook channel. Are you sure the Storybook is running correctly in that URL?'
    );
  }

  addToUserAgent(`(StorybookTestRunner@${testRunnerVersion})`);

  // Collect logs to show upon test error
  let logs: string[] = [];
  let hasErrors = false;

  type ConsoleMethod = 'log' | 'group' | 'warn' | 'error' | 'trace' | 'groupCollapsed';

  const spyOnConsole = (method: ConsoleMethod, name: string): void => {
    const originalFn = console[method].bind(console);
    console[method] = function () {
      if (failOnConsole === 'true' && method === 'error') {
        hasErrors = true;
      }
      const message = Array.from(arguments).map(composeMessage).join(', ');
      const prefix = `${bold(name)}: `;
      logs.push(prefix + message);
      originalFn(...arguments);
    };
  };

  // Console methods + color function for their prefix
  const spiedMethods: { [key: string]: Colorizer } = {
    log: blue,
    warn: yellow,
    error: red,
    trace: magenta,
    group: magenta,
    groupCollapsed: magenta,
  };

  Object.entries(spiedMethods).forEach(([method, color]) => {
    spyOnConsole(method as ConsoleMethod, color(method));
  });

  return new Promise((resolve, reject) => {
    channel.on(renderedEvent, () => {
      if (hasErrors) {
        return reject(new StorybookTestRunnerError(storyId, 'Browser console errors', logs));
      }
      return resolve(document.getElementById('root'));
    });
    channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
    channel.on('storyErrored', ({ description }: { description: string }) =>
      reject(new StorybookTestRunnerError(storyId, description, logs))
    );
    channel.on('storyThrewException', (error: Error) =>
      reject(new StorybookTestRunnerError(storyId, error.message, logs))
    );
    channel.on('playFunctionThrewException', (error: Error) =>
      reject(new StorybookTestRunnerError(storyId, error.message, logs))
    );
    channel.on('storyMissing', (id: string) => {
      if (id === storyId) {
        reject(
          new StorybookTestRunnerError(
            storyId,
            'The story was missing when trying to access it.',
            logs
          )
        );
      }
    });

    channel.emit('setCurrentStory', { storyId, viewMode });
  });
}

export {};

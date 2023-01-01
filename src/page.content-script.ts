import fastSafeStringify from 'fast-safe-stringify';
import kleur from 'kleur';

declare global {
  const __STORYBOOK_PREVIEW__: any;
  const __STORYBOOK_ADDONS_CHANNEL__: any;
  const __CONTENT_SCRIPT_viewMode: string;
  const __CONTENT_SCRIPT_referenceURL: string;
  const __CONTENT_SCRIPT_targetURL: string;
  const __CONTENT_SCRIPT_debugPrintLimit: number;
  const __CONTENT_SCRIPT_testRunnerVersion: string;
  const __CONTENT_SCRIPT_renderedEvent: string;
}

function composeMessage(args: any) {
  if (typeof args === 'undefined') return 'undefined';
  if (typeof args === 'string') return args;
  return fastSafeStringify(args, null, null, { depthLimit: 5, edgesLimit: 100 });
}

function truncate(input: string, limit: number) {
  if (input.length > limit) {
    return input.substring(0, limit) + '\u2026';
  }
  return input;
}

function addToUserAgent(extra: any) {
  const originalUserAgent = globalThis.navigator.userAgent;
  if (!originalUserAgent.includes(extra)) {
    Object.defineProperty(globalThis.navigator, 'userAgent', {
      get: function () {
        return [originalUserAgent, extra].join(' ');
      },
    });
  }
}

class StorybookTestRunnerError extends Error {
  constructor(storyId: string, errorMessage: any, logs: string[] = []) {
    super(errorMessage);
    this.name = 'StorybookTestRunnerError';
    const storyUrl = `${
      __CONTENT_SCRIPT_referenceURL || __CONTENT_SCRIPT_targetURL
    }?path=/story/${storyId}`;
    const finalStoryUrl = `${storyUrl}&addonPanel=storybook/interactions/panel`;
    const separator = '\n\n--------------------------------------------------';
    const extraLogs =
      logs.length > 0 ? separator + '\n\nBrowser logs:\n\n' + logs.join('\n\n') : '';

    this.message = `
An error occurred in the following story. Access the link for full output:
${finalStoryUrl}

Message:
${truncate(errorMessage, __CONTENT_SCRIPT_debugPrintLimit)}
${extraLogs}`;
  }
}

async function __throwError(storyId: string, errorMessage: any, logs: string[]) {
  throw new StorybookTestRunnerError(storyId, errorMessage, logs);
}

async function __waitForStorybook() {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject();
    }, 10000);

    if (document.querySelector('#root') || document.querySelector('#storybook-root')) {
      clearTimeout(timeout);
      return resolve();
    }

    const observer = new MutationObserver((mutations) => {
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

async function __getContext(storyId: string) {
  return __STORYBOOK_PREVIEW__.storyStore.loadStory({ storyId });
}

async function __test(storyId: string) {
  try {
    await __waitForStorybook();
  } catch (err) {
    const message = `Timed out waiting for Storybook to load after 10 seconds. Are you sure the Storybook is running correctly in that URL? Is the Storybook private (e.g. under authentication layers)?


HTML: ${document.body.innerHTML}`;
    throw new StorybookTestRunnerError(storyId, message);
  }

  const channel = __STORYBOOK_ADDONS_CHANNEL__;
  if (!channel) {
    throw new StorybookTestRunnerError(
      storyId,
      'The test runner could not access the Storybook channel. Are you sure the Storybook is running correctly in that URL?'
    );
  }

  addToUserAgent(`(StorybookTestRunner@${__CONTENT_SCRIPT_testRunnerVersion})`);

  // collect logs to show upon test error
  let logs: string[] = [];

  const spyOnConsole = (method: keyof typeof console, name: string) => {
    const originalFn = console[method];
    return function () {
      const message = [...arguments].map(composeMessage).join(', ');
      const prefix = `${kleur.bold(name)}: `;
      logs.push(prefix + message);
      originalFn.apply(console, arguments);
    };
  };

  // console methods + color function for their prefix
  const spiedMethods: Record<string, kleur.Color> = {
    log: kleur.blue,
    warn: kleur.yellow,
    error: kleur.red,
    trace: kleur.magenta,
    group: kleur.magenta,
    groupCollapsed: kleur.magenta,
  };

  Object.entries(spiedMethods).forEach(([method, color]) => {
    (console as any)[method] = spyOnConsole(method as any, color(method));
  });

  return new Promise((resolve, reject) => {
    channel.on(__CONTENT_SCRIPT_renderedEvent, () => resolve(document.getElementById('root')));
    channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
    channel.on('storyErrored', ({ description }: any) =>
      reject(new StorybookTestRunnerError(storyId, description, logs))
    );
    channel.on('storyThrewException', (error: any) =>
      reject(new StorybookTestRunnerError(storyId, error.message, logs))
    );
    channel.on('playFunctionThrewException', (error: any) =>
      reject(new StorybookTestRunnerError(storyId, error.message, logs))
    );
    channel.on(
      'storyMissing',
      (id: string) =>
        id === storyId &&
        reject(
          new StorybookTestRunnerError(
            storyId,
            'The story was missing when trying to access it.',
            logs
          )
        )
    );

    channel.emit('setCurrentStory', { storyId, viewMode: __CONTENT_SCRIPT_viewMode });
  });
}

(globalThis as any).__throwError = __throwError;
(globalThis as any).__waitForStorybook = __waitForStorybook;
(globalThis as any).__getContext = __getContext;
(globalThis as any).__test = __test;

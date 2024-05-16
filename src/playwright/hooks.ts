import type { BrowserContext, Page } from 'playwright';
import type { StoryContextForEnhancers } from '@storybook/csf';

export type TestContext = {
  id: string;
  title: string;
  name: string;
};

export type PrepareContext = {
  page: Page;
  browserContext: BrowserContext;
  testRunnerConfig: TestRunnerConfig;
};

export type TestHook = (page: Page, context: TestContext) => Promise<void>;
export type HttpHeaderSetter = (url: string) => Promise<Record<string, any>>;
export type PrepareSetter = (context: PrepareContext) => Promise<void>;

export interface TestRunnerConfig {
  setup?: () => void;
  /**
   * @deprecated Use `preVisit` instead.
   */
  preRender?: TestHook;
  /**
   * @deprecated Use `postVisit` instead.
   */
  postRender?: TestHook;
  /**
   * Runs before each story is visited. By this point, the story is not rendered in the browser.
   * This is useful for preparing the browser environment such as setting viewport size, etc.
   * @see https://github.com/storybookjs/test-runner#previsit
   */
  preVisit?: TestHook;
  /**
   * Runs after each story is visited. This means the story has finished rendering and running its play function.
   * This is useful for taking screenshots, snapshots, accessibility tests, etc.
   * @see https://github.com/storybookjs/test-runner#postvisit
   */
  postVisit?: TestHook;
  /**
   * Adds http headers to the test-runner's requests. This is useful if you need to set headers such as `Authorization` for your Storybook instance.
   */
  getHttpHeaders?: HttpHeaderSetter;
  /**
   * Overrides the default prepare behavior of the test-runner. Good for customizing the environment before testing, such as authentication etc.
   *
   * If you override the default prepare behavior, even though this is powerful, you will be responsible for properly preparing the browser. Future changes to the default prepare function will not get included in your project, so you will have to keep an eye out for changes in upcoming releases.
   */
  prepare?: PrepareSetter;
  /**
   * Tags to include, exclude, or skip. These tags are defined as annotations in your story or meta.
   * @see https://github.com/storybookjs/test-runner#filtering-tests-experimental
   */
  tags?: {
    include?: string[];
    exclude?: string[];
    skip?: string[];
  };
  /**
   * Defines the log level of the test runner. Browser logs are printed to the console when reporting errors.
   * @default 'info'
   */
  logLevel?: 'info' | 'warn' | 'error' | 'verbose' | 'none';

  /**
   * Defines a custom function to process the error message. Useful to sanitize error messages or to add additional information.
   */
  errorMessageFormatter?: (error: string) => string;
}

export const setPreVisit = (preVisit: TestHook) => {
  globalThis.__sbPreVisit = preVisit;
};

export const setPostVisit = (postVisit: TestHook) => {
  globalThis.__sbPostVisit = postVisit;
};

export const getStoryContext = async (
  page: Page,
  context: TestContext
): Promise<StoryContextForEnhancers> => {
  return page.evaluate(({ storyId }) => globalThis.__getContext(storyId), {
    storyId: context.id,
  });
};

export const waitForPageReady = async (page: Page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => document.fonts.ready);
};

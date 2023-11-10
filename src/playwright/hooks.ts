import type { BrowserContext, Page } from 'playwright';
import type { StoryContext } from '@storybook/csf';

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
export type HttpHeaderSetter = (url: string) => Promise<Record<string, string>>;
export type PrepareSetter = (context: PrepareContext) => Promise<void>;

export interface TestRunnerConfig {
  setup?: () => void;
  preRender?: TestHook;
  postRender?: TestHook;
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
}

export const setPreRender = (preRender: TestHook) => {
  globalThis.__sbPreRender = preRender;
};

export const setPostRender = (postRender: TestHook) => {
  globalThis.__sbPostRender = postRender;
};

export const getStoryContext = async (page: Page, context: TestContext): Promise<StoryContext> => {
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

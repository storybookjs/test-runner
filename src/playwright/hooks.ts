import type { Page } from 'playwright';
import type { StoryContext } from '@storybook/csf';

export type TestContext = {
  id: string;
  title: string;
  name: string;
};

export type TestHook = (page: Page, context: TestContext) => Promise<void>;

export interface TestRunnerConfig {
  setup?: () => void;
  preRender?: TestHook;
  postRender?: TestHook;
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

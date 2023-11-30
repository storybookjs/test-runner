import { Page } from '@playwright/test';
import { setupPage } from '../setup-page';

class StoryPage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async test(context: { id: string; hasPlayFn: boolean }) {
    /**
     * The flow is as follows:
     * 1. Load the iframe.html page
     * 2. Wait for Storybook to be loaded
     * 3. Inject utilities, of which one is __test. This utility will use the channel to visit the story
     * 4. Once page.evaluate calls __test, everything will be handled
     */
    await setupPage(this.page, this.page.context());
    try {
      // @ts-expect-error TODO
      await this.page.evaluate(({ id, hasPlayFn }) => __test(id, hasPlayFn), context);
    } finally {
      // await sleep(10000000);
    }
  }
}

module.exports = { StoryPage };

import { setupPage } from '../dist/index.js';
import _PlaywrightEnvironment from 'jest-playwright-preset/lib/PlaywrightEnvironment.js';

// @ts-expect-error check later
const PlaywrightEnvironment = _PlaywrightEnvironment.default ?? _PlaywrightEnvironment;

class CustomEnvironment extends PlaywrightEnvironment {
  async setup() {
    await super.setup();
    await setupPage(this.global.page, this.global.context);
  }

  async teardown() {
    await super.teardown();
  }

  async handleTestEvent(event) {
    await super.handleTestEvent(event);
  }
}

export default CustomEnvironment;

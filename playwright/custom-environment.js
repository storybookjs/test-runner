import { setupPage } from '../dist/index.js';
import PlaywrightEnvironment from '../dist/jest-playwright-entries/test-environment.js';

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

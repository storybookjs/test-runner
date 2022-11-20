const { setupPage } = require('../dist/setup-page');

require('regenerator-runtime/runtime');
const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default;

class CustomEnvironment extends PlaywrightEnvironment {
  async setup() {
    await super.setup();
    await setupPage(this.global.page);
  }

  async teardown() {
    await super.teardown();
  }

  async handleTestEvent(event) {
    await super.handleTestEvent(event);
  }
}

module.exports = CustomEnvironment;

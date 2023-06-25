import { setupPage } from '../setup-page';
import { type Event } from 'jest-circus';

const PlaywrightEnvironmentModule = require.resolve(
  'jest-playwright-preset/lib/PlaywrightEnvironment'
);
const PlaywrightEnvironment = require(PlaywrightEnvironmentModule).default;

class CustomEnvironment extends PlaywrightEnvironment {
  async setup() {
    await super.setup();
    await setupPage(this.global.page, this.global.context);
  }

  async teardown() {
    await super.teardown();
  }

  async handleTestEvent(event: Event) {
    await super.handleTestEvent(event);
  }
}

module.exports = CustomEnvironment;

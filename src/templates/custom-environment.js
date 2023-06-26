const { setupPage, PlaywrightEnvironmentModule } = require('@storybook/test-runner');

const PlaywrightEnvironment = require(PlaywrightEnvironmentModule).default;

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

module.exports = CustomEnvironment;

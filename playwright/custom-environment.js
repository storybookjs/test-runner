require('regenerator-runtime/runtime');
const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default;

class CustomEnvironment extends PlaywrightEnvironment {
  async setup() {
    await super.setup();
    console.log('CUSTOM SETUP!!!');
    // Your setup
    const page = this.global.page;
    const start = new Date();
    const port = process.env.STORYBOOK_PORT || '6006';
    const targetURL = process.env.TARGET_URL || `http://localhost:${port}`
    await page.goto(`${targetURL}/iframe.html`, { waitUntil: 'load' }); // FIXME: configure
    console.log('page loaded in', new Date() - start);

    await page.addScriptTag({
      content: `
        async function __test(storyId) {
          const channel = window.__STORYBOOK_ADDONS_CHANNEL__;
          return new Promise((resolve, reject) => {
            channel.on('storyRendered', () => resolve(document.getElementById('root')));
            channel.on('storyUnchanged', () => resolve(document.getElementById('root')));
            channel.on('storyErrored', () => reject(new Error('storyErrored')));
            channel.on('storyThrewException', (error) => reject(error));
            channel.on('storyMissing', () => reject(new Error('storyMissing')));

            channel.emit('setCurrentStory', { storyId: storyId });
          });
        };
      `,
    });
  }

  async teardown() {
    // Your teardown
    await super.teardown();
    console.log('CUSTOM TEARDOWN!!!');
  }

  async handleTestEvent(event) {
    await super.handleTestEvent(event);
    // console.log('EVENT', event);
  }
}

module.exports = CustomEnvironment;

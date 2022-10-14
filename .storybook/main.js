let stories = [
  '../stories/docs/**/*.stories.mdx',
  // default title prefix
  {
    titlePrefix: 'Atoms',
    directory: '../stories/atoms',
  },
  // defined title prefix
  {
    titlePrefix: 'Molecules',
    directory: '../stories/molecules',
  },
  // general glob
  '../stories/pages/**/*.stories.@(js|jsx|ts|tsx)',
];

if (process.env.STRESS_TEST) {
  stories.push('../stories/stress-test/*.stories.@(js|jsx|ts|tsx)');
}

if (process.env.TEST_FAILURES) {
  stories = ['../stories/expected-failures/*.stories.@(js|jsx|ts|tsx)'];
}

const addons = [
  process.env.WITHOUT_DOCS
    ? {
        name: '@storybook/addon-essentials',
        options: {
          docs: false,
        },
      }
    : '@storybook/addon-essentials',
  '@storybook/addon-interactions',
  '@storybook/addon-coverage',
];

module.exports = {
  stories,
  addons,
  features: {
    storyStoreV7: process.env.STORY_STORE_V7 ? true : false,
    buildStoriesJson: true,
  },
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};

const { STRESS_TEST, STORY_STORE_V7, WITHOUT_DOCS } = process.env;

const stories = [
  {
    directory: '../stories',
  },
];

if (STRESS_TEST) {
  stories.push('../stories/stress-test/*.stories.@(js|jsx|ts|tsx)');
}

const addons = [
  WITHOUT_DOCS
    ? {
        name: '@storybook/addon-essentials',
        options: {
          docs: false,
        },
      }
    : '@storybook/addon-essentials',
  '@storybook/addon-interactions',
];

module.exports = {
  stories,
  addons,
  features: {
    storyStoreV7: STORY_STORE_V7 ? true : false,
    buildStoriesJson: true,
  },
};

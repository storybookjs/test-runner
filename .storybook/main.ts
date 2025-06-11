import { StorybookConfig } from '@storybook/react-vite';

let stories = [
  '../stories/docs/**/*.mdx',
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
if (process.env.TEST_FAILURES) {
  stories = ['../stories/expected-failures/*.stories.@(js|jsx|ts|tsx)'];
}
const addons = process.env.WITHOUT_DOCS
  ? ['@storybook/addon-coverage', '@storybook/addon-a11y']
  : ['@storybook/addon-coverage', '@storybook/addon-a11y', '@storybook/addon-docs'];

const config: StorybookConfig = {
  stories,
  addons,
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;

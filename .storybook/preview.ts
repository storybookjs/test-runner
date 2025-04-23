import type { Preview } from '@storybook/react-vite';
import { isTestRunner } from './is-test-runner';

const withSkippableTests = (StoryFn, { parameters }) => {
  if (parameters.test?.skip && isTestRunner()) {
    return () => {};
  }

  return StoryFn();
};

const preview: Preview = {
  tags: ['global-tag'],
  decorators: [withSkippableTests],
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'region',
            enabled: false,
          },
        ],
      },
    },
  },
};

export default preview;

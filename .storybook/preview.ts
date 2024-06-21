import type { Preview } from '@storybook/react';
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
};

export default preview;

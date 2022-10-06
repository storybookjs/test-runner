import { isTestRunner } from '../dist/esm/is-test-runner';

const withSkippableTests = (StoryFn, { parameters }) => {
  if (parameters.test?.skip && isTestRunner()) {
    return () => {};
  }

  return StoryFn();
};

export const decorators = [withSkippableTests];

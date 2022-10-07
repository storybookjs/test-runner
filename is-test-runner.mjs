/**
 * Returns whether the story is rendering inside of the Storybook test runner.
 */
export function isTestRunner() {
  return!!(
    typeof window !== 'undefined' &&
    window &&
    window.navigator.userAgent.match(/StorybookTestRunner/)
  );
}

/**
 * Returns whether the story is rendering inside of the Storybook test runner.
 */
export function isTestRunner() {
  const isTestRunnerInNode = process?.env?.STORYBOOK_TEST_RUNNER === 'true';
  const isTestRunnerInBrowser = !!(
    typeof window !== 'undefined' &&
    window &&
    window.navigator.userAgent.match(/StorybookTestRunner/)
  );
  return isTestRunnerInBrowser || isTestRunnerInNode;
}

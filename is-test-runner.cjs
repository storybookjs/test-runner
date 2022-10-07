/**
 * Returns whether the story is rendering inside of the Storybook test runner.
 */
module.exports = {
  isTestRunner: function () {
    return process?.env?.STORYBOOK_TEST_RUNNER === 'true';
  }
}

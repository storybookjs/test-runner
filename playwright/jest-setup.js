const { getTestRunnerConfig, setPreRender, setPostRender } = require('../dist/cjs');

const testRunnerConfig = getTestRunnerConfig(process.env.STORYBOOK_CONFIG_DIR);
if (testRunnerConfig) {
  if (testRunnerConfig.setup) {
    testRunnerConfig.setup();
  }
  if (testRunnerConfig.preRender) {
    setPreRender(testRunnerConfig.preRender);
  }
  if (testRunnerConfig.postRender) {
    setPostRender(testRunnerConfig.postRender);
  }
}

global.__sbCollectCoverage = process.env.COLLECT_COVERAGE === 'true'
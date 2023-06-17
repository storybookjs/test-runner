const { getTestRunnerConfig, setPreRender, setPostRender, setupPage } = require('../dist');

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

// If the transformed tests need a dependency, it has to be globally available
// in order to work both in default (file transformation) and stories/index.json mode.
globalThis.__sbSetupPage = setupPage;
globalThis.__sbCollectCoverage = process.env.STORYBOOK_COLLECT_COVERAGE === 'true';

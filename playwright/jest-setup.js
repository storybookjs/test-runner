import { getTestRunnerConfig, setPreVisit, setPostVisit, setupPage } from '../dist/index.js';

const testRunnerConfig = getTestRunnerConfig(process.env.STORYBOOK_CONFIG_DIR);
if (testRunnerConfig) {
  // hooks set up
  if (testRunnerConfig.setup) {
    testRunnerConfig.setup();
  }

  const preVisitFn = testRunnerConfig.preVisit || testRunnerConfig.preRender;
  if (preVisitFn) {
    setPreVisit(preVisitFn);
  }

  const postVisitFn = testRunnerConfig.postVisit || testRunnerConfig.postRender;
  if (postVisitFn) {
    setPostVisit(postVisitFn);
  }
}

// If the transformed tests need a dependency, it has to be globally available
// in order to work both in default (file transformation) and stories/index.json mode.
globalThis.__sbSetupPage = setupPage;
globalThis.__sbCollectCoverage = process.env.STORYBOOK_COLLECT_COVERAGE === 'true';

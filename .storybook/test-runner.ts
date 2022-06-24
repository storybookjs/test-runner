import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { getStoryContext } from '../dist/cjs/playwright/hooks';
import type { TestRunnerConfig } from '../dist/ts';

const snapshotsDir = process.env.SNAPSHOTS_DIR || '__snapshots__';
const customSnapshotsDir = `${process.cwd()}/${snapshotsDir}`;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postRender(page, context) {
    // Get entire context of a story, including parameters, args, argTypes, etc.
    const { parameters } = await getStoryContext(page, context);

    if (parameters?.tests?.disableSnapshots) {
      return;
    }

    // Visual snapshot tests
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.03,
      failureThresholdType: 'percent',
    });

    const elementHandler = await page.$('#root');
    const innerHTML = await elementHandler.innerHTML();
    // HTML snapshot tests
    expect(innerHTML).toMatchSnapshot();
  },
};

export default config;

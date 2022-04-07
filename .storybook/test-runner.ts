import { toMatchImageSnapshot } from 'jest-image-snapshot';
import type { TestRunnerConfig } from '../dist/ts';

const snapshotsDir = process.env.SNAPSHOTS_DIR || '__snapshots__';
const customSnapshotsDir = `${process.cwd()}/${snapshotsDir}`;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postRender(page, context) {
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.03,
      failureThresholdType: 'percent',
    });
  },
};

export default config;

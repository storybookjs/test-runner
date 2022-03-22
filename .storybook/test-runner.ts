import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { injectAxe, checkA11y } from 'axe-playwright';
import type { TestRunnerConfig } from '../dist/ts';

const snapshotsDir = process.env.SNAPSHOTS_DIR || '__snapshots__';
const customSnapshotsDir = `${process.cwd()}/${snapshotsDir}`;

const snapshotConfig: TestRunnerConfig = {
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

const a11yConfig: TestRunnerConfig = {
  async preRender(page, context) {
    await injectAxe(page);
  },
  async postRender(page, context) {
    await checkA11y(page);
  },
};

export default a11yConfig;

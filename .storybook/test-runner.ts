import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { getStoryContext, waitForPageReady } from '../dist/playwright/hooks';
import type { TestRunnerConfig } from '../dist';

const snapshotsDir = process.env.SNAPSHOTS_DIR || '__snapshots__';
const customSnapshotsDir = `${process.cwd()}/${snapshotsDir}`;
const skipSnapshots = process.env.SKIP_SNAPSHOTS === 'true';

const config: TestRunnerConfig = {
  tags: {
    exclude: ['exclude'],
    include: [],
    skip: ['skip'],
  },
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // Get entire context of a story, including parameters, args, argTypes, etc.
    const { parameters } = await getStoryContext(page, context);

    if (parameters?.tests?.disableSnapshots) {
      return;
    }

    if (skipSnapshots) {
      return;
    }

    await waitForPageReady(page);

    // Visual snapshot tests
    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.03,
      failureThresholdType: 'percent',
    });

    const elementHandler = (await page.$('#root')) || (await page.$('#storybook-root'));
    const innerHTML = await elementHandler.innerHTML();
    // HTML snapshot tests
    expect(innerHTML).toMatchSnapshot();
  },
};

export default config;

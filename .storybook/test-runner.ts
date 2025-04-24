import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

import { getStoryContext, waitForPageReady } from '../dist';
import type { TestRunnerConfig } from '../dist';

const snapshotsDir = process.env.SNAPSHOTS_DIR || '__snapshots__';
const customSnapshotsDir = `${process.cwd()}/${snapshotsDir}`;
const skipSnapshots = process.env.SKIP_SNAPSHOTS === 'true';

const config: TestRunnerConfig = {
  logLevel: 'verbose',
  errorMessageFormatter: (message) => {
    return message;
  },
  tags: {
    exclude: ['exclude'],
    include: [],
    skip: ['skip'],
  },
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async preVisit(page) {
    await injectAxe(page);
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
    const innerHTML = await elementHandler?.innerHTML();
    // HTML snapshot tests
    expect(innerHTML).toMatchSnapshot();

    await configureAxe(page, {
      rules: parameters?.a11y?.config?.rules,
    });

    const element = parameters?.a11y?.element ?? 'body';
    await checkA11y(page, element, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });
  },
};

export default config;

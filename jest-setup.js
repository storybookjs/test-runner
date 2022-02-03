const { toMatchImageSnapshot } = require('jest-image-snapshot');
const { setPostRender } = require('./dist/cjs');

expect.extend({ toMatchImageSnapshot });

// use custom directory/id to align CSF and stories.json mode outputs
const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

setPostRender(async (page, context) => {
  const image = await page.screenshot();
  expect(image).toMatchImageSnapshot({
    customSnapshotsDir,
    customSnapshotIdentifier: context.id,
  });
});

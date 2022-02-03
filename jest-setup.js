const { toMatchImageSnapshot } = require('jest-image-snapshot');
const { setPostRender } = require('./dist/cjs');

setPostRender(async (page, context) => {
  const image = await page.screenshot();
  expect(image).toMatchImageSnapshot();
});

expect.extend({ toMatchImageSnapshot });

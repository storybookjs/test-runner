const { transformSync: swcTransform } = require('@swc/core');
const { transformPlaywright } = require('../dist/playwright/transformPlaywright');

module.exports = {
  process(src, filename) {
    const csfTest = transformPlaywright(src, filename);

    const result = swcTransform(csfTest, {
      filename,
      module: {
        type: 'commonjs',
      },
    });

    return { code: result ? result.code : src };
  },
};

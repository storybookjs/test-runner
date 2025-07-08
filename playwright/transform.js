const { transformSync: swcTransform } = require('@swc/core');
const { transformPlaywright } = require('../dist');

module.exports = {
  async processAsync(src, filename) {
    const csfTest = await transformPlaywright(src, filename);

    const result = swcTransform(csfTest, {
      filename,
      module: {
        type: 'commonjs',
      },
    });

    return { code: result ? result.code : src };
  },
};

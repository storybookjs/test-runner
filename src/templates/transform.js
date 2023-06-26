import { transformPlaywright, swcTransform } from '../index';

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

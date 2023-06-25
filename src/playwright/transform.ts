import { transformSync as swcTransform } from '@swc/core';
import { transformPlaywright } from './transformPlaywright';

module.exports = {
  process(src: string, filename: string) {
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

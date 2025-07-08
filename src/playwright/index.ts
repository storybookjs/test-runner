import { transformSync as swcTransform } from '@swc/core';
import { transformPlaywright } from './transformPlaywright';

export const processAsync = async (src: string, filename: string) => {
  const csfTest = await transformPlaywright(src, filename);

  const result = swcTransform(csfTest, {
    filename,
    module: {
      type: 'commonjs',
    },
  });
  return result ? result.code : src;
};

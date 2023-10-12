import { transformSync as swcTransform } from '@swc/core';
import { transformPlaywright } from './transformPlaywright';

export const process = (src: string, filename: string, config: any) => {
  const csfTest = transformPlaywright(src, filename);

  const result = swcTransform(csfTest, {
    filename,
    module: {
      type: 'commonjs',
    },
  });
  return result ? result.code : src;
};

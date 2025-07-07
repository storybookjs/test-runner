import { transform as swcTransform } from '@swc/core';
import { transformPlaywright } from './transformPlaywright';

console.log('FUI CHAMADO');
throw new Error('teste');
export const processAsync = async (src: string, filename: string) => {
  const csfTest = await transformPlaywright(src, filename);

  const result = await swcTransform(csfTest, {
    filename,
    isModule: true,
    module: {
      type: 'es6',
    },
  });
  return result ? result.code : src;
};

export const process = (src: string) => {
  return src;
};

import { transform as babelTransform } from '@babel/core';
import { transformJsdom } from './transformJsdom';

export const process = (src: string, filename: string, config: any) => {
  const csfTest = transformJsdom(src);

  const result = babelTransform(csfTest, {
    filename,
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
  });
  return result ? result.code : src;
};

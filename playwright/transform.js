import { transform as swcTransform } from '@swc/core';
import { transformPlaywright } from '../dist/index.js';

// Only export async version - force Jest to use it
async function processAsync(src, filename) {
  try {
    const csfTest = await transformPlaywright(src, filename);
    // This swc transform might not be needed
    const result = await swcTransform(csfTest, {
      filename,
      isModule: true,
      module: {
        type: 'es6',
      },
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true,
        },
        target: 'es2015',
      },
    });

    return { code: result ? result.code : src };
  } catch (error) {
    console.error('Transform error:', error);
    return { code: src };
  }
}

export default {
  processAsync,
};

import { transform as swcTransform } from '@swc/core';
import { transformPlaywright } from '../dist/index.js';

// Only export async version - force Jest to use it
async function processAsync(src, filename) {
  console.log('processAsync filename', filename);
  try {
    const csfTest = await transformPlaywright(src, filename);
    console.log({ csfTest });
    const result = await swcTransform(csfTest, {
      filename,
      isModule: true,
      module: {
        type: 'es6',
      },
      jsc: {
        parser: {
          syntax: 'typescript',
          tsx: true, // Enable JSX support
        },
        target: 'es2015', // Set target for compatibility
      },
    });

    return { code: result ? result.code : src };
  } catch (error) {
    console.error('Transform error:', error);
    return { code: src };
  }
}

// Export only the async version
export default {
  process: (src, filename) => {
    console.log('processSync filename', filename);
    return { code: src };
  },
  processAsync,
};

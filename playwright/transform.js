const { transform: babelTransform } = require('@babel/core');
const { transformPlaywright } = require('../dist/cjs/playwright/transformPlaywright');

module.exports = {
  process(src, filename) {
    const csfTest = transformPlaywright(src, filename);

    const result = babelTransform(csfTest, {
      filename,
      babelrc: false,
      configFile: false,
      presets: [
        require.resolve('@babel/preset-env', { targets: { node: 'current' } }),
        require.resolve('@babel/preset-typescript'),
        require.resolve('@babel/preset-react'),
      ],
    });

    return { code: result ? result.code : src };
  },
};

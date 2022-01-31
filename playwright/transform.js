const { transform: babelTransform } = require('@babel/core');
const { transformPlaywright } = require('../dist/cjs/playwright/transformPlaywright');

module.exports = {
  process(src, filename, config) {
    const csfTest = transformPlaywright(src, filename);

    const result = babelTransform(csfTest, {
      filename,
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        '@babel/preset-react',
      ],
    });
    return result ? result.code : src;
  },
};

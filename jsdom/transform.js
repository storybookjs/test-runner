const { transform: babelTransform } = require('@babel/core');
const { transformJsdom } = require('../dist/cjs/jsdom/transformJsdom');

module.exports = {
  process(src, filename, config) {
    const csfTest = transformJsdom(src);

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

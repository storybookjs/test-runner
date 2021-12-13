const { transform: babelTransform } = require('@babel/core');
const { transformTestingLib } = require('../dist/cjs/jsdom/transformTestingLib');

module.exports = {
  process(src, filename, config) {
    const csfTest = transformTestingLib(src);

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

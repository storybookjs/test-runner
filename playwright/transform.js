const { transform: babelTransform } = require('@babel/core');
const semver = require('semver');
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

    if (result) {
      /**
       * To support Jest 28 we need to check the version of Jest used in the project.
       * As process() and processAsync() methods of a custom transformer module cannot return a string anymore.
       * They must always return an object. See https://jestjs.io/docs/upgrading-to-jest28#transformer
       */
      const jestVersion = require('jest/package.json').version;

      if (semver.lte(jestVersion, '28.0.0')) {
        return result.code;
      }

      return {
        code: result.code,
      };
    }

    return src;
  },
};

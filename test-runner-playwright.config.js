// !!! This file is used as an override to the test-runner configuration for this repo only !!!
// If you want to create your own override for your project, run test-storybook eject instead
const path = require('path');
// we override the path here so that when running the test-runner locally, it resolves to local files instead when calling require.resolve
process.env.STORYBOOK_TEST_RUNNER_PATH = path.resolve(__dirname);

const { defineConfig } = require('./dist');

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
const config = defineConfig({});

module.exports = config;

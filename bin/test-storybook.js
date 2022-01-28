#!/usr/bin/env node
//@ts-check
'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const { transformPlaywrightJson } = require('../dist/cjs/playwright/transformPlaywrightJson');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

// Clean up tmp files globally in case of control-c
let storiesJsonTmpDir;
const cleanup = () => {
  if (storiesJsonTmpDir) {
    console.log(`[test-storybook] Cleaning up ${storiesJsonTmpDir}`);
    fs.rmSync(storiesJsonTmpDir, { recursive: true, force: true });
  }
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('beforeExit', cleanup);

function sanitizeURL(url) {
  let finalURL = url;
  // prepend URL protocol if not there
  if (finalURL.indexOf('http://') === -1 && finalURL.indexOf('https://') === -1) {
    finalURL = 'http://' + finalURL;
  }

  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, '');

  // add forward slash at the end if not there
  if (finalURL.slice(-1) !== '/') {
    finalURL = finalURL + '/';
  }

  return finalURL;
}

async function executeJestPlaywright(args) {
  const jest = require('jest');
  let argv = args.slice(2);

  const jestConfigPath = fs.existsSync('test-runner-jest.config.js')
    ? 'test-runner-jest.config.js'
    : path.resolve(__dirname, '../playwright/test-runner-jest.config.js');

  argv.push('--config', jestConfigPath);

  await jest.run(argv);
}

async function checkStorybook(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.status !== 200) throw new Error(`Unxpected status: ${res.status}`);
  } catch (e) {
    console.error(
      `[test-storybook] It seems that your Storybook instance is not running at: ${url}. Are you sure it's running?`
    );
    process.exit(1);
  }
}

async function fetchStoriesJson(url) {
  const storiesJsonUrl = new URL('stories.json', url).toString();
  let tmpDir;
  try {
    const res = await fetch(storiesJsonUrl);
    const json = await res.text();
    const titleIdToTest = transformPlaywrightJson(json);

    tmpDir = tempy.directory();
    Object.entries(titleIdToTest).forEach(([titleId, test]) => {
      const tmpFile = path.join(tmpDir, `${titleId}.test.js`);
      fs.writeFileSync(tmpFile, test);
    });
  } catch (err) {
    console.error(`[test-storybook] Failed to fetch stories.json from ${storiesJsonUrl}`);
    console.error(
      'More info: https://github.com/storybookjs/test-runner/blob/main/README.md#storiesjson-mode\n'
    );
    console.error(err);
    process.exit(1);
  }
  return tmpDir;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  const targetURL = sanitizeURL(process.env.TARGET_URL || `http://localhost:6006`);
  await checkStorybook(targetURL);
  let args = process.argv.filter((arg) => arg !== '--stories-json');

  if (args.length !== process.argv.length) {
    storiesJsonTmpDir = await fetchStoriesJson(targetURL);
    process.env.TEST_ROOT = storiesJsonTmpDir;
    process.env.TEST_MATCH = '**/*.test.js';
  }

  await executeJestPlaywright(args);
};

main().catch((e) => console.log(`[test-storybook] ${e}`));

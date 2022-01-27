#!/usr/bin/env node
//@ts-check
'use strict';

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const tempy = require('tempy');
const { transformPlaywrightJson } = require('../dist/cjs/playwright/transformPlaywrightJson');

const STORIES_JSON_TEST_JS = 'stories-json.test.js';

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
  let tmpFile;
  try {
    const res = await fetch(storiesJsonUrl);
    const tmpDir = tempy.directory();
    tmpFile = path.join(tmpDir, 'stories-json.test.js');
    const json = await res.text();
    const js = transformPlaywrightJson(json);
    fs.writeFileSync(tmpFile, js);
  } catch (err) {
    console.error(`[test-storybook] Failed to fetch stories.json from ${storiesJsonUrl}.`);
    process.exit(1);
  }
  return tmpFile;
}

const main = async () => {
  const targetURL = sanitizeURL(process.env.TARGET_URL || `http://localhost:6006`);
  await checkStorybook(targetURL);
  let args = process.argv.filter((arg) => arg !== '--stories-json');
  let testFile;
  if (args.length !== process.argv.length) {
    testFile = await fetchStoriesJson(targetURL);
    process.env.TEST_ROOT = path.dirname(testFile);
    process.env.TEST_MATCH = '**/*.test.js';
  }

  await executeJestPlaywright(args);

  if (testFile) {
    fs.rmSync(testFile);
    fs.rmdirSync(path.dirname(testFile));
  }
};

main().catch((e) => console.log(`[test-storybook] ${e}`));

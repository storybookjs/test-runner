#!/usr/bin/env node
//@ts-check
'use strict';

const urlExists = require('url-exists');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

function sanitizeURL(url) {
  let finalURL = url
  // prepend URL protocol if not there
  if (finalURL.indexOf("http://") === -1 && finalURL.indexOf("https://") === -1) {
    finalURL = 'http://' + finalURL;
  }

  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, "");

  // add forward slash at the end if not there
  if (finalURL.slice(-1) !== '/') {
    finalURL = finalURL + '/';
  }

  return finalURL;
}

const port = process.env.STORYBOOK_PORT || '6006';
const targetURL = sanitizeURL(process.env.TARGET_URL || `http://localhost:${port}`);

urlExists(targetURL, function (err, exists) {
  if (!exists) {
    console.error(`[test-storybook] It seems that your Storybook instance is not running at: ${targetURL}. Are you sure it's running?`)
    process.exit(1)
  }

  executeJestPlaywright()
});

function executeJestPlaywright() {
  const fs = require('fs');
  const path = require('path');

  const jest = require('jest');
  let argv = process.argv.slice(2);

  const jestConfigPath = fs.existsSync('test-runner-jest.config.js')
    ? 'test-runner-jest.config.js'
    : path.resolve(__dirname, '../test-runner-jest.config.js')

  argv.push(
    '--config',
    jestConfigPath
  );

  jest.run(argv);
}

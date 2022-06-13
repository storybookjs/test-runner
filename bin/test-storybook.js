#!/usr/bin/env node
//@ts-check
'use strict';

const { execSync } = require('child_process');
const fetch = require('node-fetch');
const isLocalhostIp = require('is-localhost-ip');
const fs = require('fs');
const dedent = require('ts-dedent').default;
const path = require('path');
const tempy = require('tempy');
const semver = require('semver');
const { getCliOptions, getStorybookMetadata } = require('../dist/cjs/util');
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

const log = (message) => console.log(`[test-storybook] ${message}`);
const error = (message) => console.error(`[test-storybook] ${message}`);

// Clean up tmp files globally in case of control-c
let storiesJsonTmpDir;
const cleanup = () => {
  if (storiesJsonTmpDir) {
    log(`Cleaning up ${storiesJsonTmpDir}`);
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

const checkForIncompatibilities = () => {
  try {
    const jestVersion = require('jest/package.json').version
    if (semver.gte(jestVersion, '28.0.0')) {
      error(dedent`We detected that your project is using Jest 28.0.0 or higher, which is currently incompatible with the test runner.
      
      You can find more info at: https://github.com/storybookjs/test-runner#errors-with-jest-28
      `)
      process.exit(1)
    }
  } catch (err) {
    error('We detected that Jest is not installed in your project. Please install it and run test-storybook again.')
    process.exit(1)
  }
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

async function printCoverageReport() {
  // --skip-full in case we only want to show not fully covered code
  // --check-coverage if we want to break if coverage reaches certain threshold
  // idea: pass configuration object for thresholds https://www.npmjs.com/package/nyc#coverage-thresholds
  execSync('npx nyc report', { stdio: 'inherit' })
  log('For a better, interactive summary of coverage, run: \nnpx nyc report --reporter=lcov\n')
}

async function checkStorybook(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.status !== 200) throw new Error(`Unxpected status: ${res.status}`);
  } catch (e) {
    console.error(
      dedent`[test-storybook] It seems that your Storybook instance is not running at: ${url}. Are you sure it's running?
      
      If you're not running Storybook on the default 6006 port or want to run the tests against any custom URL, you can pass the --url flag like so:
      
      yarn test-storybook --url http://localhost:9009
      
      More info at https://github.com/storybookjs/test-runner#getting-started`
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
    console.error(`Failed to fetch stories.json from ${storiesJsonUrl}`);
    console.error(
      'More info: https://github.com/storybookjs/test-runner/blob/main/README.md#storiesjson-mode\n'
    );
    console.error(err);
    process.exit(1);
  }
  return tmpDir;
}

function ejectConfiguration() {
  const origin = path.resolve(__dirname, '../playwright/test-runner-jest.config.js');
  const destination = path.resolve('test-runner-jest.config.js');
  const fileAlreadyExists = fs.existsSync(destination);

  if (fileAlreadyExists) {
    throw new Error(dedent`Found existing file at:
    
    ${destination}
    
    Please delete it and rerun this command.
    \n`);
  }

  fs.copyFileSync(origin, destination);
  log('Configuration file successfully copied as test-runner-jest.config.js');
}

const main = async () => {
  checkForIncompatibilities();

  const { jestOptions, runnerOptions } = getCliOptions();

  if (runnerOptions.eject) {
    ejectConfiguration();
    process.exit(0);
  }

  const targetURL = sanitizeURL(process.env.TARGET_URL || runnerOptions.url);
  await checkStorybook(targetURL);

  process.env.TARGET_URL = targetURL;

  if (runnerOptions.coverage) {
    process.env.STORYBOOK_COLLECT_COVERAGE = 'true';
  }

  if (process.env.REFERENCE_URL) {
    process.env.REFERENCE_URL = sanitizeURL(process.env.REFERENCE_URL);
  }

  // Use TEST_BROWSERS if set, otherwise get from --browser option
  if (!process.env.TEST_BROWSERS && runnerOptions.browsers) {
    process.env.TEST_BROWSERS = runnerOptions.browsers.join(',');
  }
  const { hostname } = new URL(targetURL);

  const isLocalStorybookIp = await isLocalhostIp(hostname, true);
  const shouldRunStoriesJson = runnerOptions.storiesJson !== false && !isLocalStorybookIp;
  if (shouldRunStoriesJson) {
    log(
      'Detected a remote Storybook URL, running in stories json mode. To disable this, run the command again with --no-stories-json'
    );
  }

  if (runnerOptions.storiesJson || shouldRunStoriesJson) {
    storiesJsonTmpDir = await fetchStoriesJson(targetURL);
    process.env.TEST_ROOT = storiesJsonTmpDir;
    process.env.TEST_MATCH = '**/*.test.js';
  }

  process.env.STORYBOOK_CONFIG_DIR = runnerOptions.configDir;

  const { storiesPaths, lazyCompilation } = getStorybookMetadata();
  process.env.STORYBOOK_STORIES_PATTERN = storiesPaths;

  if (lazyCompilation && isLocalStorybookIp) {
    log(
      `You're running Storybook with lazy compilation enabled, and will likely cause issues with the test runner locally. Consider disabling 'lazyCompilation' in ${runnerOptions.configDir}/main.js when running 'test-storybook' locally.`
    );
  }

  await executeJestPlaywright(jestOptions);

  if (process.env.STORYBOOK_COLLECT_COVERAGE === 'true') {
    printCoverageReport();
  }
};

main().catch((e) => log(e));

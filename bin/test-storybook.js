#!/usr/bin/env node
//@ts-check
'use strict';

const { execSync } = require('child_process');
const fetch = require('node-fetch');
const canBindToHost = require('can-bind-to-host').default;
const fs = require('fs');
const dedent = require('ts-dedent').default;
const path = require('path');
const tempy = require('tempy');
const { getCliOptions } = require('../src/util/getCliOptions');
const { getStorybookMetadata } = require('../src/util/getStorybookMetadata');
const { transformPlaywrightJson } = require('../src/playwright/transformPlaywrightJson');

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.STORYBOOK_TEST_RUNNER = 'true';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const log = (message) => console.log(`[test-storybook] ${message}`);
const error = (err) => {
  if (err instanceof Error) {
    console.error(`\x1b[31m[test-storybook]\x1b[0m ${err.message} \n\n${err.stack}`);
  } else {
    console.error(`\x1b[31m[test-storybook]\x1b[0m ${err}`);
  }
};

// Clean up tmp files globally in case of control-c
let indexTmpDir;
const cleanup = () => {
  if (indexTmpDir) {
    log(`Cleaning up ${indexTmpDir}`);
    fs.rmSync(indexTmpDir, { recursive: true, force: true });
  }
};

let isWatchMode = false;
async function reportCoverage() {
  if (isWatchMode || process.env.STORYBOOK_COLLECT_COVERAGE !== 'true') {
    return;
  }

  const coverageFolderE2E = path.resolve(process.cwd(), '.nyc_output');
  const coverageFolder = path.resolve(process.cwd(), 'coverage/storybook');

  // in case something goes wrong and .nyc_output does not exist, bail
  if (!fs.existsSync(coverageFolderE2E)) {
    return;
  }

  // if there's no coverage folder, create one
  if (!fs.existsSync(coverageFolder)) {
    fs.mkdirSync(coverageFolder, { recursive: true });
  }

  // move the coverage files from .nyc_output folder (coming from jest-playwright) to coverage, then delete .nyc_output
  fs.renameSync(`${coverageFolderE2E}/coverage.json`, `${coverageFolder}/coverage-storybook.json`);
  fs.rmSync(coverageFolderE2E, { recursive: true });

  // --skip-full in case we only want to show not fully covered code
  // --check-coverage if we want to break if coverage reaches certain threshold
  // .nycrc will be respected for thresholds etc. https://www.npmjs.com/package/nyc#coverage-thresholds
  execSync(`npx nyc report --reporter=text -t ${coverageFolder} --report-dir ${coverageFolder}`, {
    stdio: 'inherit',
  });
}

const onProcessEnd = () => {
  cleanup();
  reportCoverage();
};

process.on('SIGINT', onProcessEnd);
process.on('exit', onProcessEnd);

function sanitizeURL(url) {
  let finalURL = url;
  // prepend URL protocol if not there
  if (finalURL.indexOf('http://') === -1 && finalURL.indexOf('https://') === -1) {
    finalURL = 'http://' + finalURL;
  }

  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, '');

  // remove index.html if present
  finalURL = finalURL.replace(/index.html\s*$/, '');

  // add forward slash at the end if not there
  if (finalURL.slice(-1) !== '/') {
    finalURL = finalURL + '/';
  }

  return finalURL;
}

async function executeJestPlaywright(args) {
  // Always prefer jest installed via the test runner. If it's hoisted, it will get it from root node_modules
  const jestPath = path.dirname(
    require.resolve('jest', {
      paths: [path.join(__dirname, '../@storybook/test-runner/node_modules')],
    })
  );
  const jest = require(jestPath);
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
      dedent`\x1b[31m[test-storybook]\x1b[0m It seems that your Storybook instance is not running at: ${url}. Are you sure it's running?
      
      If you're not running Storybook on the default 6006 port or want to run the tests against any custom URL, you can pass the --url flag like so:
      
      yarn test-storybook --url http://localhost:9009
      
      More info at https://github.com/storybookjs/test-runner#getting-started`
    );
    process.exit(1);
  }
}

async function getIndexJson(url) {
  const indexJsonUrl = new URL('index.json', url).toString();
  const storiesJsonUrl = new URL('stories.json', url).toString();

  const [indexRes, storiesRes] = await Promise.all([fetch(indexJsonUrl), fetch(storiesJsonUrl)]);

  if (indexRes.ok) {
    try {
      const json = await indexRes.text();
      return JSON.parse(json);
    } catch (err) {}
  }

  if (storiesRes.ok) {
    try {
      const json = await storiesRes.text();
      return JSON.parse(json);
    } catch (err) {}
  }

  throw new Error(dedent`
    Failed to fetch index data from the project.

    Make sure that either of these URLs are available with valid data in your Storybook:
    ${
      // TODO: switch order once index.json becomes more common than stories.json
      storiesJsonUrl
    }
    ${indexJsonUrl}

    More info: https://github.com/storybookjs/test-runner/blob/main/README.md#indexjson-mode
  `);
}

async function getIndexTempDir(url) {
  let tmpDir;
  try {
    const indexJson = await getIndexJson(url);
    const titleIdToTest = transformPlaywrightJson(indexJson);

    tmpDir = tempy.directory();
    Object.entries(titleIdToTest).forEach(([titleId, test]) => {
      const tmpFile = path.join(tmpDir, `${titleId}.test.js`);
      fs.writeFileSync(tmpFile, test);
    });
  } catch (err) {
    error(err);
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
  const { jestOptions, runnerOptions } = getCliOptions();

  if (runnerOptions.eject) {
    ejectConfiguration();
    process.exit(0);
  }

  // set this flag to skip reporting coverage in watch mode
  isWatchMode = jestOptions.watch || jestOptions.watchAll;

  const rawTargetURL = process.env.TARGET_URL || runnerOptions.url || 'http://localhost:6006';
  await checkStorybook(rawTargetURL);

  const targetURL = sanitizeURL(rawTargetURL);

  process.env.TARGET_URL = targetURL;

  if (runnerOptions.coverage) {
    process.env.STORYBOOK_COLLECT_COVERAGE = 'true';
  }

  if (runnerOptions.junit) {
    process.env.STORYBOOK_JUNIT = 'true';
  }

  if (process.env.REFERENCE_URL) {
    process.env.REFERENCE_URL = sanitizeURL(process.env.REFERENCE_URL);
  }

  // Use TEST_BROWSERS if set, otherwise get from --browser option
  if (!process.env.TEST_BROWSERS && runnerOptions.browsers) {
    process.env.TEST_BROWSERS = runnerOptions.browsers.join(',');
  }
  const { hostname } = new URL(targetURL);

  const isLocalStorybookIp = await canBindToHost(hostname);
  const shouldRunIndexJson = runnerOptions.indexJson !== false && !isLocalStorybookIp;
  if (shouldRunIndexJson) {
    log(
      'Detected a remote Storybook URL, running in index json mode. To disable this, run the command again with --no-index-json\n'
    );
  }

  if (runnerOptions.indexJson || shouldRunIndexJson) {
    indexTmpDir = await getIndexTempDir(targetURL);
    process.env.TEST_ROOT = indexTmpDir;
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
};

main().catch((e) => {
  error(e);
  process.exit(1);
});

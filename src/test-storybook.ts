#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import fetch from 'node-fetch';
import canBindToHost from 'can-bind-to-host';
import dedent from 'ts-dedent';
import path, { join, resolve } from 'path';
import tempy from 'tempy';
import { readConfig } from 'storybook/internal/csf-tools';
import { telemetry } from 'storybook/internal/telemetry';
import { glob } from 'glob';

import { JestOptions, getCliOptions } from './util/getCliOptions';
import { getStorybookMetadata } from './util/getStorybookMetadata';
import { getTestRunnerConfig } from './util/getTestRunnerConfig';
import { transformPlaywrightJson } from './playwright/transformPlaywrightJson';
import { TestRunnerConfig } from './playwright/hooks';
import { getInterpretedFile } from './util/serverRequire';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.STORYBOOK_TEST_RUNNER = 'true';
process.env.PUBLIC_URL = '';

let getHttpHeaders = (_url: string) => Promise.resolve({});

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const log = (message: string) => console.log(`[test-storybook] ${message}`);
const warn = (message: string) => console.warn('\x1b[33m%s\x1b[0m', `[test-storybook] ${message}`);
const error = (err: Error) => {
  console.error(`\x1b[31m[test-storybook]\x1b[0m ${err.message} \n\n${err.stack}`);
};

// Clean up tmp files globally in case of control-c
let indexTmpDir: fs.PathLike;
const cleanup = () => {
  if (indexTmpDir) {
    log(`Cleaning up ${indexTmpDir}`);
    fs.rmSync(indexTmpDir, { recursive: true, force: true });
  }
};

function getNycBinPath() {
  const nycPath = path.join(require.resolve('nyc/package.json'));
  const nycBin = require(nycPath).bin.nyc;
  const nycBinFullPath = path.join(path.dirname(nycPath), nycBin);
  return nycBinFullPath;
}

async function reportCoverage() {
  const coverageFolderE2E = path.resolve(process.cwd(), '.nyc_output');
  const coverageFolder = path.resolve(
    process.cwd(),
    process.env.STORYBOOK_COVERAGE_DIRECTORY ?? 'coverage/storybook'
  );

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
  if (process.env.JEST_SHARD !== 'true') {
    const nycBinFullPath = getNycBinPath();
    execSync(
      `node ${nycBinFullPath} report --reporter=text --reporter=lcov -t ${coverageFolder} --report-dir ${coverageFolder}`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      }
    );
  }
}

const onProcessEnd = () => {
  cleanup();
  if (process.env.STORYBOOK_COLLECT_COVERAGE === 'true') {
    reportCoverage();
  }
};

process.on('SIGINT', onProcessEnd);
process.on('exit', onProcessEnd);

function sanitizeURL(url: string) {
  let finalURL = url;
  // prepend URL protocol if not there
  if (finalURL.indexOf('http://') === -1 && finalURL.indexOf('https://') === -1) {
    finalURL = `http://${finalURL}`;
  }

  // remove iframe.html if present
  finalURL = finalURL.replace(/iframe.html\s*$/, '');

  // remove index.html if present
  finalURL = finalURL.replace(/index.html\s*$/, '');

  // add forward slash at the end if not there
  if (!finalURL.endsWith('/')) {
    finalURL = `${finalURL}/`;
  }

  return finalURL;
}

async function executeJestPlaywright(args: JestOptions) {
  // Always prefer jest installed via the test runner. If it's hoisted, it will get it from root node_modules
  const jestPath = path.dirname(
    require.resolve('jest', {
      paths: [path.join(__dirname, '../@storybook/test-runner/node_modules')],
    })
  );
  const jest = require(jestPath);
  const argv = args.slice(2);

  // jest configs could either come in the root dir, or inside of the Storybook config dir
  const configDir = process.env.STORYBOOK_CONFIG_DIR ?? '';
  const [userDefinedJestConfig] = (
    await Promise.all([
      glob(path.join(configDir, 'test-runner-jest*'), { windowsPathsNoEscape: true }),
      glob(path.join('test-runner-jest*'), { windowsPathsNoEscape: true }),
    ])
  ).reduce((a, b) => a.concat(b), []);

  const jestConfigPath =
    userDefinedJestConfig ||
    path.resolve(__dirname, path.join('..', 'playwright', 'test-runner-jest.config.js'));

  argv.push('--config', jestConfigPath);

  await jest.run(argv);
}

async function checkStorybook(url: string) {
  try {
    const headers = await getHttpHeaders(url);
    const res = await fetch(url, { method: 'GET', headers });
    if (res.status !== 200) throw new Error(`Unxpected status: ${res.status}`);
  } catch (e) {
    console.error(
      dedent`\x1b[31m[test-storybook]\x1b[0m It seems that your Storybook instance is not running at: ${url}. Are you sure it's running?
      
      If you're not running Storybook on the default 6006 port or want to run the tests against any custom URL, you can pass the --url flag like so:
      
      yarn test-storybook --url http://127.0.0.1:9009
      
      More info at https://github.com/storybookjs/test-runner#getting-started`
    );
    process.exit(1);
  }
}

async function getIndexJson(url: string) {
  const indexJsonUrl = new URL('index.json', url).toString();
  const storiesJsonUrl = new URL('stories.json', url).toString();
  const headers = await getHttpHeaders(url);
  const fetchOptions = { headers };

  const [indexRes, storiesRes] = await Promise.all([
    fetch(indexJsonUrl, fetchOptions),
    fetch(storiesJsonUrl, fetchOptions),
  ]);

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

async function getIndexTempDir(url: string) {
  let tmpDir: string;
  try {
    const indexJson = await getIndexJson(url);
    const titleIdToTest = transformPlaywrightJson(indexJson);

    tmpDir = tempy.directory();
    for (const [titleId, test] of Object.entries(titleIdToTest)) {
      const tmpFile = path.join(tmpDir, `${titleId}.test.js`);
      fs.writeFileSync(tmpFile, test);
    }
  } catch (err) {
    if (err instanceof Error) {
      error(err);
    } else {
      error(new Error(JSON.stringify(err)));
    }

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

  // copy contents of origin and replace ../dist with @storybook/test-runner
  const content = fs.readFileSync(origin, 'utf-8').replace(/..\/dist/g, '@storybook/test-runner');
  fs.writeFileSync(destination, content);
  log(`Configuration file successfully generated at ${destination}`);
}

function warnOnce(message: string) {
  let warned = false;
  return () => {
    if (!warned) {
      // here we specify the ansi code for yellow as jest is stripping the default color from console.warn
      warn(message);
      warned = true;
    }
  };
}

const extractTagsFromPreview = async (configDir = '.storybook') => {
  const previewConfigPath = getInterpretedFile(join(resolve(configDir), 'preview'));

  if (!previewConfigPath) return [];
  const previewConfig = await readConfig(previewConfigPath);
  const tags = previewConfig.getFieldValue(['tags']) ?? [];

  return tags.join(',');
};

const main = async () => {
  const { jestOptions, runnerOptions } = getCliOptions();

  if (runnerOptions.eject) {
    ejectConfiguration();
    process.exit(0);
  }

  process.env.STORYBOOK_CONFIG_DIR = runnerOptions.configDir;

  const testRunnerConfig = getTestRunnerConfig(runnerOptions.configDir) ?? ({} as TestRunnerConfig);

  if (testRunnerConfig.preVisit && testRunnerConfig.preRender) {
    throw new Error(
      'You cannot use both preVisit and preRender hooks in your test-runner config file. Please use preVisit instead.'
    );
  }

  if (testRunnerConfig.postVisit && testRunnerConfig.postRender) {
    throw new Error(
      'You cannot use both postVisit and postRender hooks in your test-runner config file. Please use postVisit instead.'
    );
  }

  // TODO: remove preRender and postRender hooks likely in 0.20.0
  if (testRunnerConfig.preRender) {
    warnOnce(
      'The "preRender" hook is deprecated and will be removed in later versions. Please use "preVisit" instead in your test-runner config file.'
    )();
  }
  if (testRunnerConfig.postRender) {
    warnOnce(
      'The "postRender" hook is deprecated and will be removed in later versions. Please use "postVisit" instead in your test-runner config file.'
    )();
  }

  if (testRunnerConfig.getHttpHeaders) {
    getHttpHeaders = testRunnerConfig.getHttpHeaders;
  }

  // set this flag to skip reporting coverage in watch mode
  const isWatchMode = jestOptions.includes('--watch') || jestOptions.includes('--watchAll');

  const rawTargetURL = process.env.TARGET_URL ?? runnerOptions.url ?? 'http://127.0.0.1:6006';
  await checkStorybook(rawTargetURL);

  const targetURL = sanitizeURL(rawTargetURL);

  process.env.TARGET_URL = targetURL;

  if (!isWatchMode && runnerOptions.coverage) {
    process.env.STORYBOOK_COLLECT_COVERAGE = 'true';
  }

  if (runnerOptions.includeTags) {
    process.env.STORYBOOK_INCLUDE_TAGS = runnerOptions.includeTags;
  }

  if (runnerOptions.excludeTags) {
    process.env.STORYBOOK_EXCLUDE_TAGS = runnerOptions.excludeTags;
  }

  if (runnerOptions.skipTags) {
    process.env.STORYBOOK_SKIP_TAGS = runnerOptions.skipTags;
  }

  if (runnerOptions.coverageDirectory) {
    process.env.STORYBOOK_COVERAGE_DIRECTORY = runnerOptions.coverageDirectory;
  }

  if (runnerOptions.junit) {
    process.env.STORYBOOK_JUNIT = 'true';
  }

  if (process.env.REFERENCE_URL) {
    process.env.REFERENCE_URL = sanitizeURL(process.env.REFERENCE_URL);
  }

  if (jestOptions.includes('--shard')) {
    process.env.JEST_SHARD = 'true';
  }

  // Use TEST_BROWSERS if set, otherwise get from --browser option
  if (!process.env.TEST_BROWSERS && runnerOptions.browsers) {
    if (Array.isArray(runnerOptions.browsers))
      process.env.TEST_BROWSERS = runnerOptions.browsers.join(',');
    else process.env.TEST_BROWSERS = runnerOptions.browsers;
  }
  const { hostname } = new URL(targetURL);

  const isLocalStorybookIp = await canBindToHost(hostname);
  const shouldRunIndexJson =
    runnerOptions.indexJson === true || (runnerOptions.indexJson !== false && !isLocalStorybookIp);
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

  const { storiesPaths, lazyCompilation, disableTelemetry, enableCrashReports } =
    getStorybookMetadata();
  if (!shouldRunIndexJson) {
    process.env.STORYBOOK_STORIES_PATTERN = storiesPaths;

    // 1 - We extract tags from preview file statically like it's done by the Storybook indexer. We only do this in non-index-json mode because it's not needed in that mode
    // 2 - We pass it via env variable to avoid having to use async code in the babel plugin
    process.env.STORYBOOK_PREVIEW_TAGS = await extractTagsFromPreview(runnerOptions.configDir);

    if (lazyCompilation && isLocalStorybookIp) {
      log(
        `You're running Storybook with lazy compilation enabled, and will likely cause issues with the test runner locally. Consider disabling 'lazyCompilation' in ${runnerOptions.configDir}/main.js when running 'test-storybook' locally.`
      );
    }
  }

  if (runnerOptions.failOnConsole) {
    process.env.TEST_CHECK_CONSOLE = 'true';
  }

  if (!disableTelemetry && !runnerOptions.disableTelemetry) {
    // NOTE: we start telemetry immediately but do not wait on it. Typically it should complete
    // before the tests do. If not we may miss the event, we are OK with that.
    telemetry(
      'test-run',
      {
        runner: 'test-runner',
        watch: jestOptions.includes('--watch'),
      },
      {
        configDir: runnerOptions.configDir,
        enableCrashReports,
      }
    );
  }

  await executeJestPlaywright(jestOptions);
};

main().catch((e) => {
  error(e);
  process.exit(1);
});

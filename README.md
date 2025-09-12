<h1>Storybook Test Runner</h1>

Storybook test runner turns all of your stories into executable tests.

<h2>Table of Contents</h2>

- [Features](#features)
- [How it works](#how-it-works)
- [Storybook compatibility](#storybook-compatibility)
- [Getting started](#getting-started)
- [CLI Options](#cli-options)
- [Ejecting configuration](#ejecting-configuration)
  - [Jest-playwright options](#jest-playwright-options)
  - [Jest options](#jest-options)
- [Filtering tests (experimental)](#filtering-tests-experimental)
- [Test reporters](#test-reporters)
- [Running against a deployed Storybook](#running-against-a-deployed-storybook)
  - [Index.json mode](#indexjson-mode)
- [Running in CI](#running-in-ci)
  - [1. Running against deployed Storybooks on Github Actions deployment](#1-running-against-deployed-storybooks-on-github-actions-deployment)
  - [2. Running against locally built Storybooks in CI](#2-running-against-locally-built-storybooks-in-ci)
- [Setting up code coverage](#setting-up-code-coverage)
  - [1 - Instrument the code](#1---instrument-the-code)
    - [Using @storybook/addon-coverage](#using-storybookaddon-coverage)
    - [Manually configuring istanbul](#manually-configuring-istanbul)
  - [2 - Run tests with --coverage flag](#2---run-tests-with---coverage-flag)
  - [3 - Merging code coverage with coverage from other tools](#3---merging-code-coverage-with-coverage-from-other-tools)
  - [4 - Run tests with --shard flag](#4---run-tests-with---shard-flag)
- [Test hooks API](#test-hooks-api)
  - [setup](#setup)
  - [preRender (deprecated)](#prerender-deprecated)
  - [preVisit](#previsit)
  - [postRender (deprecated)](#postrender-deprecated)
  - [postVisit](#postvisit)
  - [Render lifecycle](#render-lifecycle)
  - [prepare](#prepare)
  - [getHttpHeaders](#gethttpheaders)
  - [tags (experimental)](#tags-experimental)
  - [logLevel](#loglevel)
  - [errorMessageFormatter](#errormessageformatter)
  - [Utility functions](#utility-functions)
    - [getStoryContext](#getstorycontext)
    - [waitForPageReady](#waitforpageready)
    - [StorybookTestRunner user agent](#storybooktestrunner-user-agent)
- [Recipes](#recipes)
  - [Preconfiguring viewport size](#preconfiguring-viewport-size)
  - [Accessibility testing](#accessibility-testing)
    - [With Storybook 9](#with-storybook-9)
    - [With Storybook 8](#with-storybook-8)
  - [DOM snapshot (HTML)](#dom-snapshot-html)
  - [Image snapshot](#image-snapshot)
- [Troubleshooting](#troubleshooting)
  - [Yarn PnP (Plug n' Play) support](#yarn-pnp-plug-n-play-support)
  - [React Native support](#react-native-support)
  - [The error output in the CLI is too short](#the-error-output-in-the-cli-is-too-short)
  - [The test runner seems flaky and keeps timing out](#the-test-runner-seems-flaky-and-keeps-timing-out)
  - [The test runner reports "No tests found" running on a Windows CI](#the-test-runner-reports-no-tests-found-running-on-a-windows-ci)
  - [Adding the test runner to other CI environments](#adding-the-test-runner-to-other-ci-environments)
  - [Merging test coverage results in wrong coverage](#merging-test-coverage-results-in-wrong-coverage)
- [Future work](#future-work)
- [Contributing](#contributing)

## Features

- ⚡️ Zero config setup
- 💨 Smoke test all stories
- ▶️ Test stories with play functions
- 🏃 Test your stories in parallel in a headless browser
- 👷 Get feedback from error with a link directly to the story
- 🐛 Debug them visually and interactively in a live browser with [addon-interactions](https://storybook.js.org/docs/react/essentials/interactions)
- 🎭 Powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/)
- 👀 Watch mode, filters, and the conveniences you'd expect
- 📔 Code coverage reports

## How it works

See the announcement of Interaction Testing with Storybook in detail in [this blog post](https://storybook.js.org/blog/interaction-testing-with-storybook/) or watch [this video](https://www.youtube.com/watch?v=Ex52FHKyc7E&ab_channel=Storybook) to see it in action.

The Storybook test runner uses Jest as a runner, and Playwright as a testing framework. Each one of your `.stories` files is transformed into a spec file, and each story becomes a test, which is run in a headless browser.

The test runner is simple in design – it just visits each story from a running Storybook instance and makes sure the component is not failing:

- For stories without a `play` function, it verifies whether the story rendered without any errors. This is essentially a smoke test.
- For those with a `play` function, it also checks for errors in the `play` function and that all assertions passed. This is essentially an [interaction test](https://storybook.js.org/docs/react/writing-tests/interaction-testing#write-an-interaction-test).

If there are any failures, the test runner will provide an output with the error, alongside with a link to the failing story, so you can see the error yourself and debug it directly in the browser:

![](.github/assets/click-to-debug.gif)

## Storybook compatibility

Use the following table to use the correct version of this package, based on the version of Storybook you're using:

| Test runner version | Storybook version |
| ------------------- | ----------------- |
| ^0.19.0             | ^8.2.0            |
| ~0.17.0             | ^8.0.0            |
| ~0.16.0             | ^7.0.0            |
| ~0.9.4              | ^6.4.0            |

## Getting started

1. Install the test runner:

```jsx
yarn add @storybook/test-runner -D
```

2. Add a `test-storybook` script to your package.json

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

3. Optionally, follow [the documentation](https://storybook.js.org/docs/react/writing-tests/interaction-testing#set-up-the-interactions-addon) for writing interaction tests and using [addon-interactions](https://storybook.js.org/addons/@storybook/addon-interactions/) to visualize the interactions with an interactive debugger in Storybook.

4. Run Storybook (the test runner runs against a running Storybook instance):

```jsx
yarn storybook
```

5. Run the test runner:

```jsx
yarn test-storybook
```

> [!Note]
> The runner assumes that your Storybook is running on port `6006`. If you're running Storybook in another port, either use --url or set the TARGET_URL before running your command like:
>
> ```jsx
> yarn test-storybook --url http://127.0.0.1:9009
> or
> TARGET_URL=http://127.0.0.1:9009 yarn test-storybook
> ```

## CLI Options

```plaintext
Usage: test-storybook [options]
```

| Options                           | Description                                                                                                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                          | Output usage information <br/>`test-storybook --help`                                                                                                                         |
| `-i`, `--index-json`              | Run in index json mode. Automatically detected (requires a compatible Storybook) <br/>`test-storybook --index-json`                                                           |
| `--no-index-json`                 | Disables index json mode <br/>`test-storybook --no-index-json`                                                                                                                |
| `-c`, `--config-dir [dir-name]`   | Directory where to load Storybook configurations from <br/>`test-storybook -c .storybook`                                                                                     |
| `--watch`                         | Watch files for changes and rerun tests related to changed files.<br/>`test-storybook --watch`                                                                                |
| `--watchAll`                      | Watch files for changes and rerun all tests when something changes.<br/>`test-storybook --watchAll`                                                                           |
| `--coverage`                      | Indicates that test coverage information should be collected and reported in the output <br/>`test-storybook --coverage`                                                      |
| `--coverageDirectory`             | Directory where to write coverage report output <br/>`test-storybook --coverage --coverageDirectory coverage/ui/storybook`                                                    |
| `--url`                           | Define the URL to run tests in. Useful for custom Storybook URLs <br/>`test-storybook --url http://the-storybook-url-here.com`                                                |
| `--browsers`                      | Define browsers to run tests in. One or multiple of: chromium, firefox, webkit <br/>`test-storybook --browsers firefox chromium`                                              |
| `--maxWorkers [amount]`           | Specifies the maximum number of workers the worker-pool will spawn for running tests <br/>`test-storybook --maxWorkers=2`                                                     |
| `--testTimeout [number]`          | This option sets the timeout of each test case <br/>`test-storybook --testTimeout=15000`                                                                                      |
| `--no-cache`                      | Disable the cache <br/>`test-storybook --no-cache`                                                                                                                            |
| `--clearCache`                    | Deletes the Jest cache directory and then exits without running tests <br/>`test-storybook --clearCache`                                                                      |
| `--verbose`                       | Display individual test results with the test suite hierarchy <br/>`test-storybook --verbose`                                                                                 |
| `-u`, `--updateSnapshot`          | Use this flag to re-record every snapshot that fails during this test run <br/>`test-storybook -u`                                                                            |
| `--eject`                         | Creates a local configuration file to override defaults of the test-runner <br/>`test-storybook --eject`                                                                      |
| `--json`                          | Prints the test results in JSON. This mode will send all other test output and user messages to stderr. <br/>`test-storybook --json`                                          |
| `--outputFile`                    | Write test results to a file when the --json option is also specified. <br/>`test-storybook --json --outputFile results.json`                                                 |
| `--junit`                         | Indicates that test information should be reported in a junit file. <br/>`test-storybook --**junit**`                                                                         |
| `--listTests`                     | Lists all test files that will be run, and exits<br/>`test-storybook --listTests`                                                                                             |
| `--ci`                            | Instead of the regular behavior of storing a new snapshot automatically, it will fail the test and require Jest to be run with `--updateSnapshot`. <br/>`test-storybook --ci` |
| `--shard [shardIndex/shardCount]` | Splits your test suite across different machines to run in CI. <br/>`test-storybook --shard=1/3`                                                                              |
| `--failOnConsole`                 | Makes tests fail on browser console errors<br/>`test-storybook --failOnConsole`                                                                                               |
| `--includeTags`                   | (experimental) Only test stories that match the specified tags, comma separated<br/>`test-storybook --includeTags="test-only"`                                                |
| `--excludeTags`                   | (experimental) Do not test stories that match the specified tags, comma separated<br/>`test-storybook --excludeTags="broken-story,todo"`                                      |
| `--skipTags`                      | (experimental) Do not test stories that match the specified tags and mark them as skipped in the CLI output, comma separated<br/>`test-storybook --skipTags="design"`         |
| `--disable-telemetry`             | Disable sending telemetry data<br/>`test-storybook --disable-telemetry`                                                                                                       |

## Ejecting configuration

The test runner is based on [Jest](https://jestjs.io/) and will accept most of the [CLI options](https://jestjs.io/docs/cli) that Jest does, like `--watch`, `--watchAll`, `--maxWorkers`, `--testTimeout`, etc. It works out of the box, but if you want better control over its configuration, you can eject its configuration by running `test-storybook --eject` to create a local `test-runner-jest.config.js` file in the root folder of your project. This file will be used by the test runner.

> [!Note]
> The `test-runner-jest.config.js` file can be placed inside of your Storybook config dir as well. If you pass the `--config-dir` option, the test-runner will look for the config file there as well.

The configuration file will accept options for two runners:

#### Jest-playwright options

The test runner uses [jest-playwright](https://github.com/playwright-community/jest-playwright) and you can pass [testEnvironmentOptions](https://github.com/playwright-community/jest-playwright#configuration) to further configure it.

#### Jest options

The Storybook test runner comes with Jest installed as an internal dependency. You can pass Jest options based on the version of Jest that comes with the test runner.

| Test runner version | Jest version       |
| ------------------- | ------------------ |
| ^0.6.2              | ^26.6.3 or ^27.0.0 |
| ^0.7.0              | ^28.0.0            |
| ^0.14.0             | ^29.0.0            |

> If you're already using a compatible version of Jest, the test runner will use it, instead of installing a duplicate version in your node_modules folder.

Here's an example of an ejected file used to extend the tests timeout from Jest:

```ts
// ./test-runner-jest.config.js
const { getJestConfig } = require('@storybook/test-runner');

const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  // The default Jest configuration comes from @storybook/test-runner
  ...testRunnerConfig,
  /** Add your own overrides below
   * @see https://jestjs.io/docs/configuration
   */
  testTimeout: 20000, // default timeout is 15s
};
```

## Filtering tests (experimental)

You might want to skip certain stories in the test-runner, run tests only against a subset of stories, or exclude certain stories entirely from your tests. This is possible via the `tags` annotation. By default, the test-runner includes every story with the `'test'` tag. This tag is included by default in Storybook 8 for all stories, unless the user tells otherwise via [tag negation](https://storybook.js.org/docs/writing-stories/tags#removing-tags).

This annotation can be part of a story, therefore only applying to that story, or the component meta (the default export), which applies to all stories in the file:

```ts
const meta = {
  component: Button,
  tags: ['atom'],
};
export default meta;

// will inherit tags from project and meta to be ['dev', 'test', 'atom']
export const Primary = {};

export const Secondary = {
  // will combine with project and meta tags to be ['dev', 'test', 'atom', 'design']
  tags: ['design'],
};

export const Tertiary = {
  // will combine with project and meta tags to be ['dev', 'atom']
  tags: ['!test'],
};
```

> [!Note]
> You can't import constants from another file and use them to define tags in your stories. The tags in your stories or meta **must be** defined inline, as an array of strings. This is a restriction due to Storybook's static analysis.

For more information on how tags combine (and can be selectively removed), please see the [official docs](https://storybook.js.org/docs/writing-stories/tags).

Once your stories have your own custom tags, you can filter them via the [tags property](#tags-experimental) in your test-runner configuration file. You can also use the CLI flags `--includeTags`, `--excludeTags` or `--skipTags` for the same purpose. The CLI flags will take precedence over the tags in the test-runner config, therefore overriding them.

Both `--skipTags` and `--excludeTags` will prevent a story from being tested. The difference is that skipped tests will appear as "skipped" in the cli output, whereas excluded tests will not appear at all. Skipped tests can be useful to indicate tests that are temporarily disabled.

## Test reporters

The test runner uses default Jest reporters, but you can add additional reporters by ejecting the configuration as explained above and overriding (or merging with) the `reporters` property.

Additionally, if you pass `--junit` to `test-storybook`, the test runner will add `jest-junit` to the reporters list and generate a test report in a JUnit XML format. You can further configure the behavior of `jest-junit` by either setting specific `JEST_JUNIT_*` environment variables or by defining a `jest-junit` field in your package.json with the options you want, which will be respected when generating the report. You can look at all available options here: https://github.com/jest-community/jest-junit#configuration

## Running against a deployed Storybook

By default, the test runner assumes that you're running it against a locally served Storybook on port 6006.
If you want to define a target url so it runs against deployed Storybooks, you can do so by passing the `TARGET_URL` environment variable:

```bash
TARGET_URL=https://the-storybook-url-here.com yarn test-storybook
```

Or by using the `--url` flag:

```bash
yarn test-storybook --url https://the-storybook-url-here.com
```

### Index.json mode

By default, the test runner transforms your story files into tests. It also supports a secondary "index.json mode" which runs directly against your Storybook's index data, which dependending on your Storybook version is located in a `stories.json` or `index.json`, a static index of all the stories.

This is particularly useful for running against a deployed storybook because `index.json` is guaranteed to be in sync with the Storybook you are testing. In the default, story file-based mode, your local story files may be out of sync – or you might not even have access to the source code.

Furthermore, it is not possible to run the test-runner directly against `.mdx` stories or custom CSF dialects like when writing Svelte native stories with [`addon-svelte-csf`](https://github.com/storybookjs/addon-svelte-csf). In these cases `index.json` mode must be used.

<!-- TODO: switch details to 6.4 once Storybook 7.0 becomes default -->

<details>
<summary>If you're using Storybook 7.0</summary>

To run in `index.json` mode, first make sure your Storybook has a v4 `index.json` file. You can find it when navigating to:

```
https://your-storybook-url-here.com/index.json
```

It should be a JSON file and the first key should be `"v": 4` followed by a key called `"entries"` containing a map of story IDs to JSON objects.

In Storybook 7.0, `index.json` is enabled by default, unless you are using the `storiesOf()` syntax, in which case it is not supported.

</details>

On Storybook 6.4 and 6.5, to run in `index.json` mode, first make sure your Storybook has a file called `stories.json` that has `"v": 3`, available at:

```
https://your-storybook-url-here.com/stories.json
```

If your Storybook does not have a `stories.json` file, you can generate one, provided:

- You are running Storybook 6.4 or above
- You are not using `storiesOf` stories

To enable `stories.json` in your Storybook, set the `buildStoriesJson` feature flag in `.storybook/main.js`:

```ts
// .storybook/main.ts
const config = {
  // ... rest of the config
  features: { buildStoriesJson: true },
};
export default config;
```

Once you have a valid `stories.json` file, your Storybook will be compatible with the "index.json mode".

By default, the test runner will detect whether your Storybook URL is local or remote, and if it is remote, it will run in "index.json mode" automatically. To disable it, you can pass the `--no-index-json` flag:

```bash
yarn test-storybook --no-index-json
```

If you are running tests against a local Storybook but for some reason want to run in "index.json mode", you can pass the `--index-json` flag:

```bash
yarn test-storybook --index-json
```

> [!Note]
> index.json mode is not compatible with watch mode.

## Running in CI

If you want to add the test-runner to CI, there are a couple of ways to do so:

### 1. Running against deployed Storybooks on Github Actions deployment

On Github actions, once services like Vercel, Netlify and others do deployment runs, they follow a pattern of emitting a `deployment_status` event containing the newly generated URL under `deployment_status.target_url`. You can use that URL and set it as `TARGET_URL` for the test-runner.

Here's an example of an action to run tests based on that:

```yml
name: Storybook Tests
on: deployment_status
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: yarn
      - name: Run Storybook tests
        run: yarn test-storybook
        env:
          TARGET_URL: '${{ github.event.deployment_status.target_url }}'
```

> [!Note]
> If you're running the test-runner against a `TARGET_URL` of a remotely deployed Storybook (e.g. Chromatic), make sure that the URL loads a publicly available Storybook. Does it load correctly when opened in incognito mode on your browser? If your deployed Storybook is private and has authentication layers, the test-runner will hit them and thus not be able to access your stories. If that is the case, use the next option instead.

### 2. Running against locally built Storybooks in CI

In order to build and run tests against your Storybook in CI, you might need to use a combination of commands involving the [concurrently](https://www.npmjs.com/package/concurrently), [http-server](https://www.npmjs.com/package/http-server) and [wait-on](https://www.npmjs.com/package/wait-on) libraries. Here's a recipe that does the following: Storybook is built and served locally, and once it is ready, the test runner will run against it.

```json
{
  "test-storybook:ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"yarn build-storybook --quiet && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && yarn test-storybook\""
}
```

And then you can essentially run `test-storybook:ci` in your CI:

```yml
name: Storybook Tests
on: push
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18.x'
      - name: Install dependencies
        run: yarn
      - name: Run Storybook tests
        run: yarn test-storybook:ci
```

> [!Note]
> Building Storybook locally makes it simple to test Storybooks that could be available remotely, but are under authentication layers. If you also deploy your Storybooks somewhere (e.g. Chromatic, Vercel, etc.), the Storybook URL can still be useful with the test-runner. You can pass it to the `REFERENCE_URL` environment variable when running the test-storybook command, and if a story fails, the test-runner will provide a helpful message with the link to the story in your published Storybook instead.

## Setting up code coverage

The test runner supports code coverage with the `--coverage` flag or `STORYBOOK_COLLECT_COVERAGE` environment variable. The pre-requisite is that your components are instrumented using [istanbul](https://istanbul.js.org/).

### 1 - Instrument the code

Instrumenting the code is an important step, which allows lines of code to be tracked by Storybook. This is normally achieved by using instrumentation libraries such as the [Istanbul Babel plugin](https://github.com/istanbuljs/babel-plugin-istanbul), or its Vite counterpart. In Storybook, you can set up instrumentation in two different ways:

#### Using @storybook/addon-coverage

For select frameworks (React, Preact, HTML, Web components, Svelte and Vue) you can use the [@storybook/addon-coverage](https://github.com/storybookjs/addon-coverage) addon, which will automatically configure the plugin for you.

Install `@storybook/addon-coverage`:

```sh
yarn add -D @storybook/addon-coverage
```

And register it in your `.storybook/main.js` file:

```ts
// .storybook/main.ts
const config = {
  // ...rest of your code here
  addons: ['@storybook/addon-coverage'],
};
export default config;
```

The addon has default options that might suffice for your project, and it accepts an [options object for project-specific configuration](https://github.com/storybookjs/addon-coverage#configuring-the-addon).

#### Manually configuring istanbul

If your framework does not use Babel or Vite, such as Angular, you will have to manually configure whatever flavor of [Istanbul](https://istanbul.js.org/) (Webpack loader, etc.) your project might require. Also, if your project uses Vue or Svelte, you will need to add one extra configuration for nyc.

You can find recipes in [this repository](https://github.com/yannbf/storybook-coverage-recipes) that include many different configurations and steps on how to set up coverage in each of them.

### 2 - Run tests with --coverage flag

After setting up instrumentation, run Storybook then run the test-runner with `--coverage`:

```sh
yarn test-storybook --coverage
```

The test runner will report the results in the CLI and generate a `coverage/storybook/coverage-storybook.json` file which can be used by `nyc`.

![](.github/assets/coverage-result.png)

> [!Note]
> If your components are not shown in the report and you're using Vue or Svelte, it's probably because you're missing a .nycrc.json file to specify the file extensions. Use the [recipes](https://github.com/yannbf/storybook-coverage-recipes) for reference on how to set that up.

If you want to generate coverage reports with [different reporters](https://istanbul.js.org/docs/advanced/alternative-reporters/), you can use `nyc` and point it to the folder which contains the Storybook coverage file. `nyc` is a dependency of the test runner so you will already have it in your project.

Here's an example generating an `lcov` report:

```
npx nyc report --reporter=lcov -t coverage/storybook --report-dir coverage/storybook
```

This will generate a more detailed, interactive coverage summary that you can access at `coverage/storybook/index.html` file which can be explored and will show the coverage in detail:

![](.github/assets/coverage-report-html.png)

The `nyc` command will respect [nyc configuration files](https://github.com/istanbuljs/nyc#common-configuration-options) if you have them in your project.

If you want certain parts of your code to be deliberately ignored, you can use istanbul [parsing hints](https://github.com/istanbuljs/nyc#parsing-hints-ignoring-lines).

### 3 - Merging code coverage with coverage from other tools

The test runner reports coverage related to the `coverage/storybook/coverage-storybook.json` file. This is by design, showing you the coverage which is tested while running Storybook.

Now, you might have other tests (e.g. unit tests) which are _not_ covered in Storybook but are covered when running tests with Jest, which you might also generate coverage files from, for instance. In such cases, if you are using tools like [Codecov](https://codecov.io/) to automate reporting, the coverage files will be detected automatically and if there are multiple files in the coverage folder, they will be merged automatically.

Alternatively, in case you want to merge coverages from other tools, you should:

1 - move or copy the `coverage/storybook/coverage-storybook.json` into `coverage/coverage-storybook.json`;
2 - run `nyc report` against the `coverage` folder.

Here's an example on how to achieve that:

```json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test-storybook:coverage": "test-storybook --coverage",
    "coverage-report": "cp coverage/storybook/coverage-storybook.json coverage/coverage-storybook.json && nyc report --reporter=html -t coverage --report-dir coverage"
  }
}
```

> [!Note]
> If your other tests (e.g. Jest) are using a different coverageProvider than `babel`, you will have issues when merging the coverage files. [More info here](#merging-test-coverage-results-in-wrong-coverage).

### 4 - Run tests with --shard flag

The test-runner collects all coverage in one file `coverage/storybook/coverage-storybook.json`. To split the coverage file you should rename it using the `shard-index`. To report the coverage you should merge the coverage files with the nyc merge command.

Github CI example:

```yml
test:
  name: Running Test-storybook (${{ matrix.shard }})
  strategy:
    matrix:
      shard: [1, 2, 3, 4]
  steps:
    - name: Testing storybook
      run: yarn test-storybook --coverage --shard=${{ matrix.shard }}/${{ strategy.job-total }}
    - name: Renaming coverage file
      run: mv coverage/storybook/coverage-storybook.json coverage/storybook/coverage-storybook-${matrix.shard}.json
report-coverage:
  name: Reporting storybook coverage
  steps:
    - name: Merging coverage
      run: yarn nyc merge coverage/storybook merged-output/merged-coverage.json
    - name: Report coverage
      run: yarn nyc report --reporter=text -t merged-output --report-dir merged-output
```

Circle CI example:

```yml
test:
  parallelism: 4
  steps:
    - run:
        command: yarn test-storybook --coverage --shard=$(expr $CIRCLE_NODE_INDEX + 1)/$CIRCLE_NODE_TOTAL
        command: mv coverage/storybook/coverage-storybook.json coverage/storybook/coverage-storybook-${CIRCLE_NODE_INDEX + 1}.json
report-coverage:
  steps:
    - run:
        command: yarn nyc merge coverage/storybook merged-output/merged-coverage.json
        command: yarn nyc report --reporter=text -t merged-output --report-dir merged-output
```

Gitlab CI example:

```yml
test:
  parallel: 4
  script:
    - yarn test-storybook --coverage --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
    - mv coverage/storybook/coverage-storybook.json coverage/storybook/coverage-storybook-${CI_NODE_INDEX}.json
report-coverage:
  script:
    - yarn nyc merge coverage/storybook merged-output/merged-coverage.json
    - yarn nyc report --reporter=text -t merged-output --report-dir merged-output
```

## Test hooks API

The test runner renders a story and executes its [play function](https://storybook.js.org/docs/react/writing-stories/play-function) if one exists. However, there are certain behaviors that are not possible to achieve via the play function, which executes in the browser. For example, if you want the test runner to take visual snapshots for you, this is something that is possible via Playwright/Jest, but must be executed in Node.

To enable use cases like visual or DOM snapshots, the test runner exports test hooks that can be overridden globally. These hooks give you access to the test lifecycle before and after the story is rendered.

There are three hooks: `setup`, `preVisit`, and `postVisit`. `setup` executes once before all the tests run. `preVisit` and `postVisit` execute within a test before and after a story is rendered.

All three functions can be set up in the configuration file `.storybook/test-runner.js` which can optionally export any of these functions.

> [!Note]
> The `preVisit` and `postVisit` functions will be executed for all stories.

#### setup

Async function that executes once before all the tests run. Useful for setting node-related configuration, such as extending Jest global `expect` for accessibility matchers.

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async setup() {
    // execute whatever you like, in Node, once before all tests run
  },
};
export default config;
```

#### preRender (deprecated)

> [!Note]
> This hook is deprecated. It has been renamed to `preVisit`, please use it instead.

#### preVisit

Async function that receives a [Playwright Page](https://playwright.dev/docs/pages) and a context object with the current story's `id`, `title`, and `name`.
Executes within a test before the story is rendered. Useful for configuring the Page before the story renders, such as setting up the viewport size.

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    // execute whatever you like, before the story renders
  },
};
export default config;
```

#### postRender (deprecated)

> [!Note]
> This hook is deprecated. It has been renamed to `postVisit`, please use it instead.

#### postVisit

Async function that receives a [Playwright Page](https://playwright.dev/docs/pages) and a context object with the current story's `id`, `title`, and `name`.
Executes within a test after a story is rendered. Useful for asserting things after the story is rendered, such as DOM and image snapshotting.

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // execute whatever you like, after the story renders
  },
};
export default config;
```

> [!Note]
> Although you have access to Playwright's Page object, in some of these hooks, we encourage you to test as much as possible within the story's play function.

#### Render lifecycle

To visualize the test lifecycle with these hooks, consider a simplified version of the test code automatically generated for each story in your Storybook:

```ts
// executed once, before the tests
await setup();

it('button--basic', async () => {
  // filled in with data for the current story
  const context = { id: 'button--basic', title: 'Button', name: 'Basic' };

  // playwright page https://playwright.dev/docs/pages
  await page.goto(STORYBOOK_URL);

  // pre-visit hook
  if (preVisit) await preVisit(page, context);

  // render the story and watch its play function (if applicable)
  await page.execute('render', context);

  // post-visit hook
  if (postVisit) await postVisit(page, context);
});
```

These hooks are very useful for a variety of use cases, which are described in the [recipes](#recipes) section further below.

Apart from these hooks, there are additional properties you can set in `.storybook/test-runner.js`:

#### prepare

The test-runner has a default `prepare` function which gets the browser in the right environment before testing the stories. You can override this behavior, in case you might want to hack the behavior of the browser. For example, you might want to set a cookie, or add query parameters to the visiting URL, or do some authentication before reaching the Storybook URL. You can do that by overriding the `prepare` function.

The `prepare` function receives an object containing:

- `browserContext`: a [Playwright Browser Context](https://playwright.dev/docs/api/class-browsercontext) instance
- `page`: a [Playwright Page](https://playwright.dev/docs/api/class-page) instance.
- `testRunnerConfig`: the test runner configuration object, coming from the `.storybook/test-runner.js`.

For reference, please use the [default `prepare`](https://github.com/storybookjs/test-runner/blob/next/src/setup-page.ts#L12) function as a starting point.

> [!Note]
> If you override the default prepare behavior, even though this is powerful, you will be responsible for properly preparing the browser. Future changes to the default prepare function will not get included in your project, so you will have to keep an eye out for changes in upcoming releases.

#### getHttpHeaders

The test-runner makes a few `fetch` calls to check the status of a Storybook instance, and to get the index of the Storybook's stories. Additionally, it visits a page using Playwright. In all of these scenarios, it's possible, depending on where your Storybook is hosted, that you might need to set some HTTP headers. For example, if your Storybook is hosted behind a basic authentication, you might need to set the `Authorization` header. You can do so by passing a `getHttpHeaders` function to your test-runner config. That function receives the `url` of the fetch calls and page visits, and should return an object with the headers to be set.

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  getHttpHeaders: async (url) => {
    const token = url.includes('prod') ? 'XYZ' : 'ABC';
    return {
      Authorization: `Bearer ${token}`,
    };
  },
};
export default config;
```

#### tags (experimental)

The `tags` property contains three options: `include | exclude | skip`, each accepting an array of strings:

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  tags: {
    include: [], // string array, e.g. ['test', 'design'] - by default, the value will be ['test']
    exclude: [], // string array, e.g. ['design', 'docs-only']
    skip: [], // string array, e.g. ['design']
  },
};
export default config;
```

`tags` are used for filtering your tests. Learn more [here](#filtering-tests-experimental).

#### logLevel

When tests fail and there were browser logs during the rendering of a story, the test-runner provides the logs alongside the error message. The `logLevel` property defines what kind of logs should be displayed:

- **`info` (default):** Shows console logs, warnings, and errors.
- **`warn`:** Shows only warnings and errors.
- **`error`:** Displays only error messages.
- **`verbose`:** Includes all console outputs, including debug information and stack traces.
- **`none`:** Suppresses all log output.

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  logLevel: 'verbose',
};
export default config;
```

#### errorMessageFormatter

The `errorMessageFormatter` property defines a function that will pre-format the error messages before they get reported in the CLI:

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  errorMessageFormatter: (message) => {
    // manipulate the error message as you like
    return message;
  },
};
export default config;
```

### Utility functions

For more specific use cases, the test runner provides utility functions that could be useful to you.

#### getStoryContext

While running tests using the hooks, you might want to get information from a story, such as the parameters passed to it, or its args. The test runner now provides a `getStoryContext` utility function that fetches the story context for the current story:

Suppose your story looks like this:

```ts
// ./Button.stories.ts

export const Primary = {
  parameters: {
    theme: 'dark',
  },
};
```

You can access its context in a test hook like so:

```ts
// .storybook/test-runner.ts
import { TestRunnerConfig, getStoryContext } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // Get entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);
    if (storyContext.parameters.theme === 'dark') {
      // do something
    } else {
      // do something else
    }
  },
};
export default config;
```

It's useful for skipping or enhancing use cases like [image snapshot testing](#image-snapshot), [accessibility testing](#accessibility-testing) and more.

#### waitForPageReady

The `waitForPageReady` utility is useful when you're executing [image snapshot testing](#image-snapshot) with the test-runner. It encapsulates a few assertions to make sure the browser has finished downloading assets.

```ts
// .storybook/test-runner.ts
import { TestRunnerConfig, waitForPageReady } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // use the test-runner utility to wait for fonts to load, etc.
    await waitForPageReady(page);

    // by now, we know that the page is fully loaded
  },
};
export default config;
```

#### StorybookTestRunner user agent

The test-runner adds a `StorybookTestRunner` entry to the browser's user agent. You can use it to determine if a story is rendering in the context of the test runner. This might be useful if you want to disable certain features in your stories when running in the test runner, though it's likely an edge case.

```ts
// At the render level, useful for dynamically rendering something based on the test-runner
export const MyStory = {
  render: () => {
    const isTestRunner = window.navigator.userAgent.match(/StorybookTestRunner/);
    return (
      <div>
        <p>Is this story running in the test runner?</p>
        <p>{isTestRunner ? 'Yes' : 'No'}</p>
      </div>
    );
  },
};
```

Given that this check is happening in the browser, it is only applicable in the following scenarios:

- inside of a render/template function of a story
- inside of a play function
- inside of preview.js
- inside any other code that is executed in the browser

## Recipes

Below you will find recipes that use both the hooks and the utility functions to achieve different things with the test-runner.

### Preconfiguring viewport size

You can use [Playwright's Page viewport utility](https://playwright.dev/docs/api/class-page#page-set-viewport-size) to programatically change the viewport size of your test. If you use [@storybook/addon-viewports](https://storybook.js.org/addons/@storybook/addon-viewport), you can reuse its parameters and make sure that the tests match in configuration.

```ts
// .storybook/test-runner.ts
import { TestRunnerConfig, getStoryContext } from '@storybook/test-runner';
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport';

const DEFAULT_VIEWPORT_SIZE = { width: 1280, height: 720 };

const config: TestRunnerConfig = {
  async preVisit(page, story) {
    const context = await getStoryContext(page, story);
    const viewportName = context.parameters?.viewport?.defaultViewport;
    const viewportParameter = MINIMAL_VIEWPORTS[viewportName];

    if (viewportParameter) {
      const viewportSize = Object.entries(viewportParameter.styles).reduce(
        (acc, [screen, size]) => ({
          ...acc,
          // make sure your viewport config in Storybook only uses numbers, not percentages
          [screen]: parseInt(size),
        }),
        {}
      );

      page.setViewportSize(viewportSize);
    } else {
      page.setViewportSize(DEFAULT_VIEWPORT_SIZE);
    }
  },
};
export default config;
```

### Accessibility testing

#### With Storybook 9

In Storybook 9, the accessibility addon has been enhanced with automated reporting capabilities and the Test-runner has out of the box support for it. If you have `@storybook/addon-a11y` installed, as long as you enable them via parameters, you will get a11y checks for every story:

```ts
// .storybook/preview.ts

const preview = {
  parameters: {
    a11y: {
      // 'error' will cause a11y violations to fail tests
      test: 'error', // or 'todo' or 'off'
    },
  },
};

export default preview;
```

If you had a11y tests set up previously for Storybook 8 (with the recipe below), you can uninstall `axe-playwright` and remove all the code from the test-runner hooks, as they are not necessary anymore.

#### With Storybook 8

> [!TIP]
> If you upgrade to Storybook 9, there is out of the box support for a11y tests and you don't have to follow a recipe like this.

You can install `axe-playwright` and use it in tandem with the test-runner to test the accessibility of your components.
If you use [`@storybook/addon-a11y`](https://storybook.js.org/addons/@storybook/addon-a11y), you can reuse its parameters and make sure that the tests match in configuration, both in the accessibility addon panel and the test-runner.

```ts
// .storybook/test-runner.ts
import { TestRunnerConfig, getStoryContext } from '@storybook/test-runner';
import { injectAxe, checkA11y, configureAxe } from 'axe-playwright';

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    // Inject Axe utilities in the page before the story renders
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // Get entire context of a story, including parameters, args, argTypes, etc.
    const storyContext = await getStoryContext(page, context);

    // Do not test a11y for stories that disable a11y
    if (storyContext.parameters?.a11y?.disable) {
      return;
    }

    // Apply story-level a11y rules
    await configureAxe(page, {
      rules: storyContext.parameters?.a11y?.config?.rules,
    });

    // in Storybook 6.x, the selector is #root
    await checkA11y(page, '#storybook-root', {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
      // pass axe options defined in @storybook/addon-a11y
      axeOptions: storyContext.parameters?.a11y?.options,
    });
  },
};
export default config;
```

### DOM snapshot (HTML)

You can use [Playwright's built in APIs](https://playwright.dev/docs/test-snapshots) for DOM snapshot testing:

```ts
// .storybook/test-runner.ts
import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // the #storybook-root element wraps the story. In Storybook 6.x, the selector is #root
    const elementHandler = await page.$('#storybook-root');
    const innerHTML = await elementHandler.innerHTML();
    expect(innerHTML).toMatchSnapshot();
  },
};
export default config;
```

When running with `--stories-json`, tests get generated in a temporary folder and snapshots get stored alongside. You will need to `--eject` and configure a custom [`snapshotResolver`](https://jestjs.io/docs/configuration#snapshotresolver-string) to store them elsewhere, e.g. in your working directory:

```ts
// ./test-runner-jest.config.js
const { getJestConfig } = require('@storybook/test-runner');

const testRunnerConfig = getJestConfig();

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  // The default Jest configuration comes from @storybook/test-runner
  ...testRunnerConfig,
  snapshotResolver: './snapshot-resolver.js',
};
```

```ts
// ./snapshot-resolver.js
const path = require('path');

// 👉 process.env.TEST_ROOT will only be available in --index-json or --stories-json mode.
// if you run this code without these flags, you will have to override it the test root, else it will break.
// e.g. process.env.TEST_ROOT = process.cwd()

module.exports = {
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    path.join(process.cwd(), '__snapshots__', path.basename(testPath) + snapshotExtension),
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    path.join(process.env.TEST_ROOT, path.basename(snapshotFilePath, snapshotExtension)),
  testPathForConsistencyCheck: path.join(process.env.TEST_ROOT, 'example.test.js'),
};
```

### Image snapshot

Here's a slightly different recipe for image snapshot testing:

```ts
// .storybook/test-runner.ts
import { TestRunnerConfig, waitForPageReady } from '@storybook/test-runner';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

const config: TestRunnerConfig = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postVisit(page, context) {
    // use the test-runner utility to wait for fonts to load, etc.
    await waitForPageReady(page);

    // If you want to take screenshot of multiple browsers, use
    // page.context().browser().browserType().name() to get the browser name to prefix the file name
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};
export default config;
```

## Troubleshooting

#### Yarn PnP (Plug n' Play) support

The Storybook test-runner relies on a library called [jest-playwright-preset](https://github.com/playwright-community/jest-playwright), of which does not seem to support PnP. As a result, the test-runner won't work out of the box with PnP, and you might have the following error:

```
PlaywrightError: jest-playwright-preset: Cannot find playwright package to use chromium
```

If that is the case, there are two potential solutions:

1. Install `playwright` as a direct dependency. You might need to run `yarn playwright install` after that, so you install Playwright's browser binaries.
2. Switch your package manager's linker mode to `node-modules`.

#### React Native support

The test-runner is web based and therefore won't work with `@storybook/react-native` directly. However, if you use the [React Native Web Storybook Addon](https://storybook.js.org/addons/%2540storybook/addon-react-native-web), you can run the test-runner against the web-based Storybook generated with that addon. In that case, things would work the same way.

#### The error output in the CLI is too short

By default, the test runner truncates error outputs at 1000 characters, and you can check the full output directly in Storybook, in the browser. If you do want to change that limit, however, you can do so by setting the `DEBUG_PRINT_LIMIT` environment variable to a number of your choosing, for example, `DEBUG_PRINT_LIMIT=5000 yarn test-storybook`.

#### The test runner seems flaky and keeps timing out

If your tests are timing out with `Timeout - Async callback was not invoked within the 15000 ms timeout specified by jest.setTimeout`, it might be that playwright couldn't handle to test the amount of stories you have in your project. Maybe you have a large amount of stories or your CI has a really low RAM configuration.

In either way, to fix it you should limit the amount of workers that run in parallel by passing the [--maxWorkers](https://jestjs.io/docs/cli#--maxworkersnumstring) option to your command:

```json
{
  "test-storybook:ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"yarn build-storybook --quiet && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && yarn test-storybook --maxWorkers=2\""
}
```

Another option is trying to increase the test timeout by passing the [--testTimeout](https://jestjs.io/docs/cli#--testtimeoutnumber) option to your command (adding `--testTimeout=60000` will increase test timeouts to 1 minute):

```json
"test-storybook:ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"yarn build-storybook --quiet && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && yarn test-storybook --maxWorkers=2 --testTimeout=60000\""
```

#### The test runner reports "No tests found" running on a Windows CI

There is currently a [bug](https://github.com/facebook/jest/issues/8536) in Jest which means tests cannot be on a separate drive than the project. To work around this you will need to set the `TEMP` environment variable to a temporary folder on the same drive as your project. Here's what that would look like on GitHub Actions:

```yml
env:
  # Workaround for https://github.com/facebook/jest/issues/8536
  TEMP: ${{ runner.temp }}
```

#### Adding the test runner to other CI environments

As the test runner is based on playwright, depending on your CI setup you might need to use specific docker images or other configuration. In that case, you can refer to the [Playwright CI docs](https://playwright.dev/docs/ci) for more information.

#### Merging test coverage results in wrong coverage

After merging test coverage reports coming from the test runner with reports from other tools (e.g. Jest), if the end result is **not** what you expected. Here's why:

The test runner uses `babel` as coverage provider, which behaves in a certain way when evaluating code coverage. If your other reports happen to use a different coverage provider than `babel`, such as `v8`, they will evaluate the coverage differently. Once merged, the results will likely be wrong.

Example: in `v8`, import and export lines are counted as coverable pieces of code, however in `babel`, they are not. This impacts the percentage of coverage calculation.

While the test runner does not provide `v8` as an option for coverage provider, it is recommended that you set your application's Jest config to use `coverageProvider: 'babel'` if you can, so that the reports line up as expected and get merged correctly.

For more context, [here's some explanation](https://github.com/facebook/jest/issues/11188#issue-830796941) why `v8` is not a 1:1 replacement for Babel/Istanbul coverage.

## Future work

Future plans involve adding support for the following features:

- 📄 Run addon reports
- ⚙️ Spawning Storybook via the test runner in a single command

---

## Contributing

We welcome contributions to the test runner! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started, our development workflow, and release process.

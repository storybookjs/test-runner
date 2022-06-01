<h1>Storybook Test Runner</h1>

Storybook test runner turns all of your stories into executable tests.

Read the announcement: [Interaction Testing with Storybook](https://storybook.js.org/blog/interaction-testing-with-storybook/)

<h2>Table of Contents</h2>

- [Features](#features)
- [Getting started](#getting-started)
- [CLI Options](#cli-options)
- [Configuration](#configuration)
- [Running against a deployed Storybook](#running-against-a-deployed-storybook)
  - [Stories.json mode](#storiesjson-mode)
- [Running in CI](#running-in-ci)
  - [1. Running against deployed Storybooks on Github Actions deployment](#1-running-against-deployed-storybooks-on-github-actions-deployment)
  - [2. Running against locally built Storybooks in CI](#2-running-against-locally-built-storybooks-in-ci)
- [Experimental test hook API](#experimental-test-hook-api)
  - [Image snapshot recipe](#image-snapshot-recipe)
  - [Render lifecycle](#render-lifecycle)
- [Troubleshooting](#troubleshooting)
  - [The test runner seems flaky and keeps timing out](#the-test-runner-seems-flaky-and-keeps-timing-out)
  - [Adding the test runner to other CI environments](#adding-the-test-runner-to-other-ci-environments)
- [Future work](#future-work)

## Features

- ⚡️ Zero config setup
- 💨 Smoke test all stories
- ▶️ Test stories with play functions
- 🏃 Test your stories in parallel in a headless browser
- 👷 Get feedback from error with a link directly to the story
- 🐛 Debug them visually and interactively in a live browser with [addon-interactions](https://storybook.js.org/docs/react/essentials/interactions)
- 🎭 Powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/)
- 👀 Watch mode, filters, and the conveniences you'd expect

## Getting started

1. Install the test runner and the interactions addon in Storybook:

```jsx
yarn add @storybook/test-runner -D
```

Jest is a peer dependency. If you don't have it, also install it

```jsx
yarn add jest@27 -D
```

<details>
  <summary>1.1 Optional instructions to install the Interactions addon for visual debugging of play functions</summary>

```jsx
yarn add @storybook/addon-interactions @storybook/jest @storybook/testing-library -D
```

Then add it to your `.storybook/main.js` config and enable debugging:

```jsx
module.exports = {
  addons: ['@storybook/addon-interactions'],
  features: {
    interactionsDebugger: true,
  },
};
```

</details>

2. Add a `test-storybook` script to your package.json

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

3. Run Storybook (the test runner runs against a running Storybook instance):

```jsx
yarn storybook
```

4. Run the test runner:

```jsx
yarn test-storybook
```

> **NOTE:** The runner assumes that your Storybook is running on port `6006`. If you're running Storybook in another port, either use --url or set the TARGET_URL before running your command like:
>
> ```jsx
> yarn test-storybook --url http://localhost:9009
> or
> TARGET_URL=http://localhost:9009 yarn test-storybook
> ```

## CLI Options

```plaintext
Usage: test-storybook [options]
```

| Options                         | Description                                                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `--help`                        | Output usage information <br/>`test-storybook --help`                                                                            |
| `-s`, `--stories-json`          | Run in stories json mode. Automatically detected (requires a compatible Storybook) <br/>`test-storybook --stories-json`          |
| `--no-stories-json`             | Disables stories json mode <br/>`test-storybook --no-stories-json`                                                               |
| `-c`, `--config-dir [dir-name]` | Directory where to load Storybook configurations from <br/>`test-storybook -c .storybook`                                        |
| `--watch`                       | Run in watch mode <br/>`test-storybook --watch`                                                                                  |
| `--url`                         | Define the URL to run tests in. Useful for custom Storybook URLs <br/>`test-storybook --url http://the-storybook-url-here.com`   |
| `--browsers`                    | Define browsers to run tests in. One or multiple of: chromium, firefox, webkit <br/>`test-storybook --browsers firefox chromium` |
| `--maxWorkers [amount]`         | Specifies the maximum number of workers the worker-pool will spawn for running tests <br/>`test-storybook --maxWorkers=2`        |
| `--no-cache`                    | Disable the cache <br/>`test-storybook --no-cache`                                                                               |
| `--clearCache`                  | Deletes the Jest cache directory and then exits without running tests <br/>`test-storybook --clearCache`                         |
| `--verbose`                     | Display individual test results with the test suite hierarchy <br/>`test-storybook --verbose`                                    |
| `-u`, `--updateSnapshot`        | Use this flag to re-record every snapshot that fails during this test run <br/>`test-storybook -u`                               |
| `--eject`                       | Creates a local configuration file to override defaults of the test-runner <br/>`test-storybook --eject`                         |

## Configuration

The test runner is based on [Jest](https://jestjs.io/) and will accept the [CLI options](https://jestjs.io/docs/cli) that Jest does, like `--watch`, `--maxWorkers`, etc.

The test runner works out of the box, but if you want better control over its configuration, you can run `test-storybook --eject` to create a local `test-runner-jest.config.js` file in the root folder of your project, which will be used by the test runner.

The test runner uses [jest-playwright](https://github.com/playwright-community/jest-playwright) and you can pass [testEnvironmentOptions](https://github.com/playwright-community/jest-playwright#configuration) to further configure it, such as how it's done above to run tests against all browsers instead of just chromium. For this you must eject the test runner configuration.

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

### Stories.json mode

By default, the test runner transforms your story files into tests. It also supports a secondary "stories.json mode" which runs directly against your Storybook's `stories.json`, a static index of all the stories.

This is particularly useful for running against a deployed storybook because `stories.json` is guaranteed to be in sync with the Storybook you are testing. In the default, story file-based mode, your local story files may be out of sync--or you might not even have access to the source code. Furthermore, it is not possible to run the test-runner directly against `.mdx` stories, and stories.json mode must be used.

To run in stories.json mode, first make sure your Storybook has a v3 `stories.json` file. You can navigate to:

```
https://your-storybook-url-here.com/stories.json
```

It should be a JSON file and the first key should be `"v": 3` followed by a key called `"stories"` containing a map of story IDs to JSON objects.

If your Storybook does not have a `stories.json` file, you can generate one provided:

- You are running SB6.4 or above
- You are not using `storiesOf` stories

To enable `stories.json` in your Storybook, set the `buildStoriesJson` feature flag in `.storybook/main.js`:

```js
module.exports = {
  features: { buildStoriesJson: true },
};
```

Once you have a valid `stories.json` file, your Storybook will be compatible with the "stories.json mode".

By default, the test runner will detect whether your Storybook URL is local or remote, and if it is remote, it will run in "stories.json mode" automatically. To disable it, you can pass the `--no-stories-json` flag:

```bash
yarn test-storybook --no-stories-json
```

If you are running tests against a local Storybook but for some reason want to run in "stories.json mode", you can pass the `--stories-json` flag:

```bash
yarn test-storybook --stories-json
```

> **NOTE:** stories.json mode is not compatible with watch mode.

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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14.x'
      - name: Install dependencies
        run: yarn
      - name: Run Storybook tests
        run: yarn test-storybook
        env:
          TARGET_URL: '${{ github.event.deployment_status.target_url }}'
```

> **_NOTE:_** If you're running the test-runner against a `TARGET_URL` of a remotely deployed Storybook (e.g. Chromatic), make sure that the URL loads a publicly available Storybook. Does it load correctly when opened in incognito mode on your browser? If your deployed Storybook is private and has authentication layers, the test-runner will hit them and thus not be able to access your stories. If that is the case, use the next option instead.

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
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14.x'
      - name: Install dependencies
        run: yarn
      - name: Run Storybook tests
        run: yarn test-storybook:ci
```

> **_NOTE:_** Building Storybook locally makes it simple to test Storybooks that could be available remotely, but are under authentication layers. If you also deploy your Storybooks somewhere (e.g. Chromatic, Vercel, etc.), the Storybook URL can still be useful with the test-runner. You can pass it to the `REFERENCE_URL` environment variable when running the test-storybook command, and if a story fails, the test-runner will provide a helpful message with the link to the story in your published Storybook instead.

## Experimental test hook API

The test runner renders a story and executes its [play function](https://storybook.js.org/docs/react/writing-stories/play-function) if one exists. However, there are certain behaviors that are not possible to achieve via the play function, which executes in the browser. For example, if you want the test runner to take visual snapshots for you, this is something that is possible via Playwright/Jest, but must be executed in Node.

To enable use cases like visual or DOM snapshots, the test runner exports test hooks that can be overridden globally. These hooks give you access to the test lifecycle before and after the story is rendered.

There are three hooks: `setup`, `preRender`, and `postRender`. `setup` executes once before all the tests run. `preRender` and `postRender` execute within a test before and after a story is rendered.

The render functions are async functions that receive a [Playwright Page](https://playwright.dev/docs/pages) and a context object with the current story `id`, `title`, and `name`. They are globally settable by `@storybook/test-runner`'s `setPreRender` and `setPostRender` APIs.

All three functions can be set up in the configuration file `.storybook/test-runner.js` which can optionally export any of these functions.

> **NOTE:** These test hooks are experimental and may be subject to breaking changes. We encourage you to test as much as possible within the story's play function.

### DOM snapshot recipe

The `postRender` function provides a [Playwright page](https://playwright.dev/docs/api/class-page) instance, of which you can use for DOM snapshot testing:

```js
// .storybook/test-runner.js
module.exports = {
  async postRender(page, context) {
    // the #root element wraps the story
    const elementHandler = await page.$('#root');
    const innerHTML = await elementHandler.innerHTML();
    expect(innerHTML).toMatchSnapshot();
  },
};
```

### Image snapshot recipe

Here's a slightly different recipe for image snapshot testing:

```js
// .storybook/test-runner.js
const { toMatchImageSnapshot } = require('jest-image-snapshot');

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postRender(page, context) {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};
```

There is also an exported `TestRunnerConfig` type available for TypeScript users.

### Render lifecycle

To visualize the test lifecycle, consider a simplified version of the test code automatically generated for each story in your Storybook:

```js
it('button--basic', async () => {
  // filled in with data for the current story
  const context = { id: 'button--basic', title: 'Button', name: 'Basic' };

  // playwright page https://playwright.dev/docs/pages
  await page.goto(STORYBOOK_URL);

  // pre-render hook
  if (preRender) await preRender(page, context);

  // render the story and run its play function (if applicable)
  await page.execute('render', context);

  // post-render hook
  if (postRender) await postRender(page, context);
});
```

## Troubleshooting

#### Errors with Jest 28

Jest 28 has been released, but unfortunately `jest-playwright` is not yet compatible with it, therefore the test-runner is also not compatible. You likely are having an issue that looks like this:

```sh
  TypeError: Jest: Got error running globalSetup
  reason: Class extends value #<Object> is not a constructor or null
```

As soon as `jest-playwright` is compatible, so the test-runner will be too. Please follow [this issue](https://github.com/storybookjs/test-runner/issues/99) for updates.

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

#### The test runner reports "No tests found" running on a Windows CI

There is currently a [bug](https://github.com/facebook/jest/issues/8536) in Jest which means tests cannot be on a separate drive than the project. To work around this you will need to set the `TEMP` environment variable to a temporary folder on the same drive as your project. Here's what that would look like on GitHub Actions:

```yml
env:
  # Workaround for https://github.com/facebook/jest/issues/8536
  TEMP: ${{ runner.temp }}
```

#### Adding the test runner to other CI environments

As the test runner is based on playwright, depending on your CI setup you might need to use specific docker images or other configuration. In that case, you can refer to the [Playwright CI docs](https://playwright.dev/docs/ci) for more information.

## Future work

Future plans involve adding support for the following features:

- 🧪 Custom test functions
- 📄 Run addon reports

# Storybook Test Runner

Storybook test runner turns all of your stories into executable tests.

## Table of Contents

- [1. Features](#features)
- [2. Getting Started](#getting-started)
- [3. Configuration](#configuration)
- [3. Running against a deployed Storybook](#running-against-a-deployed-storybook)
- [4. Running in CI](#running-in-ci)
- [5. Troubleshooting](#troubleshooting)
- [6. Future work](#future-work)

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

<details>
  <summary>1.1 Optional instructions to install the Interactions addon for visual debugging of play functions</summary>

  ```jsx
  yarn add @storybook/addon-interactions @storybook/jest @storybook/testing-library -D
  ```

  Then add it to your `.storybook/main.js` config and enable debugging:

  ```jsx
  module.exports = {
    stories: ['@storybook/addon-interactions'],
    features: {
      interactionsDebugger: true,
    }
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
yarn test-storybook --watch
```

> **NOTE:** The runner assumes that your Storybook is running on `process.env.STORYBOOK_PORT` which defaults to `6006`. If you're running Storybook in another port, set the STORYBOOK_PORT before running your command like:
>```jsx
>STORYBOOK_PORT=9009 yarn test-storybook --watch
>```

## Configuration

The test runner works out of the box, but you can override its configuration by adding a `test-runner-jest.config.js` that sets up your environment in the root folder of your project.

```js
// test-runner-jest.config.js
module.exports = {
  cacheDirectory: 'node_modules/.cache/storybook/test-runner',
  testMatch: ['**/*.stories.[jt]s(x)?'],
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/test-runner/playwright/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  preset: 'jest-playwright-preset',
  testEnvironment: '@storybook/test-runner/playwright/custom-environment.js',
  testEnvironmentOptions: {
    'jest-playwright': {
      browsers: ['chromium', 'firefox', 'webkit'], // run tests against all browsers
    },
  },
};
```

The runner uses [jest-playwright](https://github.com/playwright-community/jest-playwright) and you can pass [testEnvironmentOptions](https://github.com/playwright-community/jest-playwright#configuration) to further configure it, such as how it's done above to run tests against all browsers instead of just chromium.

## Running against a deployed Storybook

By default, the test runner assumes that you're running it against a locally served Storybook.
If you want to define a target url so it runs against deployed Storybooks, you can do so by passing the `TARGET_URL` environment variable:

```bash
TARGET_URL=https://the-storybook-url-here.com yarn test-storybook
```

## Running in CI

### Running against deployed Storybooks on Github Actions deployment

On Github actions, once services like Vercel, Netlify and others do deployment run, they follow a pattern of emitting a `deployment_status` event containing the newly generated URL under `deployment_status.target_url`. Here's an example of an action to run tests based on that:

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

### Running againts locally built Storybooks in CI

In order to build and run tests against your Storybook in CI, you might need to use a combination of commands involving the [concurrently](https://www.npmjs.com/package/concurrently), [http-server](https://www.npmjs.com/package/http-server) and [wait-on](https://www.npmjs.com/package/wait-on) libraries. Here's a recipe that does the following: Storybook is built and served locally, and once it is ready, the test runner will run against it.

```json
{
  "test-storybook:ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"yarn build-storybook && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && yarn test-storybook\""
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


## Troubleshooting

#### The test runner seems flaky and keeps timing out

If your tests are timing out with `Timeout - Async callback was not invoked within the 15000 ms timeout specified by jest.setTimeout`, it might be that playwright couldn't handle to test the amount of stories you have in your project. Maybe you have a large amount of stories or your CI has a really low RAM configuration. 

In either way, to fix it you should limit the amount of workers that run in parallel by passing the [--maxWorkers](https://jestjs.io/docs/cli#--maxworkersnumstring) option to your command:

```json
{
  "test-storybook:ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"yarn build-storybook && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && yarn test-storybook --maxWorkers=2\""
}
```

#### Adding the test runner to other CI environments

As the test runner is based on playwright, depending on your CI setup you might need to use specific docker images or other configuration. In that case, you can refer to the [Playwright CI docs](https://playwright.dev/docs/ci) for more information.

## Future work

Future plans involve adding support for the following features:

- 🧪 Custom test functions
- 📄 Run addon reports

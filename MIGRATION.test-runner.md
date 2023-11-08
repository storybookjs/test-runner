# Migration Guide: From `@storybook/addon-storyshots` to `@storybook/test-runner`

## Table of Contents

- [Migration Guide: From `@storybook/addon-storyshots` to `@storybook/test-runner`](#migration-guide-from-storybookaddon-storyshots-to-storybooktest-runner)
  - [Table of Contents](#table-of-contents)
  - [Pre-requisites](#pre-requisites)
  - [What is the Storybook Test Runner?](#what-is-the-storybook-test-runner)
  - [Migration Steps](#migration-steps)
    - [Replacing `@storybook/addon-storyshots` with `@storybook/test-runner`:](#replacing-storybookaddon-storyshots-with-storybooktest-runner)
    - [Migrating storyshots features](#migrating-storyshots-features)
      - [Smoke testing](#smoke-testing)
      - [Accessibility testing](#accessibility-testing)
      - [Image snapshot testing](#image-snapshot-testing)
      - [DOM Snapshot testing](#dom-snapshot-testing)
    - [Troubleshooting](#troubleshooting)
      - [Handling unexpected failing tests](#handling-unexpected-failing-tests)
      - [Snapshot path differences](#snapshot-path-differences)
      - [HTML Snapshots Formatting](#html-snapshots-formatting)
    - [Provide feedback](#provide-feedback)

## Pre-requisites

Before you begin the migration process, ensure that you have:

- [ ] A working Storybook setup with version 7.
- [ ] Familiarity with your current Storybook and its testing setup.

> **Note**
> If you are coming from a highly complex storyshots setup, which includes snapshot serializers, tons of mocking, etc. and end up hitting a few bumps in this migration, you might consider checking the [portable stories](./MIGRATION.portable-stories.md) migration.

## What is the Storybook Test Runner?

The [Storybook test-runner](https://storybook.js.org/docs/react/writing-tests/test-runner) turns all of your stories into executable tests, powered by [Jest](https://jestjs.io/)and [Playwright](https://playwright.dev/). It's powerful and provides multi-browser testing, and you can achieve many things with it such as smoke testing, DOM snapshot testing, Accessibility testing, Visual Regression testing and more.

Check [this video](https://www.youtube.com/watch?v%253DwEa6W8uUGSA) for a quick look on the test-runner.

## Migration Steps

### Replacing `@storybook/addon-storyshots` with `@storybook/test-runner`:

First, remove the `@storybook/addon-storyshots` dependency and add the `@storybook/test-runner`:

```sh
yarn remove @storybook/addon-storyshots
yarn add --save-dev @storybook/test-runner
```

Then, update your `package.json` scripts to include a `test-storybook` command:

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Now, run test the setup by running Storybook and the test-runner in separate terminals:

```sh
# Terminal 1
yarn storybook
```

```sh
# Terminal 2
yarn test-storybook
```

Check the results to ensure that tests are running as expected.

### Migrating storyshots features

Storyshots was quite flexible and could be used for different purposes. Below you will find different recipes based on your needs. If you were not using storyshots that extensively, you can benefit from following the recipes and improve your testing experience within Storybook.

#### Smoke testing

Storyshots provided a `renderOnly` utility to just render the story and not check the output at all, which is useful as a low-effort way of smoke testing your components and ensure they do not error.

The test-runner does smoke testing by default, so if you used storyshots with `renderOnly`, you don't have to configure anything extra with the test-runner. The test-runner will also assert the [play function](https://storybook.js.org/docs/react/writing-stories/play-function) of your stories, providing you a better experience and more confidence.

#### Accessibility testing

If you used [`@storybook/addon-storyshots-puppeteer`](https://storybook.js.org/addons/@storybook/addon-storyshots-puppeteer)'s `axeTest` utility to test the accessibility of your components, you can use the following recipe to achieve a similar experience with the test-runner: https://github.com/storybookjs/test-runner#accessibility-testing

#### Image snapshot testing

If you used [`@storybook/addon-storyshots-puppeteer`](https://storybook.js.org/addons/@storybook/addon-storyshots-puppeteer)'s `imageSnapshot` utility to run visual regression tests of your components, you can use the following recipe to achieve a similar experience with the test-runner: https://github.com/storybookjs/test-runner#image-snapshot

#### DOM Snapshot testing

If you used storyshots default functionality for DOM snapshot testing, you can use the following recipe to achieve a similar experience with the test-runner: https://github.com/storybookjs/test-runner#dom-snapshot-html

### Troubleshooting

#### Handling unexpected failing tests

If tests that passed in storyshots fail in the test-runner, it could be because there are uncaught errors in the browser which were not detected correctly in storyshots. The test-runner treats them as failure. If this is the case, use this as an opportunity to review and fix these issues. If these errors are actually intentional (e.g. your story tests an error), then you can tell the test-runner to ignore this particular story instead by defining patterns to ignore via the `testPathIgnorePatterns` configuration. (TODO: Improve this once skipping stories is simpler in the test-runner)

#### Snapshot path differences

Snapshot paths and names generated by `@storybook/test-runner` differ from those by `@storybook/addon-storyshots`. You'll need to configure the test-runner to align the naming convention.

To configure the test-runner, use its `--eject` command:

```sh
yarn test-storybook --eject
```

This command will generate a `test-runner-jest.config.js` file which you can use to configure Jest.
Update the file to use a custom snapshotResolver like so:

```ts
// ./test-runner-jest.config.js
import { getJestConfig } from '@storybook/test-runner';

const defaultConfig = getJestConfig();

const config = {
  // The default configuration comes from @storybook/test-runner
  ...defaultConfig,
  snapshotResolver: './snapshot-resolver.js',
};

export default config;
```

Now create a `snapshot-resolver.js` file to implement a custom snapshot resolver:

```ts
// ./snapshot-resolver.js
import path from 'path';

export default {
  resolveSnapshotPath: (testPath) => {
    const fileName = path.basename(testPath);
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    const modifiedFileName = `${fileNameWithoutExtension}.storyshot`;

    // make Jest generate snapshots in a path like __snapshots__/Button.storyshot
    return path.join(path.dirname(testPath), '__snapshots__', modifiedFileName);
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    path.basename(snapshotFilePath, snapshotExtension),
  testPathForConsistencyCheck: 'example.storyshot',
};
```

#### HTML Snapshots Formatting

The test-runner uses `jest-serializer-html` for HTML snapshots which might have slightly different formatting than your existing snapshots.

Additionally, you might have elements that contain random or hashed properties which might cause your snapshot tests to fail every time they run. For instance, Emotion class names, or Angular ng attributes. You can circumvent this issue by configuring the test-runner to use a custom snapshot serializer.

To configure the test-runner, use its `--eject` command:

```sh
yarn test-storybook --eject
```

This command will generate a `test-runner-jest.config.js` file which you can use to configure Jest.
Update the file to use a custom snapshotSerializer like so:

```ts
// ./test-runner-jest.config.js
import { getJestConfig } from '@storybook/test-runner';

const defaultConfig = getJestConfig();

const config = {
  ...defaultConfig,
  snapshotSerializers: [
    // use your own serializer to preprocess the HTML before it's passed onto the test-runner
    './snapshot-serializer.js',
    ...defaultConfig.snapshotSerializers,
  ],
};

export default config;
```

Now create a `snapshot-serializer.js` file to implement a custom snapshot serializer:

```tsx
// ./snapshot-serializer.js
const jestSerializerHtml = require('jest-serializer-html'); // available as dependency of test-runner

const DYNAMIC_ID_PATTERN = /"react-aria-\d+(\.\d+)?"/g;

module.exports = {
  // this will be called once expect(SomeHTMLElement).toMatchSnapshot() is called from the test-runner
  serialize(val) {
    // from <label id="react-aria970235672-:rl:" for="react-aria970235672-:rk:">Favorite color</label>
    // to   <label id="react-mocked_id" for="react-mocked_id">Favorite color</label>
    const withFixedIds = val.replace(DYNAMIC_ID_PATTERN, 'mocked_id');
    return jestSerializerHtml.print(withFixedIds);
  },
  test(val) {
    return jestSerializerHtml.test(val);
  },
};
```

### Provide feedback

We are looking for feedback on your experience, and would really appreciate if you filled [this form](some-google-form-here) to help us shape our tooling in the right direction. Thank you so much!

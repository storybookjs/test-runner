# Migration Guide: From `@storybook/addon-storyshots` to `@storybook/test-runner`

## Table of Contents

- [Migration Guide: From `@storybook/addon-storyshots` to `@storybook/test-runner`](#migration-guide-from-storybookaddon-storyshots-to-storybooktest-runner)
  - [Table of Contents](#table-of-contents)
  - [Pre-requisites](#pre-requisites)
  - [What is the Storybook Test Runner?](#what-is-the-storybook-test-runner)
  - [Storyshots x Test Runner Comparison table](#storyshots-x-test-runner-comparison-table)
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
> If you're using a complex Storyshots setup that involves snapshot serialization, mocking, and other advanced features, and you are experiencing issues while migrating to the test-runner, you might want to consider taking a look at the [portable stories](./MIGRATION.portable-stories.md) migration guide.

## What is the Storybook Test Runner?

The [Storybook test-runner](https://storybook.js.org/docs/react/writing-tests/test-runner) turns your stories into executable tests. Powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/). It's powerful and provides multi-browser testing, and you can achieve many things with it, such as smoke testing, DOM snapshot testing, Accessibility testing, Visual Regression testing, and more.

## Storyshots x Test Runner Comparison table

|                            | Storyshots                         | Test runner                                                                                                   |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Coverage reports           | ✅                                 | ✅                                                                                                            |
| Access parameters in tests | ✅                                 | ✅                                                                                                            |
| DOM snapshots testing      | ✅                                 | ✅                                                                                                            |
| Visual snapshot testing    | ✅ with puppeteer                  | ✅                                                                                                            |
| A11y tests                 | ✅                                 | ✅                                                                                                            |
| Extra customization        | ✅ via `initStoryshots`            | ✅ via `--eject`                                                                                              |
| Run subset of tests        | ✅ storyKindRegex + storyNameRegex | ✅ via story tags                                                                                             |
| Skip story via parameter   | ✅ via parameters                  | ✅ via story tags                                                                                             |
| Custom test function       | ✅                                 | ✅                                                                                                            |
| Interaction testing        | ❌                                 | ✅                                                                                                            |
| Real Browser               | ❌                                 | ✅                                                                                                            |
| Cross browser testing      | ❌                                 | ✅                                                                                                            |
| Parallel Testing           | ❌                                 | ✅                                                                                                            |
| storyStoreV7 compatibility | ❌                                 | ✅                                                                                                            |
| React Native support       | ✅                                 | ✅ via [@storybook/addon-react-native-web](https://storybook.js.org/addons/@storybook/addon-react-native-web) |

## Storyshots x Test Runner Comparison table

|                            | Storyshots                         | Test runner                                                                                                   |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Coverage reports           | ✅                                 | ✅                                                                                                            |
| Access parameters in tests | ✅                                 | ✅                                                                                                            |
| DOM snapshots testing      | ✅                                 | ✅                                                                                                            |
| Visual snapshot testing    | ✅ with puppeteer                  | ✅                                                                                                            |
| A11y tests                 | ✅                                 | ✅                                                                                                            |
| Extra customization        | ✅ via `initStoryshots`            | ✅ via `--eject`                                                                                              |
| Run subset of tests        | ✅ storyKindRegex + storyNameRegex | ✅ via story tags                                                                                             |
| Skip story via parameter   | ✅ via parameters                  | ✅ via story tags                                                                                             |
| Custom test function       | ✅                                 | ✅                                                                                                            |
| Interaction testing        | ❌                                 | ✅                                                                                                            |
| Real Browser               | ❌                                 | ✅                                                                                                            |
| Cross browser testing      | ❌                                 | ✅                                                                                                            |
| Parallel Testing           | ❌                                 | ✅                                                                                                            |
| storyStoreV7 compatibility | ❌                                 | ✅                                                                                                            |
| React Native support       | ✅                                 | ✅ via [@storybook/addon-react-native-web](https://storybook.js.org/addons/@storybook/addon-react-native-web) |

## Migration Steps

### Replacing `@storybook/addon-storyshots` with `@storybook/test-runner`:

Remove the `@storybook/addon-storyshots` dependency and add the `@storybook/test-runner`:

```sh
yarn remove @storybook/addon-storyshots
yarn add --save-dev @storybook/test-runner
```

Update your `package.json` and enable the test-runner.

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Start your Storybook with:

```sh
yarn storybook
```

Finally, open a new terminal window and run the test-runner with:

```sh
yarn test-storybook
```

If all goes well, you should see a report of all your stories and their tests.

### Migrating Storyshots features

The Storyshots addon offered a highly customizable testing solution, allowing users to extend testing coverage in various ways. However, the test-runner provides a similar experience but with a different API. Below, you will find additional examples of using the test-runner to achieve similar results as those you achieved with Storyshots. If you did not use the Storyshots addon extensively, we encourage you to read through the examples and improve your testing experience within Storybook.

#### Smoke testing

The Storyshots addon provided a `renderOnly` helper function that allowed you to render the story without checking the output. This helper function was helpful for smoke testing your components and ensuring they do not error. This functionality is now built into the test-runner by default and requires no additional configuration. Furthermore, the test-runner will also assert your interaction tests enabled through the [play function](https://storybook.js.org/docs/react/writing-stories/play-function), providing an extended testing experience.

#### Accessibility testing

If you have used `@storybook/addon-storyshots-puppeteer`'s `axeTest` utility to check the accessibility of your components, you can achieve a similar experience with the test-runner by following this example: https://github.com/storybookjs/test-runner#accessibility-testing

#### Image snapshot testing

If you have used [`@storybook/addon-storyshots-puppeteer`](https://storybook.js.org/addons/@storybook/addon-storyshots-puppeteer)'s `imageSnapshot` utility to run visual regression tests of your components, you can achieve a similar experience with the test-runner by following this example: https://github.com/storybookjs/test-runner#image-snapshot

#### DOM Snapshot testing

If you have been using the default functionality of the Storyshots addon for DOM snapshot testing, you can achieve a similar experience by following this example: https://github.com/storybookjs/test-runner#dom-snapshot-html

### Troubleshooting

#### Handling unexpected failing tests

If tests that passed in storyshots fail in the test-runner, it could be because there are uncaught errors in the browser which were not detected correctly in storyshots. The test-runner treats them as failure. If this is the case, use this as an opportunity to review and fix these issues. If these errors are actually intentional (e.g. your story tests an error), then you can tell the test-runner to exclude or skip this particular story instead by using story tags. [Read more about that here](./README.md#filtering-tests-experimental).

#### Snapshot path differences

If you've enabled snapshot testing with the test-runner, the snapshot paths and names differ from those generated by the Storyshots addon. This is because the test-runner uses a different naming convention for snapshot files. Using a custom snapshot resolver, you can configure the test-runner to use the same naming convention as the Storyshots addon.

Start by running the test-runner with the `--eject` flag to generate a custom configuration file that you can use to configure Jest:

```sh
yarn test-storybook --eject
```

Update the file and enable the `snapshotResolver` option to use a custom snapshot resolver:

```js
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

Finally, create a `snapshot-resolver.js` file to implement a custom snapshot resolver:

```js
// ./snapshot-resolver.js

import path from 'path';

export default {
  resolveSnapshotPath: (testPath) => {
    const fileName = path.basename(testPath);
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, '');
    const modifiedFileName = `${fileNameWithoutExtension}.storyshot`;

    // Configure Jest to generate snapshot files using the following naming convention (__snapshots__/Button.storyshot)
    return path.join(path.dirname(testPath), '__snapshots__', modifiedFileName);
  },
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    path.basename(snapshotFilePath, snapshotExtension),
  testPathForConsistencyCheck: 'example.storyshot',
};
```

#### HTML Snapshots Formatting

The test-runner uses [`jest-serializer-html`](https://github.com/algolia/jest-serializer-html) by default to serialize HTML snapshots. This may cause differences in formatting compared to your existing snapshots, even if you're using certain CSS-in-JS libraries like [Emotion](https://emotion.sh/docs/introduction) or Angular's `ng` attributes. However, you can configure the test-runner to use a custom snapshot serializer to solve this issue.

Start by running the test-runner with the `--eject` flag to generate a custom configuration file that you can use to provide additional configuration options.

```sh
yarn test-storybook --eject
```

Update the file and enable the `snapshotSerializers` option to use a custom snapshot resolver:

```js
// ./test-runner-jest.config.js

import { getJestConfig } from '@storybook/test-runner';

const defaultConfig = getJestConfig();

const config = {
  ...defaultConfig,
  snapshotSerializers: [
    // Sets up the custom serializer to preprocess the HTML before it's passed onto the test-runner
    './snapshot-serializer.js',
    ...defaultConfig.snapshotSerializers,
  ],
};

export default config;
```

Finally, create a `snapshot-serializer.js` file to implement a custom snapshot serializer:

```js
// ./snapshot-serializer.js

// The jest-serializer-html package is available as a dependency of the test-runner
const jestSerializerHtml = require('jest-serializer-html');

const DYNAMIC_ID_PATTERN = /"react-aria-\d+(\.\d+)?"/g;

module.exports = {
  /*
   * The test-runner calls the serialize function when the test reaches the expect(SomeHTMLElement).toMatchSnapshot().
   * It will replace all dynamic IDs with a static ID so that the snapshot is consistent.
   * For instance, from <label id="react-aria970235672-:rl:" for="react-aria970235672-:rk:">Favorite color</label> to <label id="react-mocked_id" for="react-mocked_id">Favorite color</label>
   */
  serialize(val) {
    const withFixedIds = val.replace(DYNAMIC_ID_PATTERN, 'mocked_id');
    return jestSerializerHtml.print(withFixedIds);
  },
  test(val) {
    return jestSerializerHtml.test(val);
  },
};
```

### Provide feedback

We are looking for feedback on your experience and would appreciate it if you filled [this form](some-google-form-here) to help us shape our tooling in the right direction. Thank you so much!

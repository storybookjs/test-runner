# Migration Guide: From `@storybook/addon-storyshots` to portable stories

## Table of Contents

- [Migration Guide: From `@storybook/addon-storyshots` to portable stories](#migration-guide-from-storybookaddon-storyshots-to-portable-stories)
  - [Table of Contents](#table-of-contents)
  - [Pre-requisites](#pre-requisites)
  - [What are portable stories?](#what-are-portable-stories)
  - [What will you achieve at the end of this migration?](#what-will-you-achieve-at-the-end-of-this-migration)
  - [Getting started](#getting-started)
    - [1 - Import project-level annotations from Storybook](#1---import-project-level-annotations-from-storybook)
    - [2 - Configure your testing framework to use portable stories](#2---configure-your-testing-framework-to-use-portable-stories)
      - [Vitest](#vitest)
      - [Jest](#jest)
    - [3 - Remove storyshots from your project](#3---remove-storyshots-from-your-project)
    - [4 - (Optional) Extend your testing coverage](#4---optional-extend-your-testing-coverage)
    - [5 - Provide feedback](#5---provide-feedback)

## Pre-requisites

Before you begin the migration process, ensure that you have:

- [ ] A Storybook project with `@storybook/react` or `@storybook/vue3`.
- [ ] A working Storybook setup with version 7.
- [ ] Familiarity with your current Storybook and its testing setup.

## What are portable stories?

Storybook provides a `composeStories` utility that assists in converting stories from a story file into renderable elements that can be reused in your Node tests with JSDOM. It also makes sure to apply all their necessary decorators, args, etc., so your component can render correctly. We call these portable stories.

Currently, the only available renderers that provide this functionality are React and Vue3. We have plans to implement this for other renderers soon. If you are using a different renderer (e.g., Angular, Svelte), we recommend that you follow the [test-runner migration](./MIGRATION.test-runner.md) instead.

## What will you achieve at the end of this migration?

If you want to have a similar experience you had with the Storyshots addon, portable stories can help you achieve that. With it, you still have a single test file that can run in a JSDOM environment, rendering all your stories and snapshotting them. However, you may run into similar limitations as you had with the Storyshots addon:

- You are not testing against a real browser.
- You must mock many browser utilities (e.g., canvas, window APIs, etc).
- Your debugging experience will not be as good, given you can't access the browser as part of your tests.

Alternatively, you may want to consider migrating to the [test-runner](./MIGRATION.test-runner.md), which is more powerful, runs against a real browser with [Playwright](https://playwright.dev/), provides multi-browser support, and more.

## Getting started

We recommend you turn off your current storyshots tests to start the migration process. To do this, rename the configuration file (i.e., `storybook.test.ts` or similar) to `storybook.test.ts.old`. This will prevent the tests from being detected, as you'll be creating a new testing configuration file with the same name. By doing this, you'll be able to preserve your existing tests while transitioning to portable stories.

### 1 - Import project-level annotations from Storybook

If you need project-level annotations to be included in your tests, such as [decorators](https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators), styles or any other features applied to your `.storybook/preview.js|ts` file, adjust your test set up file to import the annotations from Storybook as follows:

```ts
// your-setup-file.ts

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { setProjectAnnotations } from '@storybook/your-framework';

import * as projectAnnotations from './.storybook/preview';

// Apply the global annotations from the Storybook preview file
setProjectAnnotations(projectAnnotations);
```

> **Note**:
> If you're using Vue3, you must install the [`@storybook/testing-vue3`](https://storybook.js.org/addons/@storybook/testing-vue3) package to use the `setProjectAnnotations` API in your setup file and the `composeStories` API in your existing tests.

If you are using the new recommended format in your preview file, which is to have a single default export for all the configurations, you should adjust it accordingly:

```diff
- import * as projectAnnotations from './.storybook/preview'
+ import projectAnnotations from './.storybook/preview'
```

> Based on your testing framework, you might have to adjust the above code to work with your setup file. Refer to the documentation from [Jest](https://jestjs.io/docs/configuration#setupfilesafterenv-array) or [Vitest](https://vitest.dev/config/#setupfiles) on setup files for more information.

### 2 - Configure your testing framework to use portable stories

To help you migrate from Storyshots addon to Storybook's portable stories with the `composeStories` helper API, we've prepared examples to help you get started. Listed below are examples of two of the most popular testing frameworks: [Jest](https://jestjs.io/) and [Vitest](https://vitest.dev/). We recommend placing the code in a newly created `storybook.test.ts` file and adjusting the code accordingly, depending on your testing framework. Both examples below will:

- Import all story files based on a glob pattern
- Iterate over these files and use `composeStories` on each of their modules, resulting in a list of renderable components from each story
- Cycle through the stories, render them, and snapshot them

#### Vitest

If you're using [Vitest](https://vitest.dev/) as your testing framework, you can begin migrating your snapshot tests to Storybook's portable stories with the `composeStories` helper API by referring to the following example. You will need to modify the code in your `storybook.test.ts` file as follows:

```ts
// storybook.test.ts

// @vitest-environment jsdom

// Replace your-framework with one of the supported Storybook frameworks (react, vue3)
import type { Meta, StoryFn } from '@storybook/your-framework';

import { describe, expect, test } from 'vitest';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { composeStories } from '@storybook/your-framework';

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const compose = (entry: StoryFile): ReturnType<typeof composeStories<StoryFile>> => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your story files
  const storyFiles = Object.entries(
    import.meta.glob<StoryFile>('./stories/**/*.(stories|story).@(js|jsx|mjs|ts|tsx)', {
      eager: true,
    })
  );

  return storyFiles.map(([filePath, storyFile]) => {
    const storyDir = path.dirname(filePath);
    const componentName = path.basename(filePath).replace(/\.(stories|story)\.[^/.]+$/, '');
    return { filePath, storyFile, componentName, storyDir };
  });
}

// Recreate similar options to storyshots. Place your configuration below
const options = {
  suite: 'Storybook Tests',
  storyKindRegex: /^.*?DontTest$/,
  storyNameRegex: /UNSET/,
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.storyshot',
};

describe(options.suite, () => {
  getAllStoryFiles().forEach(({ storyFile, componentName, storyDir }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    if (options.storyKindRegex.test(title) || meta.parameters?.storyshots?.disable) {
      // Skip component tests if they are disabled
      return;
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(({ name, story }) => {
          // Implements a filtering mechanism to avoid running stories that are disabled via parameters or that match a specific regex mirroring the default behavior of Storyshots.
          return !options.storyNameRegex?.test(name) && !story.parameters.storyshots?.disable;
        });

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`
        );
      }

      stories.forEach(({ name, story }) => {
        // Instead of not running the test, you can create logic to skip it, flagging it accordingly in the test results.
        const testFn = story.parameters.storyshots?.skip ? test.skip : test;

        testFn(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));

          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

Running this example will generate a single snapshot file (i.e., `storybook.test.ts.snap`) with all the stories. However, if you were previously using a multi-snapshot configuration with the Storyshots addon, you can adjust the example above to include Vitest's [`toMatchFileSnapshot`](https://vitest.dev/guide/snapshot.html#file-snapshots) API. For example:

```ts
// ...Code omitted for brevity

describe(options.suite, () => {
  // 👇 Add storyDir in the arguments list
  getAllStoryFiles().forEach(({ filePath, storyFile, storyDir }) => {
    // ...Previously existing code
    describe(title, () => {
      // ...Previously existing code
      stories.forEach(({ name, story }) => {
        // ...Previously existing code
        testFn(name, async () => {
          // ...Previously existing code

          // 👇 Define the path to save the snapshot to:
          const snapshotPath = path.join(
            storyDir,
            options.snapshotsDirName,
            `${componentName}${options.snapshotExtension}`
          );
          expect(mounted.container).toMatchFileSnapshot(snapshotPath);
        });
      });
    });
  });
});
```

When the example above runs, it will generate individual snapshot files, one per story, using the following naming convention and location:

```
components/Button/Button.stories.ts
components/Button/__snapshots__/Primary.storyshot
components/Button/__snapshots__/Secondary.storyshot
```

#### Jest

If you're using Jest as your testing framework, you can begin migrating your snapshot tests to Storybook's portable stories with the `composeStories` helper API by referring to the following example. You will need to modify the code in your `storybook.test.ts` file as follows:

```ts
// storybook.test.ts

import path from 'path';
import * as glob from 'glob';

// Replace your-framework with one of the supported Storybook frameworks (react, vue3)
import type { Meta, StoryFn } from '@storybook/your-framework';

import { describe, test, expect } from '@jest/globals';

// Replace your-testing-library with one of the supported testing libraries (e.g., react, vue)
import { render } from '@testing-library/your-testing-library';

// Adjust the import based on the supported framework or Storybook's testing libraries (e.g., react, testing-vue3)
import { composeStories } from '@storybook/your-framework';

type StoryFile = {
  default: Meta;
  [name: string]: StoryFn | Meta;
};

const compose = (entry: StoryFile): ReturnType<typeof composeStories<StoryFile>> => {
  try {
    return composeStories(entry);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(entry)}, ${e}`
    );
  }
};

function getAllStoryFiles() {
  // Place the glob you want to match your stories files
  const storyFiles = glob.sync(
    path.join(__dirname, 'stories/**/*.(stories|story).@(js|jsx|mjs|ts|tsx)')
  );

  return storyFiles.map((filePath) => {
    const storyFile = require(filePath);
    return { filePath, storyFile };
  });
}

// Recreate similar options to Storyshots. Place your configuration below
const options = {
  suite: 'Storybook Tests',
  storyKindRegex: /^.*?DontTest$/,
  storyNameRegex: /UNSET/,
  snapshotsDirName: '__snapshots__',
  snapshotExtension: '.storyshot',
};

describe(options.suite, () => {
  getAllStoryFiles().forEach(({ storyFile, componentName }) => {
    const meta = storyFile.default;
    const title = meta.title || componentName;

    if (options.storyKindRegex.test(title) || meta.parameters?.storyshots?.disable) {
      // Skip component tests if they are disabled
      return;
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(({ name, story }) => {
          // Implements a filtering mechanism to avoid running stories that are disabled via parameters or that match a specific regex mirroring the default behavior of Storyshots.
          return !options.storyNameRegex.test(name) && !story.parameters.storyshots?.disable;
        });

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`
        );
      }

      stories.forEach(({ name, story }) => {
        // Instead of not running the test, you can create logic to skip it, flagging it accordingly in the test results.
        const testFn = story.parameters.storyshots?.skip ? test.skip : test;

        testFn(name, async () => {
          const mounted = render(story());
          // Ensures a consistent snapshot by waiting for the component to render by adding a delay of 1 ms before taking the snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));
          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

Running this example will generate a single snapshot file (i.e., `__snapshots__/storybook.test.ts.snap`) with all the stories. However, if you were previously using a multi-snapshot configuration with the Storyshots addon, you can adjust the example above to include the [`jest-specific-snapshot`](https://github.com/igor-dv/jest-specific-snapshot) package. For example:

```ts
// storybook.test.ts

// 👇 Augment expect with jest-specific-snapshot
import 'jest-specific-snapshot';

// ...Code omitted for brevity

describe(options.suite, () => {
  //👇 Add storyDir in the arguments list
  getAllStoryFiles().forEach(({ filePath, storyFile, storyDir }) => {
    // ...Previously existing code
    describe(title, () => {
      // ...Previously existing code
      stories.forEach(({ name, story }) => {
        // ...Previously existing code
        testFn(name, async () => {
          // ...Previously existing code

          //👇 Define the path to save the snapshot to:
          const snapshotPath = path.join(
            storyDir,
            options.snapshotsDirName,
            `${componentName}${options.snapshotExtension}`
          );
          expect(mounted.container).toMatchSpecificSnapshot(snapshotPath);
        });
      });
    });
  });
});
```

When the example above runs, it will generate individual snapshot files, one per story, using the following naming convention and location:

```
components/__snapshots__/Button.stories.storyshot
components/__snapshots__/Header.stories.storyshot
components/__snapshots__/Page.stories.storyshot
```

### 3 - Remove Storyshots from your project

After you confirm that the portable stories solution suits your needs, delete your old storyshots test file and uninstall `@storybook/addon-storyshots` from your project.

### 4 - (Optional) Extend your testing coverage

The examples above will give you the closest possible experience with the Storyshots addon. However, if you are using Storyshots for other use cases, such as accessibility testing, image snapshot testing, or different testing scenarios, you can extend them to suit your needs or extend your testing solution to use the [Storybook test-runner](https://github.com/storybookjs/test-runner), that offers a similar experience, with minimal changes to your existing testing setup. You can read more about it in the test-runner [migration guide](./MIGRATION.test-runner.md).

### 5 - Provide feedback

We are looking for feedback on your experience and would appreciate it if you filled [this form](some-google-form-here) to help us shape our tooling in the right direction. Thank you so much!

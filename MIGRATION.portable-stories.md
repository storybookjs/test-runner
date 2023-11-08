# Migration Guide: From `@storybook/addon-storyshots` to portable stories

## Table of Contents

- [Migration Guide: From `@storybook/addon-storyshots` to portable stories](#migration-guide-from-storybookaddon-storyshots-to-portable-stories)
  - [Table of Contents](#table-of-contents)
  - [Pre-requisites](#pre-requisites)
  - [What are portable stories?](#what-are-portable-stories)
  - [What will you achieve at the end of this migration?](#what-will-you-achieve-at-the-end-of-this-migration)
  - [Getting started](#getting-started)
    - [1 - Disable your existing storyshots test](#1---disable-your-existing-storyshots-test)
    - [2 - Import project level annotations from Storybook](#2---import-project-level-annotations-from-storybook)
    - [3 - Use the portable stories recipe](#3---use-the-portable-stories-recipe)
      - [Vitest](#vitest)
      - [Jest](#jest)
    - [4 - (Optional) extend your testing recipe](#4---optional-extend-your-testing-recipe)
    - [5 - Remove storyshots from your project](#5---remove-storyshots-from-your-project)
    - [6 - Provide feedback](#6---provide-feedback)

## Pre-requisites

Before you begin the migration process, ensure that you have:

- [ ] A Storybook project with `@storybook/react` or `@storybook/vue3`.
- [ ] A working Storybook setup with version 7.
- [ ] Familiarity with your current Storybook and its testing setup.

> **Note**
> If you are using a different renderer for your project, such as Angular or Svelte, this migration is not possible for you. Please refer to the [test-runner migration](./MIGRATION.md) instead.

## What are portable stories?

Storybook provides a `composeStories` utility that assists in converting stories from a story file into renderable elements that can be reused in your Node tests with JSDOM. It also makes sure to apply all their necessary decorators, args, etc so that your component can render correctly. We call this portable stories.

Currently, the only available renderers that provide this functionality are React and Vue3. We have plans to implement this for other renderers in the near future.

## What will you achieve at the end of this migration?

Portable stories will provide you the closest experience possible with storyshots. You will still have a single test file in node, which runs in a JSDOM environment, that render all of your stories and snapshots them. However, you will still face the same challenges you did with storyshots:

- You are not testing against a real browser.
- You will have to mock many browser utilities (e.g. canvas, window APIs, etc).
- Your debugging experience will not be as good, given you can't access the browser as part of your tests.

You could consider migrating to the [test-runner](./MIGRATION.md) instead, which is more powerful, runs against a real browser with Playwright, provides multi-browser support, and more.

## Getting started

The first thing you have to do is to disable your storyshots tests. You can keep it while doing the migration, as it might be helpful in the process, but your ultimate goal is to remove `@storybook/addon-storyshots`.

### 1 - Disable your existing storyshots test

Rename your `storybook.test.ts` (or whatever your storyshots test is called) to `storybook.test.ts.old`. This will disable the test from being detected, and allow you to create an updated test file with the same name.

### 2 - Import project level annotations from Storybook

If you need project level annotations such as decorators, styles, or anything that is applied to your stories via your `.storybook/preview` file, you will have to add the following code to your test setup file. Please refer to the documentation from [Jest](https://jestjs.io/docs/configuration#setupfilesafterenv-array) or [Vitest](https://vitest.dev/config/#setupfiles) on setup files.

```ts
// your-setup-file.js
import * as projectAnnotations from './.storybook/preview';
import { setProjectAnnotations } from '@storybook/react';

// apply the global annotations from Storybook preview file
setProjectAnnotations(projectAnnotations);
```

If you are using the new recommended format in your preview file, which is to have a single default export for all the configuration, you should adjust that slightly:

```diff
- import * as projectAnnotations from './.storybook/preview'
+ import projectAnnotations from './.storybook/preview'
```

### 3 - Use the portable stories recipe

Then, create a `storybook.test.ts` file, and depending on your tool of choice, follow the recipes below.

- [Vitest](#vitest)
- [Jest](#jest)

#### Vitest

This recipe will do the following:

1. Import all story files based on a glob pattern
2. Iterate over these files and use `composeStories` on each of their modules, resulting in a list of renderable components from each story
3. Iterave over the stories, render them and snapshot them

Fill in your `storybook.test.ts` file with the following recipe. Please read the code comments to understand

```ts
// @vitest-environment jsdom
import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import type { Meta, StoryFn } from '@storybook/react';

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

// recreate similar options to storyshots, place your configuration below
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
      // skip component tests entirely if they are disabled
      return;
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(({ name, story }) => {
          // Create your own logic to filter stories here if you like.
          // This is recreating the default behavior of storyshots.
          return !options.storyNameRegex?.test(name) && !story.parameters.storyshots?.disable;
        });

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`
        );
      }

      stories.forEach(({ name, story }) => {
        // Instead of not running the test, you can create logic to skip it instead, so it's shown as skipped in the test results.
        const testFn = story.parameters.storyshots?.skip ? test.skip : test;

        testFn(name, async () => {
          const mounted = render(story());
          // add a slightly delay to allow a couple render cycles to complete, resulting in a more stable snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));

          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

The snapshots will all be aggregated in a single `storybook.test.ts.snap` file. If you had storyshots configured with multisnapshots, you should change the above recipe a little to use `toMatchFileSnapshot` from vitest:

```ts
// ...everything else

describe(options.suite, () => {
  // 👇 add storyDir in the arguments list
  getAllStoryFiles().forEach(({ filePath, storyFile, storyDir }) => {
    // ...existing code
    describe(title, () => {
      // ...existing code
      stories.forEach(({ name, story }) => {
        // ...existing code
        testFn(name, async () => {
          // ...existing code

          // 👇 define the path to save the snapshot to:
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

This will result in separate snapshot files per story, located near their stories file e.g.:

```
components/Button/Button.stories.ts
components/Button/__snapshots__/Primary.storyshot
components/Button/__snapshots__/Secondary.storyshot
// ...
```

#### Jest

This recipe will do the following:

1. Import all story files based on a glob pattern
2. Iterate over these files and use `composeStories` on each of their modules, resulting in a list of renderable components from each story
3. Iterave over the stories, render them and snapshot them

Fill in your of your `storybook.test.ts` file with the following recipe:

```ts
// storybook.test.ts
import path from 'path';
import * as glob from 'glob';
import { describe, test, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import type { Meta, StoryFn } from '@storybook/react';

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

// recreate similar options to storyshots, place your configuration below
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
      return;
    }

    describe(title, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(({ name, story }) => {
          // Create your own logic to filter stories here if you like.
          // This is recreating the default behavior of storyshots.
          return !options.storyNameRegex.test(name) && !story.parameters.storyshots?.disable;
        });

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`
        );
      }

      stories.forEach(({ name, story }) => {
        // Instead of not running the test, you can create logic to skip it instead, so it's shown as skipped in the test results.
        const testFn = story.parameters.storyshots?.skip ? test.skip : test;

        testFn(name, async () => {
          const mounted = render(story());
          // add a slightly delay to allow a couple render cycles to complete, resulting in a more stable snapshot.
          await new Promise((resolve) => setTimeout(resolve, 1));
          expect(mounted.container).toMatchSnapshot();
        });
      });
    });
  });
});
```

The snapshots will all be aggregated in a single `__snapshots__/storybook.test.ts.snap` file. If you had storyshots configured with multisnapshots, you can change the above recipe a little by using `jest-specific-snapshot` (you will have to install this dependency):

```ts
// 👇 augment expect with jest-specific-snapshot
import 'jest-specific-snapshot';
// ...everything else

describe(options.suite, () => {
  // 👇 add storyDir in the arguments list
  getAllStoryFiles().forEach(({ filePath, storyFile, storyDir }) => {
    // ...existing code
    describe(title, () => {
      // ...existing code
      stories.forEach(({ name, story }) => {
        // ...existing code
        testFn(name, async () => {
          // ...existing code

          // 👇 define the path to save the snapshot to:
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

This will result in separate snapshot files per component, located near their stories file e.g.:

```
components/__snapshots__/Button.stories.storyshot
components/__snapshots__/Header.stories.storyshot
components/__snapshots__/Page.stories.storyshot
// ...
```

### 4 - (Optional) extend your testing recipe

The aforementioned recipes will only get you so far, depending on how you used storyshots. If you used it for image snapshot testing, acessibility testing, or other scenarios, you can extend the recipe to suit your needs. You can also consider using [the Storybook test-runner](https://github.com/storybookjs/test-runner), which provides solutions for such use cases as well.

### 5 - Remove storyshots from your project

Once you make sure that the portable stories solution suits you, make sure to remove your old storyshots test file and uninstall `@storybook/addon-storyshots`.

### 6 - Provide feedback

We are looking for feedback on your experience, and would really appreciate if you filled [this form](some-google-form-here) to help us shape our tooling in the right direction. Thank you so much!

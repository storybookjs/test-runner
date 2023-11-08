# `@storybook/addon-storyshots` Migration Guide

`@storybook/addon-storyshots` was replaced by the [Storybook test-runner](https://storybook.js.org/docs/react/writing-tests/test-runner) in 2021, due to storyshots being a performance and maintenance problem for Storybook. As Storybook 8 moves forward with the `storyStoreV7` and its on-demand architecture, `@storybook/addon-storyshots` will become incompatible, and you'll have to migrate from it. This migration guide will aid you in that process.

Below you will find two options to migrate. We recommend migrating to and using the Storybook test-runner, but you can decide for yourself which path to choose, by following the guides below.

## Option 1 - Portable stories

Portable stories are utilities from Storybook that assist in converting stories from a story file into renderable elements that can be reused in your Node tests with JSDOM with tools like [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/). This is the closest you will get from storyshots, but with the caveat that you will face similar challenges, given that the tests still run in Node.

If your project uses React, React Native (without the [react-native-web addon](https://storybook.js.org/addons/%2540storybook/addon-react-native-web)) or Vue3, and you use storyshots extensively with complex mocking mechanisms and snapshot serializers, this migration will be the most seamless to you.

Follow the [migration steps to portable stories here](./MIGRATION.portable-stories.md).

## Option 2 - Storybook test-runner

The Storybook test-runner turns all of your stories into executable tests, powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/). It's powerful and provides multi-browser testing, and you can achieve many things with it such as smoke testing, DOM snapshot testing, Accessibility testing, Visual Regression testing and more.

The test-runner supports any official Storybook framework, and is compatible with community frameworks (support may vary). If you use Storybook for React Native, you can use the test-runner as long as you set up the [react-native-web addon](https://storybook.js.org/addons/%2540storybook/addon-react-native-web) in your project.

Follow the [migration steps to test-runner here](./MIGRATION.test-runner.md).

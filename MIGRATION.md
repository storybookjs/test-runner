# `@storybook/addon-storyshots` Migration Guide

Storyshots (`@storybook/addon-storyshots`) was Storybook's original testing solution. It providing automatic snapshot testing and rich configurability. However, it was fundamentally incompatible with Storybook 7's high-performance [on-demand architecture](https://storybook.js.org/blog/storybook-on-demand-architecture/), and suffered from other limitations. In response, we created [Storybook test-runner](https://storybook.js.org/docs/react/writing-tests/test-runner) as a successor in 2021.

Now that we are finally removing the old architecture in Storybook 8, Storyshots will become incompatible. If you're using Storyshots and you want to upgrade to Storybook 8, you'll need to migrate to something else. This guide will aid you in that process.

Below you will find serveral options to migrate:

1. **Storybook test-runner** is Storybook's recommended open source testing tool.
2. **Portable stories** is an alternative approach that might be an easier migration from Storyshots, and is also supported by the core team.
3. **Chromatic** is a great option if you are looking for a fully hosted service, and built by Storybook maintainers.

You can decide for yourself which path to choose, by following the guides below.

## Option 1 - Storybook test-runner

Storybook test-runner turns all of your stories into executable tests, powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/). It's powerful and provides multi-browser testing, and you can achieve many things with it such as smoke testing, DOM snapshot testing, Accessibility testing, Visual Regression testing and more.

The test-runner supports any official Storybook framework and is compatible with community frameworks (support may vary). If you use Storybook for React Native, you can use the test-runner as long as you set up the [react-native-web addon](https://storybook.js.org/addons/@storybook/addon-react-native-web/) in your project.

Follow the [migration steps to test-runner here](./MIGRATION.test-runner.md).

## Option 2 - Portable stories

Portable stories are utilities from Storybook that assist in converting stories from a story file into renderable elements that can be reused in your Node tests with JSDOM with tools like [Jest](https://jestjs.io/) or [Vitest](https://vitest.dev/). This is the closest you will get from storyshots, but with the caveat that you will face similar challenges, given that the tests still run in Node. If you use storyshots extensively with complex mocking mechanisms and snapshot serializers, this migration will be the simplest option.

This option is currently only available for React, React Native (without the [react-native-web addon](https://storybook.js.org/addons/@storybook/addon-react-native-web/)) or Vue3. However, we plan to support more renderers in the future.

Follow the [migration steps to portable stories here](./MIGRATION.portable-stories.md).

## Option 3 - Chromatic

[Chromatic](https://www.chromatic.com/) is a cloud service for taking visual snapshots of your stories, developed by the maintainers of Storybook. It is easy to set up and configure, and has a free plan. We recommend it if you are looking for a high quality hosted testing solution. See the [Chromatic site](https://www.chromatic.com/) for setup instructions.

# Storybook Test Runner

Storybook test runner turns all of your stories into executable tests.

It's currently a prototype that configures Jest to run smoke tests on your stories in either:

- **JSDOM** - render stories to JSDOM using TestingLibrary
- **Playwright** - render stories in a browser using Playwright

The goal of this prototype is to help evaluate both approaches: primarily for performance, but also to understand the general strengths and weaknesses.

## Install

The package has not yet been published so you'll have to link it for now.

In the `test-runner` package:

```sh
yarn && yarn build
yarn link
```

In your project directory:

```sh
yarn link @storybook/test-runner
yarn add jest babel-jest @testing-library/react @storybook/testing-react --dev
```

For JSDOM (React-only for now):

```sh
yarn add jest-environment-jsdom --dev
```

For Playwright:

```sh
yarn add jest-playwright-preset playwright --dev
```

This simply installs the package in `node_modules`. Using the package is fully manual at this point.

## Configure

To use the addon, you need to manually configure it:

- Create a script in `package.json`
- Create a jest config for your use case

### JSDOM

Add a script to `package.json`:

```json
{
  "scripts": {
    "test-storybook:jsdom": "jest --config ./jsdom-jest.config.js"
  }
}
```

Then create a config file `jsdom-jest.config.js` that sets up your environment. For example:

```js
module.exports = {
  cacheDirectory: '.cache/jest',
  testMatch: ['**/*.stories.[jt]s?(x)'],
  moduleNameMapper: {
    // non-js files
    '\\.(jpg|jpeg|png|apng|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '@storybook/test-runner/mocks/fileMock.js',
    '\\.(css|scss|stylesheet)$': '@storybook/test-runner/mocks/styleMock.js',
  },
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storyboook/test-runner/jsdom/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
};
```

### Playwright

Add a script to `package.json`:

```json
{
  "scripts": {
    "test-storybook:playwright": "jest --config ./playwright-jest.config.js"
  }
}
```

Then create a config file `playwright-jest.config.js` that sets up your environment. For example:

```js
module.exports = {
  cacheDirectory: '.cache/jest',
  testMatch: ['**/*.stories.[jt]s?(x)'],
  moduleNameMapper: {
    // non-js files
    '\\.(jpg|jpeg|png|apng|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '@storybook/test-runner/mocks/fileMock.js',
    '\\.(css|scss|stylesheet)$': '@storybook/test-runner/mocks/styleMock.js',
  },
  transform: {
    '^.+\\.stories\\.[jt]sx?$': '@storybook/test-runner/playwright/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  preset: 'jest-playwright-preset',
  testEnvironment: '@storybook/test-runner/playwright/custom-environment.js',
};
```

> **NOTE:** The code currently assumes that your Storybook is ALREADY running on `process.env.STORYBOOK_PORT` which defaults to `6006`.

#### Running against a deployed Storybook

By default, the playwright assumes that you're running it against a locally served Storybook.
If you want to define a target url so it runs against deployed Storybooks, you can do so by passing the `TARGET_URL` environment variable:

```json
{
  "scripts": {
    "test-storybook:playwright": "TARGET_URL=the-storybook-url-here jest --config ./playwright-jest.config.js"
  }
}
```

## Future work

In the future it will support the following features:

- 💨 Smoke test all stories
- ▶️ Test CSF3 play functions
- 🧪 Custom test functions
- 📄 Run addon reports
- ⚡️ Zero config setup

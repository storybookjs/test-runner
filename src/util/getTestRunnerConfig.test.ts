import { TestRunnerConfig } from '../playwright/hooks';
import { getTestRunnerConfig } from './getTestRunnerConfig';
import { join, resolve } from 'path';

import { serverRequire } from './serverRequire';

const testRunnerConfig: TestRunnerConfig = {
  setup: () => {
    console.log('Running setup');
  },
  preRender: async (page) => {
    console.log('Running preRender');
    await page.goto('https://example.com');
  },
  postRender: async (page) => {
    console.log('Running postRender');
    const title = await page.title();
    console.log(`Page title: ${title}`);
  },
  getHttpHeaders: async (url: string) => {
    console.log(`Getting http headers for ${url}`);
    const headers = { Authorization: 'Bearer token' };
    return headers;
  },
  prepare: async ({ page }) => {
    console.log('Preparing browser');
    await page.setViewportSize({ width: 1920, height: 1080 });
  },
};

jest.mock('./serverRequire', () => ({
  serverRequire: jest.fn(() => {}),
}));

describe('getTestRunnerConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should load the test runner config', () => {
    const configDir = '.storybook';
    (serverRequire as jest.Mock).mockReturnValueOnce(testRunnerConfig);

    const result = getTestRunnerConfig(configDir);

    expect(result).toEqual(testRunnerConfig);
    expect(serverRequire).toHaveBeenCalledWith(join(resolve('.storybook', 'test-runner')));
  });

  it('should cache the test runner config', () => {
    const configDir = '.storybook';
    (serverRequire as jest.Mock).mockReturnValueOnce(testRunnerConfig);

    const result1 = getTestRunnerConfig(configDir);
    const result2 = getTestRunnerConfig(configDir);

    expect(result1).toEqual(testRunnerConfig);
    expect(result2).toEqual(testRunnerConfig);
  });

  it('should load the test runner config with default configDir', () => {
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const result = getTestRunnerConfig();
    expect(result).toEqual(testRunnerConfig);
  });

  afterEach(() => {
    process.env.STORYBOOK_CONFIG_DIR = undefined;
  });
});

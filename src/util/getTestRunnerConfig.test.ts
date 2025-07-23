import { TestRunnerConfig } from '../playwright/hooks';
import { getTestRunnerConfig } from './getTestRunnerConfig';
import { join, resolve } from 'path';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { serverRequire } from 'storybook/internal/common';

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

vi.mock('storybook/internal/common', () => ({
  serverRequire: vi.fn(),
}));

describe.only('getTestRunnerConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load the test runner config', async () => {
    const configDir = '.storybook';
    vi.mocked(serverRequire).mockResolvedValueOnce(testRunnerConfig);

    const result = await getTestRunnerConfig(configDir);

    expect(result).toEqual(testRunnerConfig);
    expect(vi.mocked(serverRequire)).toHaveBeenCalledWith(
      join(resolve('.storybook', 'test-runner'))
    );
  });

  it('should cache the test runner config', async () => {
    const configDir = '.storybook';
    vi.mocked(serverRequire).mockResolvedValueOnce(testRunnerConfig);

    const result1 = await getTestRunnerConfig(configDir);
    const result2 = await getTestRunnerConfig(configDir);

    expect(result1).toEqual(testRunnerConfig);
    expect(result2).toEqual(testRunnerConfig);
  });

  it('should load the test runner config with default configDir', async () => {
    process.env.STORYBOOK_CONFIG_DIR = '.storybook';
    const result = await getTestRunnerConfig();
    expect(result).toEqual(testRunnerConfig);
  });

  afterEach(() => {
    process.env.STORYBOOK_CONFIG_DIR = undefined;
  });
});

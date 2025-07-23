import { getStorybookMain, resetStorybookMainCache, storybookMainConfig } from './getStorybookMain';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { serverRequire } from 'storybook/internal/common';

vi.mock('storybook/internal/common', () => ({
  serverRequire: vi.fn(),
}));

describe('getStorybookMain', () => {
  beforeEach(() => {
    resetStorybookMainCache();
    vi.clearAllMocks();
  });

  it('should throw an error if no configuration is found', async () => {
    vi.mocked(serverRequire).mockRejectedValueOnce(new Error('Module not found'));
    await expect(getStorybookMain('.storybook')).rejects.toThrowErrorMatchingSnapshot();
  });

  describe('no stories', () => {
    it('should throw an error if no stories are defined', async () => {
      vi.mocked(serverRequire).mockResolvedValueOnce({});

      await expect(getStorybookMain('.storybook')).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error if stories list is empty', async () => {
      vi.mocked(serverRequire).mockResolvedValueOnce({
        stories: [],
      });

      await expect(getStorybookMain('.storybook')).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  it('should return mainjs', async () => {
    const mockedMain = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    };

    vi.mocked(serverRequire).mockResolvedValueOnce(mockedMain);

    const res = await getStorybookMain('.storybook');
    expect(res).toMatchObject(mockedMain);
  });

  it('should return the configDir value if it exists', async () => {
    const mockedMain = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    };
    storybookMainConfig.set('.storybook', mockedMain);

    const res = await getStorybookMain('.storybook');
    expect(res).toMatchObject(mockedMain);
  });
});

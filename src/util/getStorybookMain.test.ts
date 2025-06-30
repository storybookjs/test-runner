import { getStorybookMain, resetStorybookMainCache, storybookMainConfig } from './getStorybookMain';

jest.mock('storybook/internal/common', () => ({
  serverRequire: jest.fn(),
}));

describe('getStorybookMain', () => {
  beforeEach(() => {
    resetStorybookMainCache();
    jest.clearAllMocks();
  });

  it('should throw an error if no configuration is found', async () => {
    (require('storybook/internal/common').serverRequire as jest.Mock).mockRejectedValueOnce(
      new Error('Module not found')
    );
    await expect(getStorybookMain('.storybook')).rejects.toThrowErrorMatchingSnapshot();
  });

  describe('no stories', () => {
    it('should throw an error if no stories are defined', async () => {
      (require('storybook/internal/common').serverRequire as jest.Mock).mockResolvedValueOnce({});

      await expect(getStorybookMain('.storybook')).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error if stories list is empty', async () => {
      (require('storybook/internal/common').serverRequire as jest.Mock).mockResolvedValueOnce({
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

    (require('storybook/internal/common').serverRequire as jest.Mock).mockResolvedValueOnce(
      mockedMain
    );

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
    storybookMainConfig.set('configDir', mockedMain);

    const res = await getStorybookMain('.storybook');
    expect(res).toMatchObject(mockedMain);
  });
});

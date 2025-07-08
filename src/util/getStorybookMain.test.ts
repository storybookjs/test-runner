import { getStorybookMain, resetStorybookMainCache, storybookMainConfig } from './getStorybookMain';
import * as coreCommon from 'storybook/internal/common';

jest.mock('storybook/internal/common');

describe('getStorybookMain', () => {
  beforeEach(() => {
    resetStorybookMainCache();
  });

  it('should throw an error if no configuration is found', async () => {
    await expect(getStorybookMain('.storybook')).rejects.toThrowErrorMatchingSnapshot();
  });

  describe('no stories', () => {
    it('should throw an error if no stories are defined', async () => {
      jest.spyOn(coreCommon, 'serverRequire').mockImplementation(async () => ({}));

      await expect(getStorybookMain('.storybook')).rejects.toThrowErrorMatchingSnapshot();
    });

    it('should throw an error if stories list is empty', async () => {
      jest.spyOn(coreCommon, 'serverRequire').mockImplementation(async () => ({ stories: [] }));

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

    jest.spyOn(coreCommon, 'serverRequire').mockImplementation(async () => mockedMain);

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

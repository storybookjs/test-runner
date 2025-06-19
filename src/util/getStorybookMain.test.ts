import { getStorybookMain, resetStorybookMainCache, storybookMainConfig } from './getStorybookMain';
import * as coreCommon from './serverRequire';

jest.mock('./serverRequire');

describe('getStorybookMain', () => {
  beforeEach(() => {
    resetStorybookMainCache();
  });

  it('should throw an error if no configuration is found', () => {
    expect(() => getStorybookMain('.storybook')).toThrowErrorMatchingSnapshot();
  });

  describe('no stories', () => {
    it('should throw an error if no stories are defined', () => {
      jest.spyOn(coreCommon, 'serverRequire').mockImplementation(() => ({}));

      expect(() => getStorybookMain('.storybook')).toThrowErrorMatchingSnapshot();
    });

    it('should throw an error if stories list is empty', () => {
      jest.spyOn(coreCommon, 'serverRequire').mockImplementation(() => ({ stories: [] }));

      expect(() => getStorybookMain('.storybook')).toThrowErrorMatchingSnapshot();
    });
  });

  it('should return mainjs', () => {
    const mockedMain = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    };

    jest.spyOn(coreCommon, 'serverRequire').mockImplementation(() => mockedMain);

    const res = getStorybookMain('.storybook');
    expect(res).toMatchObject(mockedMain);
  });

  it('should return the configDir value if it exists', () => {
    const mockedMain = {
      stories: [
        {
          directory: '../stories/basic',
          titlePrefix: 'Example',
        },
      ],
    };
    storybookMainConfig.set('configDir', mockedMain);

    const res = getStorybookMain('.storybook');
    expect(res).toMatchObject(mockedMain);
  });
});

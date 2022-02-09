import { getStorybookMain } from './getStorybookMain';
import * as coreCommon from '@storybook/core-common';

jest.mock('@storybook/core-common');

describe('getStorybookMain', () => {
  it('should throw an error if no configuration is found', () => {
    expect(() => getStorybookMain('.storybook')).toThrow();
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
});

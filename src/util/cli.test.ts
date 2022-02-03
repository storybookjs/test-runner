import * as coreCommon from '@storybook/core-common';

import * as cliHelper from './helpers';
import { getCliOptions, getStorybookMain, defaultRunnerOptions } from './cli';

jest.mock('@storybook/core-common');

describe('CLI', () => {
  describe('getCliOptions', () => {
    it('returns default options if no extra option is passed', () => {
      const opts = getCliOptions();
      expect(opts.runnerOptions).toMatchObject(defaultRunnerOptions);
    });

    it('returns custom options if passed', () => {
      const customConfig = { configDir: 'custom', storiesJson: true };
      jest.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue(customConfig);
      const opts = getCliOptions();
      expect(opts.runnerOptions).toMatchObject(customConfig);
    });
  });

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
});

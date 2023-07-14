import { getCliOptions } from './getCliOptions';
import * as cliHelper from './getParsedCliOptions';

describe('getCliOptions', () => {
  it('returns custom options if passed', () => {
    const customConfig = { configDir: 'custom', indexJson: true };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValueOnce({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });

  it('returns extra args if passed', () => {
    const extraArgs = ['TestName', 'AnotherTestName'];
    jest.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValueOnce({ options: {}, extraArgs });
    const opts = getCliOptions();
    expect(opts.jestOptions).toEqual(extraArgs);
  });
});

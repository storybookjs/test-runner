import { getCliOptions } from './getCliOptions';
import * as cliHelper from './getParsedCliOptions';

describe('getCliOptions', () => {
  it('returns custom options if passed', () => {
    const customConfig = { configDir: 'custom', storiesJson: true };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValue({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });
});

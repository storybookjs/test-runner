import { defaultRunnerOptions, getCliOptions } from './getCliOptions';
import * as cliHelper from './getParsedCliOptions';

describe('getCliOptions', () => {
  it('returns default options if no extra option is passed', () => {
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(defaultRunnerOptions);
  });

  it('returns custom options if passed', () => {
    const customConfig = { configDir: 'custom', storiesJson: true };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValue({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });
});

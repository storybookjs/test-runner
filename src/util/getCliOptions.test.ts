import { getCliOptions } from './getCliOptions';
import * as cliHelper from './getParsedCliOptions';

describe('getCliOptions', () => {
  let originalArgv: string[] = process.argv;

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('returns custom options if passed', () => {
    const customConfig = { configDir: 'custom', indexJson: true };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValueOnce({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });

  it('returns checkConsole option if passed', () => {
    const customConfig = { checkConsole: true };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValue({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });

  it('returns extra args if passed', () => {
    const extraArgs = ['TestName', 'AnotherTestName'];
    // mock argv to avoid side effect from running tests e.g. jest --coverage,
    // which would end up caught by getCliOptions
    process.argv = [];
    jest.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValueOnce({ options: {}, extraArgs });
    const opts = getCliOptions();
    expect(opts.jestOptions).toEqual(extraArgs);
  });
});

import { getCliOptions } from './getCliOptions';
import * as cliHelper from './getParsedCliOptions';

describe('getCliOptions', () => {
  const originalArgv: string[] = process.argv;

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

  it('returns default options if no options are passed', () => {
    jest.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({ options: {}, extraArgs: [] });
    const opts = getCliOptions();
    const jestOptions = opts.jestOptions.length > 0 ? ['--coverage'] : [];
    expect(opts).toEqual({
      runnerOptions: {},
      jestOptions,
    });
  });

  it('returns failOnConsole option if passed', () => {
    const customConfig = { failOnConsole: true };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValue({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });

  it('handles boolean options correctly', () => {
    const customConfig = { coverage: true, junit: false };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValue({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts).toEqual({ jestOptions: [], runnerOptions: { coverage: true, junit: false } });
  });

  it('handles string options correctly', () => {
    const customConfig = { url: 'http://localhost:3000' };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValue({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts).toEqual({ jestOptions: [], runnerOptions: { url: 'http://localhost:3000' } });
  });

  it('handles extra arguments correctly', () => {
    jest.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({
      options: { version: true, cache: false, env: 'node' } as any,
      extraArgs: ['--watch', '--coverage'],
    });
    const opts = getCliOptions();
    expect(opts.jestOptions).toEqual([
      '--version',
      '--no-cache',
      '--env',
      'node',
      '--watch',
      '--coverage',
    ]);
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

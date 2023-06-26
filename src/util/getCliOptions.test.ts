import { getCliOptions } from './getCliOptions';
import * as cliHelper from './getParsedCliOptions';

describe('getCliOptions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns custom options if passed', () => {
    const customConfig = { configDir: 'custom', indexJson: true };
    jest
      .spyOn(cliHelper, 'getParsedCliOptions')
      .mockReturnValue({ options: customConfig, extraArgs: [] });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });

  it('returns default options if no options are passed', () => {
    jest.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({ options: {}, extraArgs: [] });
    const opts = getCliOptions();
    const jestOptions = process.argv.includes('--coverage') ? ['--coverage'] : [];
    expect(opts).toEqual({
      runnerOptions: {},
      jestOptions,
    });
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
      options: { version: true, cache: false, coverageDirectory: './test' },
      extraArgs: ['--watch', '--coverage'],
    });
    const opts = getCliOptions();
    expect(opts.jestOptions).toEqual([
      '--version',
      '--no-cache',
      '--coverageDirectory="./test"',
      '--watch',
      '--coverage',
    ]);
  });
});

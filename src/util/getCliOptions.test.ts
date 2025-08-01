import { getCliOptions } from './getCliOptions';
import * as cliHelper from './getParsedCliOptions';
import { describe, it, expect, afterEach, vi } from 'vitest';

describe('getCliOptions', () => {
  const originalArgv: string[] = process.argv;

  afterEach(() => {
    process.argv = originalArgv;
  });

  it('returns custom options if passed', () => {
    const customConfig = { configDir: 'custom', indexJson: true };
    vi.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValueOnce({
      options: customConfig,
      extraArgs: [],
    });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });

  it('returns default options if no options are passed', () => {
    vi.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({ options: {}, extraArgs: [] });
    const opts = getCliOptions();
    const jestOptions = opts.jestOptions.length > 0 ? ['--coverage'] : [];
    expect(opts).toEqual({
      runnerOptions: {},
      jestOptions,
    });
  });

  it('returns failOnConsole option if passed', () => {
    const customConfig = { failOnConsole: true };
    vi.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({
      options: customConfig,
      extraArgs: [],
    });
    const opts = getCliOptions();
    expect(opts.runnerOptions).toMatchObject(customConfig);
  });

  it('handles boolean options correctly', () => {
    const customConfig = { coverage: true, junit: false };
    vi.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({
      options: customConfig,
      extraArgs: [],
    });
    const opts = getCliOptions();
    expect(opts).toEqual({ jestOptions: [], runnerOptions: { coverage: true, junit: false } });
  });

  it('handles string options correctly', () => {
    const customConfig = { url: 'http://localhost:3000' };
    vi.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({
      options: customConfig,
      extraArgs: [],
    });
    const opts = getCliOptions();
    expect(opts).toEqual({ jestOptions: [], runnerOptions: { url: 'http://localhost:3000' } });
  });

  it('handles extra arguments correctly', () => {
    vi.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValue({
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
    vi.spyOn(cliHelper, 'getParsedCliOptions').mockReturnValueOnce({ options: {}, extraArgs });
    const opts = getCliOptions();
    expect(opts.jestOptions).toEqual(extraArgs);
  });
});

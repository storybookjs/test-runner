import { program } from 'commander';
import { getParsedCliOptions } from './getParsedCliOptions';

describe('getParsedCliOptions', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return the parsed CLI options', () => {
    const parsedCliOptions = getParsedCliOptions();
    const coverageEnabled = parsedCliOptions.options.coverage ?? false;
    if (coverageEnabled) {
      expect(parsedCliOptions).toEqual({
        options: {
          indexJson: undefined,
          configDir: '.storybook',
          coverageDirectory: 'coverage/storybook',
          watch: false,
          browsers: ['chromium'],
          url: 'http://127.0.0.1:6006',
          cache: true,
          coverage: true,
        },
        extraArgs: [],
      });
    } else {
      expect(parsedCliOptions).toEqual({
        options: {
          indexJson: undefined,
          configDir: '.storybook',
          coverageDirectory: 'coverage/storybook',
          watch: false,
          browsers: ['chromium'],
          url: 'http://127.0.0.1:6006',
          cache: true,
        },
        extraArgs: [],
      });
    }
  });

  it('should handle unknown options', () => {
    const originalWarn = console.warn;
    console.warn = jest.fn();

    const originalExit = process.exit;
    process.exit = jest.fn() as any;

    const argv = process.argv.slice();
    process.argv.push('--unknown-option');

    expect(() => {
      getParsedCliOptions();
    }).toThrow();

    expect(console.warn).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);

    process.argv = argv;
    console.warn = originalWarn;
    process.exit = originalExit;
  });

  it('handles unknown options correctly', () => {
    jest.spyOn(program, 'parse').mockImplementation(() => {
      throw new Error('Unknown error');
    });

    expect(() => {
      getParsedCliOptions();
    }).toThrow(Error);
  });
});

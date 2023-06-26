import { getParsedCliOptions } from './getParsedCliOptions';

describe('getParsedCliOptions', () => {
  it('should return the parsed CLI options', () => {
    const parsedCliOptions = getParsedCliOptions();
    expect(parsedCliOptions).toEqual({
      options: {
        indexJson: undefined,
        configDir: '.storybook',
        watch: false,
        browsers: ['chromium'],
        url: 'http://127.0.0.1:6006',
        cache: true,
      },
      extraArgs: [],
    });
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
});

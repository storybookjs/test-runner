export const getParsedCliOptions = () => {
  const { program } = require('commander');

  program
    .option('-s, --stories-json', 'Run in stories json mode (requires a compatible Storybook)')
    .option('-c, --config-dir <directory>', 'Directory where to load Storybook configurations from')
    .option('--watch', 'Run in watch mode')
    .option(
      '--browsers <browsers...>',
      'Define browsers to run tests in. Could be one or multiple of: chromium, firefox, webkit'
    )
    .option(
      '--maxWorkers <amount>',
      'Specifies the maximum number of workers the worker-pool will spawn for running tests'
    )
    .option('--no-cache', 'Disable the cache')
    .option('--clearCache', 'Deletes the Jest cache directory and then exits without running tests')
    .option('--verbose', 'Display individual test results with the test suite hierarchy')
    .option(
      '-u, --updateSnapshot',
      'Use this flag to re-record every snapshot that fails during this test run'
    )
    .option(
      '--eject',
      'Creates a local configuration file to override defaults of the test-runner. Use it only if you want to have better control over the runner configurations'
    );

  program.exitOverride();

  try {
    program.parse();
  } catch (err) {
    switch (err.code) {
      case 'commander.unknownOption': {
        program.outputHelp();
        console.warn(
          `\nIf you'd like this option to be supported, please open an issue at https://github.com/storybookjs/test-runner/issues/new\n`
        );
        process.exit(1);
      }

      case 'commander.helpDisplayed': {
        process.exit(0);
      }

      default: {
        throw err;
      }
    }
  }

  return {
    options: program.opts(),
    extraArgs: program.args,
  };
};

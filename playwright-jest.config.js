module.exports = {
  cacheDirectory: '.cache/jest',
  testMatch: ['**/*.stories.[jt]s?(x)'],
  moduleNameMapper: {
    // non-js files
    '\\.(jpg|jpeg|png|apng|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/mocks/fileMock.js',
    '\\.(css|scss|stylesheet)$': '<rootDir>/mocks/styleMock.js',
  },
  transform: {
    '^.+\\.stories\\.[jt]sx?$': './playwright/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  preset: 'jest-playwright-preset',
  globalSetup: './playwright/global-setup.js',
  globalTeardown: './playwright/global-teardown.js',
  testEnvironment: './playwright/custom-environment.js',
};

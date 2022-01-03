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
    '^.+\\.stories\\.[jt]sx?$': './jsdom/transform',
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testEnvironment: 'jest-environment-jsdom',
};

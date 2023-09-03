module.exports = {
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '@storybook/test-runner/dist/templates/global-setup': '<rootDir>/dist/templates/global-setup',
    '@storybook/test-runner/dist/templates/global-teardown':
      '<rootDir>/dist/templates/global-teardown',
    '@storybook/test-runner/dist/templates/custom-environment':
      '<rootDir>/dist/templates/custom-environment',
    '@storybook/test-runner/dist/templates/jest-setup': '<rootDir>/dist/templates/jest-setup',
  },
};

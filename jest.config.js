export default {
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  setupFiles: [
    '<rootDir>/src/tests/setupTests.js',
    '<rootDir>/src/config/env-test.js',
  ],
}

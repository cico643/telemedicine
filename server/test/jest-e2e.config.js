const { resolve } = require('path');

module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: resolve(__dirname, '..', 'tsconfig.test.json'),
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    '^src/(.*)$': resolve(__dirname, '..', './src/$1'),
  },
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['../**/*.(t|j)s'],
  setupFiles: [resolve(__dirname, './setup.ts')],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  verbose: true,
};

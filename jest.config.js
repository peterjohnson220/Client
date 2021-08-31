require('jest-preset-angular/ngcc-jest-processor');

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^environments/(.*)': '<rootDir>/environments/$1',
    '^libs/(.*)': '<rootDir>/libs/$1',
    '^assets/(.*)': '<rootDir>/assets/$1'
  }
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.supertest.ts'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'SuperTest API Test Report',
        outputPath: 'test-report.html',
        includeFailureMsg: true
      }
    ]
  ]
};

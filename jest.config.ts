import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  modulePathIgnorePatterns: ['./dist'],
  testRegex: '.*\\.(spec|acceptance|test)\\.(t|j)s$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['(src|utils|lib)/**/*.(t|j)s'],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      astTransformers: {
        before: ['test/helpers/nestjs-swagger-transformer.js'],
      },
    },
  },
};

export default config;

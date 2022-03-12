import { DynamicModule, Global, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import merge from 'lodash.merge';
import * as os from 'os';
import * as path from 'path';
import { AppConfig, AuthConfig, ServerConfig } from './app.config';

export enum Environment {
  Development = 'development',
  Test = 'test',
  ProductionBeta = 'production-beta',
  Production = 'production',
}

// Normalize NODE_ENV
process.env.NODE_ENV = process.env.NODE_ENV ?? Environment.Development;

function loadAdditionalConfig(configPath: string, existingConfig = {}, showErrors = false) {
  // Expand tilde in config path
  configPath = configPath.replace('~', os.homedir);

  try {
    if (configPath && require.resolve(configPath)) {
      // Read external config file then merge with base config
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const otherConfig = require(configPath); // Load other config
      return merge(existingConfig, otherConfig.default /* from module */ ?? otherConfig /* from json */);
    }
  } catch (error) {
    if (showErrors) console.error(error); // For debug purpose only
  }

  return existingConfig;
}

const externalConfigPath = () => {
  // Test doesn't need external files with secrets
  if (process.env.NODE_ENV === Environment.Test) return '';
  return process.env.APP_CONFIG_PATH || '~/.projects/gatherwise/config.json';
};

const nodeEnvConfigPath = () => {
  if ([Environment.Production, Environment.ProductionBeta].includes(process.env.NODE_ENV as Environment)) return '';
  return path.resolve(__dirname, `app-${process.env.NODE_ENV}.config`); // Import without extension, can be .ts, .js or .json
};

export const loadConfig = (showErrors = false): AppConfig => {
  let mergedConfig = new AppConfig(); // Init with empty AppConfig

  // Load nodeEnvConfig (if exist)
  // Overriden by externalConfig (if exist)
  for (const configPath of [nodeEnvConfigPath(), externalConfigPath()]) {
    mergedConfig = loadAdditionalConfig(configPath, mergedConfig, showErrors);
  }

  // Override with environment variables
  mergedConfig = merge(mergedConfig, {
    server: { port: process.env.PORT ? parseInt(process.env.PORT) : undefined }, // undefined doesn't change source value
  });

  // Create an instance of AppConfig from nested object
  return plainToInstance(AppConfig, mergedConfig);
};

// Loaded config
export const config = loadConfig();

@Global()
@Module({})
export class ConfigModule {
  static async forRoot(): Promise<DynamicModule> {
    const errors = await validate(config);
    if (errors.length > 0) throw new Error('Validation config fails with:\n' + errors.join('\n'));

    const providers = [
      { provide: AppConfig, useValue: config },
      { provide: ServerConfig, useValue: config.server },
      { provide: AuthConfig, useValue: config.auth },
      //{ provide: MyConfig, useValue: config.myConfig }, // Add config directly accessible from constructors
    ];

    return {
      module: ConfigModule,
      providers,
      exports: providers,
    };
  }
}

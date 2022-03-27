import { AppConfig, getMongoHost } from './app.config';

// Override default config if NODE_ENV == development
export default {
  app: {
    logLevel: 'info',
  },
  auth: {
    ignoreExpiration: true,
  },
  server: {},
  datasources: {
    mongodb: { uri: `mongodb://admin:admin@${getMongoHost()}:27017/gatherwise-dev?authSource=admin` },
  },
} as AppConfig;

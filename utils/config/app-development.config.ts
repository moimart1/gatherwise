import { AppConfig } from './app.config';

// Override default config if NODE_ENV == development
export default {
  app: {
    logLevel: 'info',
  },
  auth: {
    ignoreExpiration: true,
  },
  datasources: {},
} as AppConfig;

import { AppConfig } from './app.config';

// Override config if NODE_ENV == test
export default {
  app: {
    logLevel: 'info',
    logConsole: false,
    logFile: (process.env.TEST_RESULTS_DIR ? `${process.env.TEST_RESULTS_DIR}/` : '') + 'app.log',
  },
  auth: {
    audience: [],
    ignoreExpiration: true,
  },
  datasources: {},
} as AppConfig;

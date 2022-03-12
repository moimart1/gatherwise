import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { config, Environment } from './config';

const transports: Transport[] = [];

if (config.app.logConsole) {
  transports.push(
    new winston.transports.Console({
      level: config.app.logLevel,
      format: [Environment.Production, Environment.ProductionBeta].includes(process.env.NODE_ENV as Environment)
        ? winston.format.combine(
            // For production environments
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
            winston.format.json(),
          )
        : winston.format.combine(
            // For local environments
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
    }),
  );
}

if (config.app.logFile) {
  transports.push(
    new winston.transports.File({
      filename: config.app.logFile,
      level: config.app.logLevel,
      format: winston.format.combine(
        winston.format.ms(),
        winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message} - '${info.context}' ${info.ms}`),
      ),
    }),
  );
}

export default WinstonModule.createLogger({
  levels: winston.config.npm.levels,
  format: winston.format.combine(winston.format.timestamp()),
  transports,
});

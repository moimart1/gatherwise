import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfig } from '../utils/config';
import { AllExceptionsFilter, HttpExceptionFilter } from './common/exceptions.filter';

/**
 * Initialize common settings shared between app and test
 * @param app Nest application
 */
export function initializeApp(app: INestApplication) {
  const config = app.get(AppConfig);

  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  ); // enable ValidationPipe

  // Base path
  app.setGlobalPrefix(config.server.basePath);
}

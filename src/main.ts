import { RedocModule } from '@crissancar/nestjs-redoc';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { name, version } from '../package.json';
import { AppConfig } from '../utils/config';
import { default as logger } from '../utils/logger';
import { AppModule } from './app.module';
import { initializeApp } from './main-init';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });
  const config = app.get(AppConfig);

  // Common init
  initializeApp(app);

  // Setup Swagger / Open API
  const swaggerDocument = new DocumentBuilder()
    .setTitle('GatherWise')
    .setDescription('Easiest depensies into SplitWise')
    .setVersion(version)
    .addTag(name)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: `Except a token from '${config.auth.issuer}'` },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup(`${config.server.basePath}/explorer`, app, document);

  // Add redoc path
  await RedocModule.setup(`${config.server.basePath}/doc`, app, document, {
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
  });

  // Manage uncaught exception
  process.on('uncaughtException', (err, origin) => {
    logger.error(`Uncaught exception: '${err}' with origin: ${origin}\n${err?.stack}`);
  });

  // Using a single function to handle multiple signals
  async function handleSignals(signal) {
    logger.log(`Received ${signal}, closing app...`);
    await app?.close();
  }

  process.on('SIGINT', handleSignals);
  process.on('SIGTERM', handleSignals);

  return app.listen(config.server.port);
}

bootstrap()
  .then((server) => {
    server;
  })
  .catch((err) => {
    setImmediate(() => {
      console.error('Unable to run the server because of the following error:', err);
      process.exitCode = 1; // better than process.exit(1) => allow async tasks to finish before exit application
    });
  });

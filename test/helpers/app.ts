import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request, { SuperTest } from 'supertest';
import { AppModule } from '../../src/app.module';
import { initializeApp } from '../../src/main-init';
import logger from '../../utils/logger';

export type TestApp = INestApplication;
export type TestAppClient = SuperTest<request.Test>;

export async function createTestingApp(): Promise<{ app: TestApp; client: TestAppClient }> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useLogger(logger);

  initializeApp(app);

  await app.init();

  const client = request(app.getHttpServer());
  return { app, client };
}

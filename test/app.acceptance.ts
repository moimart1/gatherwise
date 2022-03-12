import { info } from '../utils/info';
import { createTestingApp, TestApp, TestAppClient } from './helpers/app';

describe('AppController', () => {
  let app: TestApp, client: TestAppClient;

  afterAll(async () => {
    app.close();
  });

  beforeAll(async () => {
    ({ app, client } = await createTestingApp());
  });

  it('GET /api - Info', async () => {
    return client.get('/api').expect(200).expect(info);
  });
});

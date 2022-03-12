jest.mock('jwks-rsa');
import { createTestingApp, TestApp, TestAppClient } from './helpers/app';
import { getAuthorizationHeader, Persona } from './helpers/auth';

describe('SecretController', () => {
  let app: TestApp, client: TestAppClient;

  afterAll(async () => {
    app.close();
  });

  beforeAll(async () => {
    ({ app, client } = await createTestingApp());
  });

  it('GET /secret without jwt', async () => {
    return client.get('/api/secret').expect(401);
  });

  it('CR(U)D /secret with jwt', async () => {
    const result = await client
      .post('/api/secret')
      .set(getAuthorizationHeader(Persona.Admin))
      .send({ message: 'Top secret' })
      .expect(201);
    expect(result.body).toMatchObject({ message: 'Top secret' });

    await client.get('/api/secret').set(getAuthorizationHeader(Persona.UserNoCompanyId)).expect(403);

    const resultRead = await client.get('/api/secret').set(getAuthorizationHeader(Persona.Admin)).expect(200);
    expect(resultRead.body).toMatchObject({ message: 'Top secret' });

    const resultDelete = await client.delete('/api/secret').set(getAuthorizationHeader(Persona.Admin)).expect(200);
    expect(resultDelete.body).toMatchObject({ message: '' });
  });
});

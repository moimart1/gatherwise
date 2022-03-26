import { SplitwiseService } from '../../src/splitwise/splitwise.service';
import { createTestingApp, TestApp, TestAppClient } from '../helpers/app';

describe('SplitwiseService', () => {
  let app: TestApp, client: TestAppClient, splitwiseService: SplitwiseService;

  afterAll(async () => {
    await app?.close();
  });

  beforeAll(async () => {
    ({ app, client } = await createTestingApp());
    splitwiseService = app.get(SplitwiseService);
  });

  it('Sanity', async () => {
    const user = await splitwiseService.getCurrentUser();
    expect(user).toBeDefined();

    const expenses = await splitwiseService.getExpensesByGroupName('❤️ 🎈💥🔥', { limit: 1000 });
    expect(expenses).toBeDefined();
  });
});

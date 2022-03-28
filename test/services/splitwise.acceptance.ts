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

    const expenses = await splitwiseService.getExpensesByGroupName('❤️ 🎈💥🔥', { limit: 5 });
    expect(expenses).toBeDefined();

    const categories = await splitwiseService.getCatagories();
    expect(categories).toBeDefined();

    const groups = await splitwiseService.getGroups();
    expect(groups).toBeDefined();

    const friends = await splitwiseService.getFriends();
    expect(friends).toBeDefined();

    const expense = await splitwiseService.createExpense();
    expect(expense).toBeDefined();
  });
});

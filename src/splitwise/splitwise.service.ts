import { Injectable, NotFoundException } from '@nestjs/common';
import Splitwise from 'splitwise';
import { SplitWiseConfig } from './splitwise.config';

@Injectable()
export class SplitwiseService {
  private splitwise: Splitwise;

  constructor(private config: SplitWiseConfig) {
    this.splitwise = Splitwise({
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
    });
  }

  async getCurrentUser() {
    return await this.splitwise.getCurrentUser();
  }

  async getExpensesByGroupName(groupName: string, options = {}) {
    const groups = await this.splitwise.getGroups();
    const selectedGroup = groups.find((group) => group.name === groupName);

    if (!selectedGroup) throw new NotFoundException(`Group name ${groupName} is not found`);

    return await this.splitwise.getExpenses({ ...options, group_id: selectedGroup.id });
  }

  async getCatagories() {
    return await this.splitwise.getCategories();
  }

  async getGroups() {
    return await this.splitwise.getGroups();
  }

  async getFriends() {
    return await this.splitwise.getFriends();
  }

  async createExpense() {
    return await this.splitwise.createExpense({
      cost: '25',
      description: 'Grocery run 2',
      details: 'Notes',
      date: '2022-03-28T13:00:00Z',
      repeat_interval: 'never',
      currency_code: 'CAD',
      category_id: 2, // no category
      group_id: 31659206, // test group
      users: [
        { user_id: '32579622', paid_share: '25', owed_share: '13.55' }, // test user 1
        { user_id: '49553235', paid_share: '0', owed_share: '11.45' }, // test user 2
      ],
    });
  }
}

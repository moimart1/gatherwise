import { Injectable, NotFoundException } from '@nestjs/common';
import Splitwise from 'splitwise';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
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

  async getContext() {
    return {
      groups: await this.getGroups(),
      categories: await this.getCategories(),
      friends: await this.getFriends(),
    };
  }

  async getExpenses({ limit, offset }: PaginationQueryDto) {
    return await this.splitwise.getExpenses({ limit, offset });
  }

  async getExpensesByGroupName(groupName: string, options = {}) {
    const groups = await this.splitwise.getGroups();
    const selectedGroup = groups.find((group) => group.name === groupName);

    if (!selectedGroup) throw new NotFoundException(`Group name ${groupName} is not found`);

    return await this.splitwise.getExpenses({ ...options, group_id: selectedGroup.id });
  }

  async getCategories() {
    return await this.splitwise.getCategories();
  }

  async getGroups() {
    return await this.splitwise.getGroups();
  }

  async getFriends(groupId = 31659206 /* test group */) {
    return await this.splitwise.getFriends({
      group_id: groupId,
    });
  }

  async createExpense({ cost, description, date, categoryId, groupId, users }: CreateExpenseDto) {
    return await this.splitwise.createExpense({
      cost,
      description,
      details: 'Added by Gatherwise',
      date,
      repeat_interval: 'never',
      currency_code: 'CAD', // TODO config
      category_id: categoryId,
      group_id: groupId,
      users,
    });
  }
}

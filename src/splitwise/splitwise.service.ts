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
}

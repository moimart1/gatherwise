import { Injectable } from '@nestjs/common';
import Splitwise from 'splitwise';
import { SplitWiseConfig } from './splitwise.config';

@Injectable()
export class SplitwiseService {
  private splitwise: Splitwise;

  constructor(private config: SplitWiseConfig) {
    this.splitwise = new Splitwise({
      consumerKey: config.consumerKey,
      consumerSecret: config.consumerSecret,
    });
  }

  async getCurrentUser() {
    return await this.splitwise.getCurrentUser();
  }
}

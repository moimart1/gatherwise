import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SplitwiseService } from '../../splitwise/splitwise.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private splitwise: SplitwiseService) {}
  create(createTransactionDto: CreateTransactionDto) {
    return 'This action adds a new transaction';
  }

  async findAll(pagination: PaginationQueryDto = { limit: 20 }) {
    const splitwiseExpenses = await this.splitwise.getExpenses(pagination);
    return splitwiseExpenses?.map((expense) => {
      return {
        date: expense.date,
        description: expense.description,
        cost: expense.cost,
        source: 'splitwise',
      };
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}

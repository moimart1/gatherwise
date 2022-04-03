import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

function getTransactionId(transaction: CreateTransactionDto) {
  const key = `${transaction.date}${transaction.description}${transaction.amount}`;
  return createHash('sha1').update(key).digest('hex');
}
@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private readonly model: Model<Transaction>) {}

  async create(data: CreateTransactionDto): Promise<Transaction> {
    if (!data._id) {
      data._id = getTransactionId(data);
    }

    try {
      return await new this.model(data).save();
    } catch (error) {
      return null;
    }
  }

  async findAll(pagination: PaginationQueryDto = { limit: 20 }) {
    // const splitwiseExpenses = await this.splitwise.getExpenses(pagination);
    // return splitwiseExpenses?.map((expense) => {
    //   return {
    //     date: expense.date,
    //     description: expense.description,
    //     cost: expense.cost,
    //     source: 'splitwise',
    //   };
    // });
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

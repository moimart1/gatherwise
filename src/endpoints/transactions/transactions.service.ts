import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

function getTransactionId(transaction: CreateTransactionDto) {
  const key = `${transaction.index}${transaction.date}${transaction.description}${transaction.amount}`;
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
      if (error.name === 'MongoServerError' && error.code === 1100) {
        // Duplicate keys
        return null; // continue
      }

      throw error;
    }
  }

  findAll(pagination: PaginationQueryDto): Promise<Transaction[]> {
    return this.model.find().skip(pagination.offset).limit(pagination.limit).exec();
  }

  async findOne(id: string): Promise<Transaction> {
    const result = await this.model.findById(id).exec();

    if (!result) {
      throw new NotFoundException(`When findOne() ${this.model.modelName} ${id} not found.`);
    }

    return result;
  }

  async update(id: string, data: UpdateTransactionDto): Promise<Transaction> {
    const existing = await this.model.findByIdAndUpdate(id, data, { new: true });

    if (!existing) {
      throw new NotFoundException(`When update() ${this.model.modelName} ${id} not found`);
    }

    return existing;
  }

  async remove(id: string): Promise<Transaction> {
    const deleted = await this.model.findByIdAndRemove(id);

    if (!deleted) {
      throw new NotFoundException(`When remove() ${this.model.modelName} ${id} not found`);
    }

    return deleted;
  }
}

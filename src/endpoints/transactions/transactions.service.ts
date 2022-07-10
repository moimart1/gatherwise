import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model, PipelineStage } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { FindQueryDto } from './dto/find-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction.name) private readonly model: Model<Transaction>) {}

  getTransactionId(transaction: CreateTransactionDto) {
    const key = `${transaction.index}${transaction.date}${transaction.description}${transaction.amount}`;
    return createHash('sha1').update(key).digest('hex');
  }

  async create(data: CreateTransactionDto): Promise<Transaction> {
    if (!data._id) {
      data._id = this.getTransactionId(data);
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

  findAll({ offset, limit, includeSynched }: FindQueryDto): Promise<Transaction[]> {
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'synchronizations',
          localField: '_id',
          foreignField: 'transactionId',
          as: 'sync',
        },
      },
    ];

    if (!includeSynched) {
      pipeline.push({
        $match: { $and: [{ sync: { $size: 0 } }, { reviewed: false }] },
      });
    }

    if (offset > 0) {
      pipeline.push({
        $skip: offset,
      });
    }

    if (limit > 0) {
      pipeline.push({
        $limit: limit,
      });
    }

    return this.model.aggregate(pipeline).exec();
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

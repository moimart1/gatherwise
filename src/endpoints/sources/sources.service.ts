import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import { Import } from '../import/entities/import.entity';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { MappingType, Source, SourceDocument } from './entities/source.entity';

@Injectable()
export class SourcesService {
  constructor(@InjectModel(Source.name) private readonly model: Model<Source>, private transactionService: TransactionsService) {}

  sourceIdFromFields(fields: string[], metadata = '') {
    const key = `${metadata}${fields.join('')}`;
    return createHash('sha1').update(key).digest('hex');
  }

  create(data: CreateSourceDto) {
    return 'This action adds a new source';
  }

  async findOrCreateFromFields(fields: string[], metadata = ''): Promise<SourceDocument> {
    const sourceId = this.sourceIdFromFields(fields, metadata);
    return await this.model
      .findByIdAndUpdate(
        sourceId,
        {
          $setOnInsert: {
            excludedValues: [],
            mapping: fields.reduce((acc, field) => {
              acc[field] = {};
              return acc;
            }, {}),
          },
        },
        { upsert: true, new: true },
      )
      .exec();
  }

  findAll() {
    return `This action returns all sources`;
  }

  async findById(id: string): Promise<SourceDocument> {
    const result = await this.model.findById(id).exec();

    if (!result) {
      throw new NotFoundException(`When findById() ${this.model.modelName} ${id} not found.`);
    }

    return result;
  }

  //   return {
  //     ignoredValues: ['0'],
  //     mapping: {
  //       Date: {
  //         type: MappingType.datetime,
  //       },
  //       Description: {
  //         type: MappingType.description,
  //       },
  //       Categorie: {
  //         type: MappingType.category,
  //       },
  //       Debit: {
  //         type: MappingType.amount,
  //         isNegative: true,
  //       },
  //       Credit: {
  //         type: MappingType.amount,
  //         isNegative: false,
  //       },
  //     },
  //   };
  // }

  update(id: number, updateSourceDto: UpdateSourceDto) {
    return `This action updates a #${id} source`;
  }

  remove(id: number) {
    return `This action removes a #${id} source`;
  }

  async fromImportationToTransactions(importation: Import) {
    const source = (await this.findById(importation.sourceId)).toObject();
    const transactionIds = [];

    for (const data of importation.data) {
      const transaction: CreateTransactionDto = {
        date: '',
        description: '',
        amount: 0.0,
        author: importation.author,
        index: 0, // Identify transaction with his index
      };

      for (const [key, value] of Object.entries(data)) {
        const mapping = source.mapping.get(key);
        if (!mapping) continue; //TODO manage this case
        if (!value || source.excludedValues.includes(value)) continue;

        const normalizedKey = mapping.type;
        switch (mapping.type) {
          case MappingType.amount:
            if (Number(value) == 0) continue; // ignore null values in amount
            transaction[normalizedKey] = Number(value);
            break;
          default:
            transaction[normalizedKey] = value;
            break;
        }

        if (mapping.isNegative) transaction[normalizedKey] = -1.0 * transaction[normalizedKey];
      }

      // Transaction ID is based on transaction data.
      // Sometime a transaction with the same date, description and amount can occurs. Increment index help to be unique
      transaction._id = this.transactionService.getTransactionId(transaction);
      while (transactionIds.includes(transaction._id)) {
        transaction.index++;
        transaction._id = this.transactionService.getTransactionId(transaction);
      }

      transactionIds.push(transaction._id); // saved for next transactions
      await this.transactionService.create(transaction);
    }
  }
}

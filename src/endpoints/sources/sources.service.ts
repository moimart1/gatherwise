import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Import } from '../import/entities/import.entity';
import { ImportService } from '../import/import.service';
import { CreateTransactionDto } from '../transactions/dto/create-transaction.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

function getSourceId(importation: Import) {
  const key = `${importation.mimetype}${importation.fields.join('')}`;
  return createHash('sha1').update(key).digest('hex');
}

enum MappingType {
  datetime = 'date',
  description = 'description',
  category = 'category',
  amount = 'amount',
  author = 'author',
}

@Injectable()
export class SourcesService {
  constructor(private importation: ImportService, private transactionService: TransactionsService) {}

  create(data: CreateSourceDto) {
    return 'This action adds a new source';
  }

  async findOrCreate(importation: Import) {
    return await this.findOne(getSourceId(importation)); // TODO create
  }

  findAll() {
    return `This action returns all sources`;
  }

  async findOne(id: string) {
    return {
      ignoredValues: ['0'],
      mapping: {
        Date: {
          type: MappingType.datetime,
        },
        Description: {
          type: MappingType.description,
        },
        Categorie: {
          type: MappingType.category,
        },
        Debit: {
          type: MappingType.amount,
          isNegative: true,
        },
        Credit: {
          type: MappingType.amount,
          isNegative: false,
        },
      },
    };
  }

  update(id: number, updateSourceDto: UpdateSourceDto) {
    return `This action updates a #${id} source`;
  }

  remove(id: number) {
    return `This action removes a #${id} source`;
  }

  async normalize(pagination: PaginationQueryDto) {
    const importations = await this.importation.findAll(pagination); // TODO filter already transformed
    for (const importation of importations) {
      const source = await this.findOrCreate(importation);
      if (!source) continue; // TODO give feedback

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
          const mapping = source.mapping[key];
          if (!mapping) continue; //TODO manage this case
          if (!value || source.ignoredValues.includes(value)) continue;

          const normalizedKey = mapping.type;
          transaction[normalizedKey] = value;

          if (mapping.type === MappingType.amount) transaction[normalizedKey] = Number(value);
          if (mapping.isNegative) transaction[normalizedKey] = -1.0 * transaction[normalizedKey];
        }

        // Transaction ID is based on transaction data.
        // Sometime a transaction with the same date, description and amount can occurs. Increment index help to be unique
        transaction._id = this.transactionService.getTransactionId(transaction);
        while (transactionIds.includes(transaction._id)) {
          transaction.index++;
          transaction._id = this.transactionService.getTransactionId(transaction);
        }

        this.transactionService.create(transaction);
      }
    }
  }
}

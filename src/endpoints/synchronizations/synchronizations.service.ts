import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SplitwiseService } from '../../splitwise/splitwise.service';
import { TransactionsService } from '../transactions/transactions.service';
import { SyncToSplitwiseDto } from './dto/create-synchronization.dto';
import { UpdateSynchronizationDto } from './dto/update-synchronization.dto';
import { Synchronization } from './entities/synchronization.entity';

@Injectable()
export class SynchronizationsService {
  constructor(
    @InjectModel(Synchronization.name) private readonly model: Model<Synchronization>,
    private transactionService: TransactionsService,
    private splitwise: SplitwiseService,
  ) {}

  async syncToSplitwise({ transactionId, ...data }: SyncToSplitwiseDto) {
    const { amount, ...transaction } = await this.transactionService.findOne(transactionId);
    const splitwiseResult = await this.splitwise.createExpense({
      ...data,
      ...transaction,
      cost: amount,
    });

    return await new this.model({ transactionId, outputName: 'splitwise', outputId: String(splitwiseResult.id) }).save();
  }

  getContext() {
    return this.splitwise.getContext();
  }

  findAll() {
    return `This action returns all synchronizations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} synchronization`;
  }

  update(id: number, data: UpdateSynchronizationDto) {
    return `This action updates a #${id} synchronization`;
  }

  remove(id: number) {
    return `This action removes a #${id} synchronization`;
  }
}

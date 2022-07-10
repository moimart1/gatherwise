import { BadRequestException, Injectable } from '@nestjs/common';
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

  async syncToSplitwise({ transactionId, members, note, ...data }: SyncToSplitwiseDto) {
    const { amount, description, date } = await this.transactionService.findOne(transactionId);
    let splitwiseResult;
    try {
      splitwiseResult = await this.splitwise.createExpense({
        ...data,
        description,
        date,
        cost: Math.abs(amount).toFixed(2),
        details: note,
        users: members.map((member) => {
          return {
            user_id: member.id,
            paid_share: member.paid?.toFixed(2),
            owed_share: member.owed?.toFixed(2),
          };
        }),
      });
    } catch (err) {
      throw new BadRequestException(err);
    }

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

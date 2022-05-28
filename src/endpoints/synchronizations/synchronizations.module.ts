import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SplitwiseModule } from '../../splitwise/splitwise.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { Synchronization, SynchronizationSchema } from './entities/synchronization.entity';
import { SynchronizationsController } from './synchronizations.controller';
import { SynchronizationsService } from './synchronizations.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Synchronization.name, schema: SynchronizationSchema }]),
    SplitwiseModule,
    TransactionsModule,
  ],
  controllers: [SynchronizationsController],
  providers: [SynchronizationsService],
})
export class SynchronizationsModule {}

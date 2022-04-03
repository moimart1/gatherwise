import { Module } from '@nestjs/common';
import { SplitwiseModule } from '../../splitwise/splitwise.module';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [SplitwiseModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}

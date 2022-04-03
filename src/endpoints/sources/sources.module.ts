import { Module } from '@nestjs/common';
import { ImportModule } from '../import/import.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';

@Module({
  imports: [ImportModule, TransactionsModule],
  controllers: [SourcesController],
  providers: [SourcesService],
})
export class SourcesModule {}

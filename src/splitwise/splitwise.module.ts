import { Module } from '@nestjs/common';
import { SplitwiseService } from './splitwise.service';

@Module({
  providers: [SplitwiseService],
  exports: [SplitwiseService],
})
export class SplitwiseModule {}

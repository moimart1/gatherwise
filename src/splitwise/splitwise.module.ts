import { Module } from '@nestjs/common';
import { SplitwiseService } from './splitwise.service';

@Module({
  providers: [SplitwiseService]
})
export class SplitwiseModule {}

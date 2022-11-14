import { Module } from '@nestjs/common';
import { SplitwiseModule } from '../../splitwise/splitwise.module';
import { ContactsController } from './contacts.controller';
import { ContactDatabaseModule } from './contacts.database';
import { ContactsService } from './contacts.service';

@Module({
  imports: [ContactDatabaseModule, SplitwiseModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}

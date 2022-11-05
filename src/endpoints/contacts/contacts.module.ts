import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactDatabaseModule } from './contacts.database';
import { ContactsService } from './contacts.service';

@Module({
  imports: [ContactDatabaseModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}

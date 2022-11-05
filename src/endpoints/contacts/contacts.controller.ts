import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  create(@Body() data: CreateContactDto) {
    return this.contactsService.create(data);
  }

  @Get()
  findAll(@Query() query: QueryContactDto) {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.contactsService.findById(id);
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() data: UpdateContactDto) {
    return this.contactsService.updateById(id, data);
  }

  @Delete(':id')
  removeById(@Param('id') id: string) {
    return this.contactsService.removeById(id);
  }
}

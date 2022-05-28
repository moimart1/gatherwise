import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SyncToSplitwiseDto } from './dto/create-synchronization.dto';
import { UpdateSynchronizationDto } from './dto/update-synchronization.dto';
import { SynchronizationsService } from './synchronizations.service';

@ApiTags('synchronizations')
@Controller('synchronizations')
export class SynchronizationsController {
  constructor(private readonly synchronizationsService: SynchronizationsService) {}

  @Post('splitwise')
  create(@Body() data: SyncToSplitwiseDto) {
    return this.synchronizationsService.syncToSplitwise(data);
  }

  @Get('context')
  getContext() {
    return this.synchronizationsService.getContext();
  }

  @Get()
  findAll() {
    return this.synchronizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.synchronizationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSynchronizationDto: UpdateSynchronizationDto) {
    return this.synchronizationsService.update(+id, updateSynchronizationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.synchronizationsService.remove(+id);
  }
}

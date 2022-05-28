import { PartialType } from '@nestjs/swagger';
import { CreateSynchronizationDto } from './create-synchronization.dto';

export class UpdateSynchronizationDto extends PartialType(CreateSynchronizationDto) {}

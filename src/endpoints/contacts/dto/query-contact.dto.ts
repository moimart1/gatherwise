import { IsOptional } from 'class-validator';

export class QueryContactDto {
  @IsOptional()
  search?: string;
}

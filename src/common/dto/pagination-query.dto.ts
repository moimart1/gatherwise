import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  offset?: number;
}

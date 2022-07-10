import { IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class FindQueryDto extends PaginationQueryDto {
  @IsOptional()
  includeSynched?: boolean;
}

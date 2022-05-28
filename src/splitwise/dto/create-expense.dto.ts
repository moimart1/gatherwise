import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  cost: number;

  @IsNotEmpty()
  description: string;

  /*
    ISO date of the expense
  */
  @IsDateString()
  date: string;

  @IsNotEmpty()
  categoryId: number;

  @IsOptional()
  groupId?: number;
}

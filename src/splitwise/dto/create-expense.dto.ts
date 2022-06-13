import { ArrayNotEmpty, IsDateString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

class CreateExpenseUserDto {
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  paid_share: string;

  @IsNotEmpty()
  owed_share: string;
}

export class CreateExpenseDto {
  @IsNotEmpty()
  cost: string;

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

  @ArrayNotEmpty()
  users: CreateExpenseUserDto[];
}

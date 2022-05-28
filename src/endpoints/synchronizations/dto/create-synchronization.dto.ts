import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSynchronizationDto {
  @IsNotEmpty()
  transactionId: string;
}

export class MemberDto {
  @IsNumber()
  id: number;

  @IsNumber()
  amount: number;
}

export class SyncToSplitwiseDto extends CreateSynchronizationDto {
  @IsNumber()
  categoryId: number;

  @IsNumber()
  groupId: number;

  @IsArray()
  members: MemberDto[];
}

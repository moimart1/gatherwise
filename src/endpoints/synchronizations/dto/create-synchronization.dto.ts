import { ArrayNotEmpty, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateSynchronizationDto {
  @IsNotEmpty()
  transactionId: string;
}

export class MemberDto {
  @IsNumber()
  id: number;

  /**
   * The amount paid at the moment of the transaction
   */
  @Min(0)
  paid: number;

  /**
   * The amount to share with the group
   */
  @Min(0)
  owed: number;
}

export class SyncToSplitwiseDto extends CreateSynchronizationDto {
  @IsNumber()
  categoryId: number;

  @IsNumber()
  groupId: number;

  @ArrayNotEmpty()
  members: MemberDto[];
}

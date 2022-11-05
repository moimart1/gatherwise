import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;
}

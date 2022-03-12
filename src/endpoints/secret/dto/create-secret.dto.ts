import { IsNotEmpty } from 'class-validator';

export class CreateSecretDto {
  @IsNotEmpty()
  message: string;
}

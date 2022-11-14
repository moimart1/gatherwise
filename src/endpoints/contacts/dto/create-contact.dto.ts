import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

class CreateContactLinksDto {
  @IsNotEmpty()
  service: 'splitwise' | string;

  @IsNotEmpty()
  id: string;
}

export class CreateContactDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsArray()
  links?: CreateContactLinksDto[];
}

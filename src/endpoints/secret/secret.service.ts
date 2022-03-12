import { Injectable } from '@nestjs/common';
import { CreateSecretDto } from './dto/create-secret.dto';
import { Secret } from './entities/secret.entity';

@Injectable()
export class SecretService {
  private secret: Secret = { message: '' };

  create(createSecret: CreateSecretDto) {
    this.secret.message = createSecret.message;
    return this.secret;
  }

  read(jwt: string) {
    // Can do an external HTTP call with JWT
    return this.secret;
  }

  remove() {
    this.secret.message = '';
    return this.secret;
  }
}

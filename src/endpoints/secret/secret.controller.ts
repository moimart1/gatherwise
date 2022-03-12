import { Body, Controller, Delete, Get, Logger, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Jwt } from '../../auth/jwt.decorator';
import { AllowRoles, Role, RolesGuard } from '../../auth/roles.guard';
import { User } from '../../auth/user.decorator';
import { IUser } from '../../auth/user.interface';
import { HttpExceptionFilter } from '../../common/exceptions.filter';
import { CreateSecretDto } from './dto/create-secret.dto';
import { SecretService } from './secret.service';

@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('secret')
@UseFilters(HttpExceptionFilter)
export class SecretController {
  private readonly logger = new Logger(SecretController.name);

  constructor(private readonly secretService: SecretService) {}

  @Post()
  @AllowRoles(Role.Admin, Role.SuperAdmin)
  create(@Body() createSecretDto: CreateSecretDto, @User() user: IUser) {
    this.logger.log(`User ${user.sub} creating a secret`);
    return this.secretService.create(createSecretDto);
  }

  @Get()
  @AllowRoles(Role.SuperAdmin)
  findAll(@Jwt() jwt: string) {
    return this.secretService.read(jwt);
  }

  @Delete()
  @AllowRoles(Role.User, Role.Admin, Role.SuperAdmin)
  remove() {
    return this.secretService.remove();
  }
}

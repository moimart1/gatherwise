import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { extractJwt } from './jwt.strategy';

export const Jwt = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const jwt = extractJwt(request);
  if (!jwt) throw new BadRequestException('JWT expected in `Authorization` header');

  return jwt;
});

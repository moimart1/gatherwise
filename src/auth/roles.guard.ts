import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';

export enum Role {
  User = 'user',
  Admin = 'company-admin',
  SuperAdmin = 'app-admin',
}

export const ROLES_KEY = 'roles';
export const AllowRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredRoles) {
      // Not using role
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

export const RolesGuardModule = {
  provide: APP_GUARD,
  useClass: RolesGuard,
};

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log(
      '🚀 ~ file: role.guard.ts:20 ~ RolesGuard ~ canActivate ~ user:',
      user,
    );

    if (user.role === Role.admin) {
      return true;
    }

    if (requiredRoles.includes(Role.user) && user.role === Role.user) {
      return true;
    }

    if (requiredRoles.includes(Role.hotelier) && user.role === Role.hotelier) {
      return true;
    }

    return false;
  }
}

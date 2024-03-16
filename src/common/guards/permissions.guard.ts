import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const [req] = context.getArgs();
    const user = req?.user;

    if (user) {
      if (roles !== undefined || roles?.length > 0) {
        if (roles.includes(user?.role)) return true;
        else throw new ForbiddenException('Insufficient Permissions!');
      }
    }

    return true;
  }
}

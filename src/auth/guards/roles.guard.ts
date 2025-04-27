import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key.decorators';
import { ROLES } from 'src/constants/roles';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    try {
      // Check if the route is public
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );

      if (isPublic) {
        return true;
      }
      // Check if the route has roles defined
      const roles = this.reflector.get<Array<keyof typeof ROLES>>(
        ROLES_KEY,
        context.getHandler(),
      );
      // Check if the route has admin access
      const admin = this.reflector.get<string>(ADMIN_KEY, context.getHandler());

      const request = context.switchToHttp().getRequest<Request>();

      const { roleUser } = request;

      if (!roles) {
        if (!admin || roleUser === admin) {
          return true;
        } else {
          throw new ErrorManager({
            type: HttpStatus.FORBIDDEN,
            message: 'You do not have permission to access this resource',
          });
        }
      }

      if (roleUser === (ROLES.ADMIN as string)) {
        return true;
      }

      const isAuth = roles.some((role) => role === roleUser);

      if (!isAuth) {
        throw new ErrorManager({
          type: HttpStatus.FORBIDDEN,
          message: 'You do not have permission to access this resource',
        });
      }

      return true;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }
}

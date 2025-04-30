import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ErrorManager } from 'src/utils/error.manager';
import { USER_OWNER_KEY } from 'src/constants/key.decorators';
import { ROLES } from 'src/constants/roles'; // Import your ROLES enum/object

@Injectable()
export class UserOwnerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    try {
      // Check if the @IsUserOwner() decorator is present on the handler
      const isUserOwner = this.reflector.get<boolean>(
        USER_OWNER_KEY,
        context.getHandler(),
      );

      // If the decorator is not present, allow access
      if (!isUserOwner) {
        return true;
      }

      const request = context.switchToHttp().getRequest<Request>();
      const userIdFromRequest = request.idUser; // Get the user ID from the request
      const userRole = request.roleUser; // Get the user's role
      const userIdFromParams = request.params.id;

      if (!userIdFromRequest) {
        throw new ErrorManager({
          type: HttpStatus.UNAUTHORIZED,
          message: 'User not authenticated',
        });
      }

      // Allow access if the user is an admin
      if (userRole === (ROLES.ADMIN as string)) {
        return true;
      }

      if (userIdFromRequest === userIdFromParams) {
        return true;
      } else {
        throw new ErrorManager({
          type: HttpStatus.FORBIDDEN,
          message: 'You do not have permission to access this user data',
        });
      }
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }
}

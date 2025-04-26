import { IUseToken } from '../interfaces/auth.interface';
import { useToken } from 'src/utils/user.token';
import { PUBLIC_KEY } from 'src/constants/key.decorators';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersService } from 'src/users/services/users.service';

import { Request } from 'express';

import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * @description Check if the user is authenticated
   * @param context
   * @returns boolean
   */
  async canActivate(context: ExecutionContext) {
    try {
      const isPublic = this.reflector.get<boolean>(
        PUBLIC_KEY,
        context.getHandler(),
      );

      if (isPublic) {
        return true;
      }

      const request = context.switchToHttp().getRequest<Request>();

      const token = request.headers['authorization']?.split(' ')[1];
      if (!token || Array.isArray(token)) {
        throw new ErrorManager({
          type: HttpStatus.UNAUTHORIZED,
          message: 'Token not found',
        });
      }

      const manageToken: IUseToken | string = useToken(token);

      if (typeof manageToken === 'string') {
        throw new ErrorManager({
          type: HttpStatus.UNAUTHORIZED,
          message: manageToken,
        });
      }

      if (manageToken.isExpired)
        throw new ErrorManager({
          type: HttpStatus.UNAUTHORIZED,
          message: 'Token expired',
        });

      const { sub } = manageToken;

      const user = await this.userService.findUserById(sub);

      if (!user) {
        throw new ErrorManager({
          type: HttpStatus.UNAUTHORIZED,
          message: 'Invalid user',
        });
      }

      request.idUser = user.id;
      request.roleUser = user.role;

      return true;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }
}

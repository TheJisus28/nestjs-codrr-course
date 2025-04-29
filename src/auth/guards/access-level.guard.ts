import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ACCESS_LEVEL_KEY } from 'src/constants/key.decorators';
import { UsersService } from 'src/users/services/users.service';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const { idUser } = request; // Assuming user ID is always available at this point

      const accessLevel = this.reflector.get<number>(
        ACCESS_LEVEL_KEY,
        context.getHandler(),
      );

      if (accessLevel !== undefined) {
        const user = await this.userService.findUserById(idUser);

        const userExistsInProject = user?.projectsIncludes.find(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (project) => project.project.id === request.body.project,
        );

        if (!userExistsInProject) {
          throw new ErrorManager({
            type: HttpStatus.UNAUTHORIZED,
            message: 'You are not part of this project',
          });
        }

        if (accessLevel !== (userExistsInProject.accessLevel as number)) {
          throw new ErrorManager({
            type: HttpStatus.FORBIDDEN,
            message:
              'You do not have permission to access this resource (access level mismatch)',
          });
        }
      }

      return true; // Allow access if no accessLevel is defined or if the check passes
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }
}

import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ACCESS_LEVEL_KEY } from 'src/constants/key.decorators';
import { ROLES } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  /**
   * Initializes the guard with the Reflector for metadata access and the UsersService for user retrieval.
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  /**
   * Implements the CanActivate interface to control route access based on the user's access level within a specific project.
   * It reads the required access level from the route metadata and compares it with the user's project role.
   * @param context Provides context about the current execution, including the incoming request.
   * @returns A boolean indicating whether the request should be allowed to proceed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      // user's ID is available in the request object.
      const { idUser } = request;
      const { roleUser } = request;

      // Allow access if the user is an admin
      if (roleUser === (ROLES.ADMIN as string)) {
        return true;
      }

      // Retrieves the required access level for the route handler using the defined metadata key.
      const accessLevel = this.reflector.get<number>(
        ACCESS_LEVEL_KEY,
        context.getHandler(),
      );

      // Proceed with access level validation only if the ACCESS_LEVEL_KEY is present in the route metadata.
      if (accessLevel !== undefined) {
        // Fetches the user's complete information from the database.
        const user = await this.userService.findUserById(idUser);

        // Checks if the user is associated with the project specified in the request body.
        const userExistsInProject = user?.projectsIncludes.find(
          // This comment is added because TypeScript might not be able to fully infer the types of nested properties here,
          // but we expect 'project' and 'project.id' to exist at runtime.
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (project) => project.project.id === request.body.project,
        );

        // If the user is not associated with the requested project, access is denied with an Unauthorized error.
        if (!userExistsInProject) {
          throw new ErrorManager({
            type: HttpStatus.UNAUTHORIZED,
            message: 'You are not part of this project',
          });
        }

        // Compares the required access level with the user's access level within the identified project.
        if (accessLevel !== (userExistsInProject.accessLevel as number)) {
          // If the user's access level does not match the required level, access is denied with a Forbidden error.
          throw new ErrorManager({
            type: HttpStatus.FORBIDDEN,
            message:
              'You do not have permission to access this resource (access level mismatch)',
          });
        }
      }

      // If no specific access level is required for the route, or if the user's access level meets the requirements, allow access.
      return true;
    } catch (error) {
      // Handles any errors that occur during the guard's execution.
      throw ErrorManager.handleError(error);
    }
  }
}

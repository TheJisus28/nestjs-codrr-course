// --- Project imports

// Decorators
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { IsUserOwner } from 'src/auth/decorators/is-user-owner.decorator';

// Guards
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { UserOwnerGuard } from 'src/auth/guards/user-owner.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

// Services
import { UsersService } from '../services/users.service';

// DTOs
import { UserDTO, UserToProjectDTO } from '../dto/user.dto';

// ---NestJS imports

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard, UserOwnerGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @PublicAccess()
  @Post('register')
  public async userRegister(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }

  @AccessLevel(50)
  @Post('add-to-project')
  public async addToProject(@Body() body: UserToProjectDTO) {
    return await this.userService.relationToProject(body);
  }

  @AdminAccess()
  @Get('all')
  public async getAllUsers() {
    return await this.userService.findUsers();
  }

  @IsUserOwner()
  @Get(':id')
  public async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.findUserById(id);
  }

  @IsUserOwner()
  @Put(':id')
  public async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UserDTO,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @IsUserOwner()
  @Delete(':id')
  public async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.deleteUser(id);
  }
}

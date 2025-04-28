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
import { UsersService } from '../services/users.service';
import { UserDTO, UserToProjectDTO } from '../dto/user.dto';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
//import { Roles } from 'src/auth/decorators/roles.decorator';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';

@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @PublicAccess()
  @Post('register')
  public async userRegister(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }

  @PublicAccess()
  @Post('add-to-project')
  public async addToProject(@Body() body: UserToProjectDTO) {
    return await this.userService.relationToProject(body);
  }

  @AdminAccess()
  @Get('all')
  public async getAllUsers() {
    return await this.userService.findUsers();
  }

  @PublicAccess()
  @Get(':id')
  public async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.findUserById(id);
  }

  @PublicAccess()
  @Put(':id')
  public async updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UserDTO,
  ) {
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  public async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.deleteUser(id);
  }
}

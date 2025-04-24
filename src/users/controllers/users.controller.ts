import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDTO, UserToProjectDTO } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  public async userRegister(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }

  @Post('add-to-project')
  public async addToProject(@Body() body: UserToProjectDTO) {
    return await this.userService.relationToProject(body);
  }

  @Get('all')
  public async getAllUsers() {
    return await this.userService.findUsers();
  }

  @Get(':id')
  public async getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.userService.findUserById(id);
  }

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

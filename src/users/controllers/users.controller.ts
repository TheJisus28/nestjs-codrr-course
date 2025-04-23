import { Body, Controller, Get } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDTO } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('register')
  public async userRegister(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDTO } from '../dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  public async userRegister(@Body() body: UserDTO) {
    return await this.userService.createUser(body);
  }
}

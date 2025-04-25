import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO } from '../dtos/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() { username, password }: AuthDTO) {
    const userValidate = await this.authService.validateUser(
      username,
      password,
    );

    const jwt = this.authService.generateJWT(userValidate);
    return jwt;
  }
}

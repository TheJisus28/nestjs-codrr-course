import { UsersService } from 'src/users/services/users.service';

import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userservice: UsersService) {}

  public async validateUser(username: string, password: string) {
    const userByUsername = await this.userservice.findBy({
      key: 'username',
      value: username,
    });
    const userByEmail = await this.userservice.findBy({
      key: 'email',
      value: username,
    });
    const user = userByUsername || userByEmail;

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) return user;
    }

    return null;
  }
}

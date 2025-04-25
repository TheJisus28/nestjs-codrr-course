import { UsersService } from 'src/users/services/users.service';
import { UserEntity } from 'src/users/entities/users.entity';
import { PayloadToken } from '../interfaces/auth.interface';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { HttpStatus, Injectable } from '@nestjs/common';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class AuthService {
  constructor(private readonly userservice: UsersService) {}

  public async validateUser(username: string, password: string) {
    try {
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

      throw new ErrorManager({
        type: HttpStatus.UNAUTHORIZED,
        message: `Invalid credentials`,
      });
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public signJWT({
    payload,
    secret,
    expires,
  }: {
    payload: jwt.JwtPayload;
    secret: string;
    expires: string | number;
  }) {
    const options: jwt.SignOptions = {
      expiresIn: expires as jwt.SignOptions['expiresIn'],
    };
    return jwt.sign(payload, secret, options);
  }

  public async generateJWT(user: UserEntity) {
    const getUser = await this.userservice.findUserById(user.id);

    if (!getUser) {
      throw new ErrorManager({
        type: HttpStatus.NOT_FOUND,
        message: `User not found`,
      });
    }
    const payload: PayloadToken = {
      role: getUser.role,
      sub: getUser.id,
    };

    return {
      access_token: this.signJWT({
        payload,
        secret: process.env.JWT_SECRET,
        expires: '1h',
      }),
      user,
    };
  }
}

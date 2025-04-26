import { AuthTokenResult, IUseToken } from 'src/auth/interfaces/auth.interface';
import * as jwt from 'jsonwebtoken';
import { ErrorManager } from './error.manager';

export const useToken = (token: string): IUseToken | string => {
  try {
    const decoded = jwt.decode(token) as AuthTokenResult;

    const currentDate = new Date();
    const expirationDate = new Date(decoded.exp);

    return {
      sub: decoded.sub,
      role: decoded.role,
      isExpired: +expirationDate <= +currentDate / 1000,
    };
  } catch (error) {
    throw ErrorManager.handleError(error);
  }
};

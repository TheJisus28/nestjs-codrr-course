import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorManager extends Error {
  constructor({ type, message }: { type: HttpStatus; message: string }) {
    super(message);
    this.name = HttpStatus[type];
  }

  public static handleError(error: any): HttpException {
    if (error instanceof ErrorManager) {
      return new HttpException(
        error.message,
        HttpStatus[error.name as keyof typeof HttpStatus] ||
          HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (error instanceof HttpException) {
      return error;
    } else if (error instanceof Error) {
      return new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      // Log unknown errors to the console
      console.error('Unknown error occurred:', error);
      return new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

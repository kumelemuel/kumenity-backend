import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

const errorMap = new Map([
  ['UserAlreadyExistsError', HttpStatus.CONFLICT],
  ['InvalidArgumentError', HttpStatus.BAD_REQUEST],
]);

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      errorMap.get(exception.name) || HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).json({
      message: exception.message,
      error: exception.name,
    });
  }
}

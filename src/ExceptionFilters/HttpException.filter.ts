import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorMessage = exception.getResponse() as any;

    // Error Logging
    Logger.error(errorMessage);

    // Error response
    response.status(status).json({
      error: 'true',
      statusCode: status,
      timestamp: new Date().toISOString(),
      location: request.url,
      msg_code: errorMessage.code || 'Validation Pipe Error',
      msg: errorMessage.message,
    });
  }
}

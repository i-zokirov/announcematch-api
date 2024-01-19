import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = this.formatErrorResponse(exception, status, request);

    // Log the error
    console.error(errorResponse);
    console.error(exception);

    // Send the custom error response
    response.status(status).json(errorResponse);
  }

  private formatErrorResponse(
    exception: unknown,
    status: number,
    request: any,
  ) {
    const errorResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as any)
        : null;
    const generatedResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    if (!errorResponse) {
      return { ...generatedResponse, message: 'Internal Server Error' };
    } else {
      return {
        ...generatedResponse,
        ...errorResponse,
      };
    }
  }
}

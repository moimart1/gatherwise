import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ClientRequest } from 'http';

class BaseExceptionFilter implements ExceptionFilter {
  protected readonly logger = new Logger(BaseExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost, options?: { statusCode: number; internalMessage?: string }) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = exception.message || null;

    const body = {
      error: {
        status: options.statusCode ?? 500,
        code: (exception as any).code ?? exception.name,
        message,
        endpoint: request.url,
      },
    };

    this.logger.warn(
      `'${request.method.toLocaleUpperCase()} ${request.url}' returns ${body.error.status}: ${
        options.internalMessage ? options.internalMessage : ''
      } -- ${exception.stack ? exception.stack : exception}`,
    );

    response.status(body.error.status).json(body);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  protected readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    let internalMessage = '';
    if (exception instanceof BadRequestException) {
      const { message } = exception.getResponse() as { message: Array<string> };
      if (Array.isArray(message)) {
        // Manage validation errors
        exception.message = `${exception.message}: ${message.join(', ')}`;
      }
    } else if (exception instanceof UnauthorizedException) {
      const request = host.switchToHttp().getRequest<Request>();
      // Read additional info in req.authInfo
      internalMessage = request.authInfo.toString();
    }

    return super.catch(exception, host, { statusCode: exception.getStatus(), internalMessage });
  }
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  protected readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    let internalMessage = exception.message;
    exception.message = 'Internal server error';

    if (exception.isAxiosError === true && exception.request) {
      const req = exception.request as ClientRequest;
      internalMessage += ` when ${req.method} ${req.path} on ${req.host}`;
    }

    return super.catch(exception, host, { statusCode: 500, internalMessage });
  }
}

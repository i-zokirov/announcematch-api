// ws-logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from 'src/winston-logger/winston-logger.service';

@Injectable()
export class WsLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WinstonLoggerService)
    private readonly logger: WinstonLoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient();
    const data = wsContext.getData();

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `WS message from client ${client.id}: ${JSON.stringify(
            data,
          )} - ${Date.now() - now}ms`,
        );
      }),
    );
  }
}

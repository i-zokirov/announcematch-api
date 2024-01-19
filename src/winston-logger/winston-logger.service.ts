// winston-logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.colorize({ all: true }),
          ),
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.log('info', message);
  }

  error(message: string, trace: string) {
    this.logger.log('error', message, { trace });
  }

  warn(message: string) {
    this.logger.log('warn', message);
  }

  debug(message: string) {
    this.logger.log('debug', message);
  }

  verbose(message: string) {
    this.logger.log('verbose', message);
  }
}

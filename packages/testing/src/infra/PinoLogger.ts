import pino from 'pino';
import { LoggerPort } from '../ports/LoggerPort';

export class PinoLogger implements LoggerPort {
  private readonly logger = pino({ name: 'code-review-quality' });

  info(message: string, metadata?: Record<string, unknown>): void {
    this.logger.info(metadata ?? {}, message);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.logger.error(metadata ?? {}, message);
  }
}

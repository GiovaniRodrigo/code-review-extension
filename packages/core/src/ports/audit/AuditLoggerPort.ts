export interface AuditLoggerPort {
  info(message: string, data?: Record<string, unknown>): Promise<void>;
  warning(message: string, data?: Record<string, unknown>): Promise<void>;
  error(message: string, error?: unknown, data?: Record<string, unknown>): Promise<void>;
}

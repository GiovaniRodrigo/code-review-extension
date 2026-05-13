import { AuditLogEntry, AuditLogService } from '@code-review/domain';

export class FileAuditLogService implements AuditLogService {
  private logs: AuditLogEntry[] = [];

  constructor(private storagePath?: string) {}

  async log(action: string, actor: string, metadata: any): Promise<void> {
    const entry: AuditLogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      action,
      actor,
      metadata
    };

    this.logs.push(entry);
    console.log(`[AUDIT] ${entry.timestamp.toISOString()} - ${actor}: ${action}`, metadata);
    
    if (this.storagePath) {
       // In a real implementation, append to a file here
    }
  }

  async getLogs(filter?: any): Promise<AuditLogEntry[]> {
    return this.logs;
  }
}

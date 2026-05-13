export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  metadata: any;
}

export interface AuditLogService {
  log(action: string, actor: string, metadata: any): Promise<void>;
  getLogs(filter: any): Promise<AuditLogEntry[]>;
}

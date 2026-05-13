export type FindingSeverity = 'info' | 'warning' | 'error';
export type FindingStatus = 'pending' | 'approved' | 'rejected' | 'fixed';

export interface Finding {
  id: string;
  file: string;
  line: number;
  column?: number;
  message: string;
  severity: FindingSeverity;
  suggestedFix?: string;
  status: FindingStatus;
  confidenceScore?: number;
}

export interface TechnicalComment {
  id: string;
  findingId: string;
  file: string;
  line: number;
  body: string;
  status: 'open' | 'resolved';
  createdAt: Date;
}

export interface ReviewSession {
  id: string;
  branch: string;
  findings: Finding[];
  comments: TechnicalComment[];
  createdAt: Date;
  updatedAt: Date;
  remote?: {
    provider: string;
    url: string;
    number: string | number;
    owner: string;
    repo: string;
  };
}

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

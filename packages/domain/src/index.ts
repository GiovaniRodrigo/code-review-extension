export type FindingSeverity = 'info' | 'warning' | 'error';
export type FindingStatus = 'pending' | 'approved' | 'rejected' | 'fixed';

export interface FindingComment {
  id: string;
  author: 'developer' | 'ai';
  body: string;
  createdAt: Date;
}

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
  discussion?: FindingComment[];
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

export * from './shared/DomainError';
export * from './shared/Entity';
export * from './shared/ValueObject';
export * from './sync/entities/SyncProvider';
export * from './sync/entities/SyncSession';
export * from './access/policies/AccessPolicy';
export * from './rag/entities/RagDocument';

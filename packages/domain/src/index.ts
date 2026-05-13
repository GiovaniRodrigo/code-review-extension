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
}

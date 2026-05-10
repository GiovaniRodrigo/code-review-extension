export interface CollaborationMessage {
  id: string;
  threadId: string;
  author: string;
  body: string;
  mentions: string[];
  createdAt: string;
}

export interface CollaborationNotification {
  id: string;
  recipient: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export type PartialApprovalScope = 'module' | 'file';

export interface PartialApproval {
  id: string;
  scope: PartialApprovalScope;
  target: string;
  reviewer: string;
  status: 'APPROVED' | 'REVOKED';
  createdAt: string;
}

export function extractMentions(body: string): string[] {
  return Array.from(new Set(Array.from(body.matchAll(/@([a-zA-Z0-9_.-]+)/g)).map((match) => match[1])));
}

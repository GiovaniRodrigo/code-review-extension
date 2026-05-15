import { Finding, ReviewSession, AuditLogEntry, AuditLogService } from '@code-review/domain';

export interface IDEAdapter {
  getActiveFileContent(): Promise<string>;
  getActiveFilePath(): Promise<string>;
  getActiveBranch(): Promise<string>;

  getBranchCommits(baseBranch: string): Promise<BranchCommit[]>;
  getCommitChangedFiles(commitHash: string): Promise<CommitChangedFile[]>;
  getCommitDiff(commitHash: string): Promise<string>;
  getCommitChangeSet(commitHash: string): Promise<CommitChangeSet>;

  showFinding(finding: Finding): Promise<void>;
  focusFinding(finding: Finding): Promise<void>;
  applyFix(finding: Finding): Promise<void>;
  showNotification(
    message: string,
    type: 'info' | 'warning' | 'error'
  ): Promise<void>;
  onBranchChange(callback: (branch: string) => void): void;
  clearDiagnostics(): void;
  dispose(): void;
}

export interface AIAnalysisInput {
  code: string;
  language?: string;
  filePath: string;
  context?: string;
}

export interface AIAnalysisResult {
  findings: Partial<Finding>[];
  confidenceScore: number;
}

export interface AIProvider {
  analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}

export interface ReviewRepository {
  saveSession(session: ReviewSession): Promise<void>;
  getSessionByBranch(branch: string): Promise<ReviewSession | null>;
  getSessionById(id: string): Promise<ReviewSession | null>;
  getAllSessions(): Promise<ReviewSession[]>;
  deleteSession(id: string): Promise<void>;
}

export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
}

export interface VectorStore {
  add(id: string, vector: number[], metadata: any): Promise<void>;
  query(vector: number[], limit: number): Promise<any[]>;
}

export interface PRComment {
  file: string;
  line: number;
  body: string;
}

export interface GitProvider {
  publishComments(
    owner: string,
    repo: string,
    prNumber: number,
    comments: PRComment[]
  ): Promise<void>;
}

export interface BranchCommit {
  hash: string;
  message: string;
  author?: string;
  date?: string;
}

export interface CommitChangedFile {
  path: string;
  status: 'added' | 'modified' | 'deleted' | 'renamed' | 'unknown';
}

export interface CommitChangeSet {
  commit: BranchCommit;
  files: CommitChangedFile[];
  diff: string;
}

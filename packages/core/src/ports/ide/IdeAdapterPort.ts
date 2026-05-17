import { Finding } from '@code-review/domain';

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

export interface PullRequestInfo {
  number: number;
  owner: string;
  repo: string;
  provider: 'github' | 'gitlab';
}

export interface IdeAdapterPort {
  getActiveFileContent(): Promise<string>;
  getActiveFilePath(): Promise<string>;
  getActiveBranch(): Promise<string>;
  getUncommittedChangesLines(filePath: string): Promise<number[]>;

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
  syncDiagnostics(findings: Finding[]): Promise<void>;
  
  getPullRequestInfo?(): Promise<PullRequestInfo | null>;
  getBranchDiff?(baseBranch: string): Promise<string>;
  
  dispose(): void;
}

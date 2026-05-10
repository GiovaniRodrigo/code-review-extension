import { ReviewSession, GitContext, SourceFile, AssistedIntelligenceReport, ReviewMetrics, IntegrationDescriptor, VSCodeContextState, Translations } from '../domain';

export interface ReviewSessionRepository {
  getCurrent(): Promise<ReviewSession | undefined>;
  getById(id: string): Promise<ReviewSession | undefined>;
  saveCurrent(session: ReviewSession): Promise<void>;
  list(): Promise<ReviewSession[]>;
  delete?(id: string): Promise<void>;
  exportDatabase?(): Promise<string>;
  createBackup?(): Promise<string>;
  syncToRemote?(targetPath?: string): Promise<string>;
}

export interface GitService {
  getContext(): Promise<GitContext>;
}

export interface SourceFileProvider {
  readFiles(paths: string[]): Promise<SourceFile[]>;
}

export interface AuditService {
  registerSessionSnapshot(session: ReviewSession): Promise<void>;
  exportData(): Promise<string>;
}

export interface PerformanceState {
  cacheEnabled: boolean;
  lazySessionLimit: number;
  incrementalBatchSize: number;
  asyncProcessingEnabled: boolean;
}

export interface DashboardState {
  currentSession?: ReviewSession;
  git: GitContext;
  sessions: ReviewSession[];
  metrics: ReviewMetrics;
  intelligence: AssistedIntelligenceReport;
  performance: PerformanceState;
  integrations: IntegrationDescriptor[];
  currentUser: string;
  translations: Translations;
  vscode?: VSCodeContextState;
}

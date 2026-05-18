import { Finding, ReviewSession, AuditLogService } from '@code-review/domain';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';
import { CodeReviewService } from '../../services/review/CodeReviewService';
import { IdeWorkspacePort } from '../../../ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../ports/ide/IdeFileSystemPort';

export interface AnalyzeWorkspaceInput {
  branch?: string;
  maxFiles?: number;
  onProgress?: (progress: { current: number; total: number; file: string }) => void;
  signal?: AbortSignal;
}

export class AnalyzeWorkspaceUseCase {
  constructor(
    private readonly workspace: IdeWorkspacePort,
    private readonly fileSystem: IdeFileSystemPort,
    private readonly analysisService: AIAnalysisService,
    private readonly reviewService: CodeReviewService,
    private readonly auditLog?: AuditLogService
  ) {}

  async execute(input: AnalyzeWorkspaceInput): Promise<ReviewSession> {
    const branch = input.branch || 'workspace';
    const rawFilePaths = await this.workspace.findFiles('**/*.{php,ts,tsx,js,jsx,vue}');
    const filePaths = rawFilePaths
      .filter((filePath) => !this.isIgnoredPath(filePath))
      .sort((left, right) => this.getPathPriority(right) - this.getPathPriority(left))
      .slice(0, input.maxFiles ?? 250);
    const total = filePaths.length;

    if (this.auditLog) {
      await this.auditLog.log('workspace_analysis_start', 'developer', { totalFiles: total, branch });
    }

    let session = await this.reviewService.getByBranch(branch);
    if (!session) {
      session = await this.reviewService.create(branch, []);
    }

    const allFindings: Finding[] = [...session.findings];

    for (let i = 0; i < filePaths.length; i++) {
      if (input.signal?.aborted) break;

      const filePath = filePaths[i];
      if (input.onProgress) {
        input.onProgress({ current: i + 1, total, file: filePath });
      }

      try {
        const code = await this.fileSystem.readFile(filePath);
        if (!code.trim()) continue;

        const result = await this.analysisService.analyze({
          code,
          filePath,
          mode: 'fast',
          signal: input.signal
        });

        const newFindings: Finding[] = result.findings.map((f, index) => ({
          id: `ai-workspace-${Date.now()}-${i}-${index}`,
          file: f.file || filePath,
          line: f.line || 1,
          column: f.column,
          message: f.message,
          severity: f.severity as any,
          status: 'pending' as any,
          confidenceScore: f.confidenceScore,
          suggestedFix: f.suggestedFix
        }));

        allFindings.push(...newFindings);
      } catch (e) {
        console.error(`[WORKSPACE] Failed to analyze ${filePath}:`, e);
      }
    }

    const uniqueFindings = allFindings.filter((f, index, self) =>
      index === self.findIndex((t) => (
        t.file === f.file && t.line === f.line && t.message === f.message
      ))
    );

    session.findings = uniqueFindings.slice(0, 500);
    session.updatedAt = new Date();
    await this.reviewService.update(session);

    return session;
  }

  private isIgnoredPath(filePath: string): boolean {
    const normalized = filePath.replace(/\\/g, '/').toLowerCase();
    return [
      '/node_modules/',
      '/vendor/',
      '/dist/',
      '/build/',
      '/coverage/',
      '/.git/',
      '/.next/',
      '/.turbo/',
      '/out/',
      '/storage/',
      '/bootstrap/cache/',
      '/cypress/e2e/2-advanced-examples/',
      '/cypress/fixtures/',
      '/cypress/support/',
      '/tests/fixtures/',
      '/__fixtures__/',
      '/examples/'
    ].some((segment) => normalized.includes(segment));
  }

  private getPathPriority(filePath: string): number {
    const normalized = filePath.replace(/\\/g, '/').toLowerCase();

    if (normalized.includes('/app/')) return 100;
    if (normalized.includes('/routes/')) return 90;
    if (normalized.includes('/resources/js/')) return 80;
    if (normalized.includes('/resources/views/')) return 70;
    if (normalized.includes('/database/migrations/')) return 60;
    if (normalized.includes('/src/')) return 50;
    if (normalized.includes('/tests/') || normalized.includes('/cypress/')) return 10;

    return 30;
  }
}

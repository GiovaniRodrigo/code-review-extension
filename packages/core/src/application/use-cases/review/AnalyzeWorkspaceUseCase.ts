import { Finding, ReviewSession } from '@code-review/domain';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';
import { CodeReviewService } from '../../services/review/CodeReviewService';
import { IdeWorkspacePort } from '../../../ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../ports/ide/IdeFileSystemPort';

export interface AnalyzeWorkspaceInput {
  branch: string;
  onProgress?: (progress: { current: number; total: number; file: string }) => void;
  signal?: AbortSignal;
}

export class AnalyzeWorkspaceUseCase {
  constructor(
    private readonly workspace: IdeWorkspacePort,
    private readonly fileSystem: IdeFileSystemPort,
    private readonly analysisService: AIAnalysisService,
    private readonly reviewService: CodeReviewService
  ) {}

  async execute(input: AnalyzeWorkspaceInput): Promise<ReviewSession> {
    const filePaths = await this.workspace.findFiles('**/*.{ts,tsx,js,jsx}');
    const total = filePaths.length;
    
    let session = await this.reviewService.getByBranch(input.branch);
    if (!session) {
      session = await this.reviewService.create(input.branch, []);
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
          file: f.file,
          line: f.line,
          column: f.column,
          message: f.message,
          severity: f.severity as any,
          status: 'pending' as any,
          confidenceScore: f.confidence,
          suggestedFix: f.suggestedFix
        }));

        allFindings.push(...newFindings);
      } catch (e) {
        console.error(`[WORKSPACE] Failed to analyze ${filePath}:`, e);
      }
    }

    // Deduplicate and update session
    const uniqueFindings = allFindings.filter((f, index, self) =>
        index === self.findIndex((t) => (
            t.file === f.file && t.line === f.line && t.message === f.message
        ))
    );

    session.findings = uniqueFindings.slice(0, 500); // Limit workspace findings
    await this.reviewService.update(session);

    return session;
  }
}

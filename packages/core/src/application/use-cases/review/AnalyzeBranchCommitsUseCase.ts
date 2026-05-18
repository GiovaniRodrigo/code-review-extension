import { Finding, ReviewSession } from '@code-review/domain';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';
import { CodeReviewService } from '../../services/review/CodeReviewService';
import { IdeAdapterPort } from '../../../ports/ide/IdeAdapterPort';

export interface AnalyzeBranchInput {
  baseBranch: string;
  signal?: AbortSignal;
  onProgress?: (msg: string) => void;
}

export class AnalyzeBranchCommitsUseCase {
  constructor(
    private readonly ide: IdeAdapterPort,
    private readonly aiService: AIAnalysisService,
    private readonly reviewService: CodeReviewService
  ) {}

  async execute(input: AnalyzeBranchInput): Promise<ReviewSession> {
    if (!input || typeof input !== 'object') {
      throw new Error('Invalid branch analysis input.');
    }

    const baseBranch = input.baseBranch?.trim() || 'main';

    input.onProgress?.('Retrieving branch history...');

    const currentBranch = await this.ide.getActiveBranch();
    const diff = await this.ide.getBranchDiff?.(baseBranch) || '';

    if (!diff.trim()) {
      throw new Error(`No changes found between ${baseBranch} and current branch.`);
    }

    input.onProgress?.('Analyzing cumulative changes with AI...');

    const prompt = `
You are performing a cumulative code review for an entire branch.
Analyze the provided diff and identify technical risks, architecture violations, and potential bugs.

BRANCH: ${currentBranch}
BASE: ${baseBranch}

DIFF:
${diff.substring(0, 20000)}

Return findings as structured JSON. Focus on the most critical architectural issues.
`;

    const result = await this.aiService.analyze({
      code: prompt,
      filePath: `branch-review-${currentBranch}`,
      mode: 'deep',
      signal: input.signal
    });

    let session = await this.reviewService.getByBranch(currentBranch);
    if (!session) {
      session = await this.reviewService.create(currentBranch, []);
    }

    const findings = Array.isArray(result?.findings) ? result.findings : [];

    const newFindings: Finding[] = findings.map((f, index) => ({
      id: `ai-branch-${Date.now()}-${index}`,
      file: f.file || `branch-review-${currentBranch}`,
      line: f.line || 1,
      column: f.column || 1,
      message: f.message || 'Branch review finding',
      severity: f.severity as any,
      status: 'pending' as any,
      confidenceScore: f.confidenceScore ?? (f as any).confidence,
      suggestedFix: f.suggestedFix
    }));

    session.findings = [...(session.findings || []), ...newFindings];
    await this.reviewService.update(session);

    return session;
  }
}

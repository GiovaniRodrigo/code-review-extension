import { Finding, ReviewSession } from '@code-review/domain';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';
import { CodeReviewService } from '../../services/review/CodeReviewService';
import { IdeAdapterPort } from '../../../ports/ide/IdeAdapterPort';

export interface AnalyzePrInput {
  prNumber: number;
  owner: string;
  repo: string;
  signal?: AbortSignal;
}

export class AnalyzePrUseCase {
  constructor(
    private readonly ide: IdeAdapterPort,
    private readonly aiService: AIAnalysisService,
    private readonly reviewService: CodeReviewService
  ) {}

  async execute(input: AnalyzePrInput): Promise<ReviewSession> {
    console.log(`[ANALYZE_PR] Starting analysis for PR #${input.prNumber}`);
    
    const diff = await (this.ide as any).getPullRequestDiff(input.prNumber);
    
    if (!diff) {
        throw new Error(`Could not retrieve diff for PR #${input.prNumber}.`);
    }

    const prompt = `
You are performing a code review for a remote Pull Request.
Analyze the provided diff and identify technical risks, bugs, and design issues.

PR: #${input.prNumber}
REPO: ${input.owner}/${input.repo}

DIFF:
${diff.substring(0, 20000)}

Return findings as structured JSON.
`;

    const result = await this.aiService.analyze({
        code: prompt,
        filePath: `pr-review-${input.prNumber}`,
        mode: 'deep',
        signal: input.signal
    });

    const currentBranch = await this.ide.getActiveBranch();
    let session = await this.reviewService.getByBranch(currentBranch);
    if (!session) {
      session = await this.reviewService.create(currentBranch, []);
    }

    const newFindings: Finding[] = result.findings.map((f, index) => ({
      id: `ai-pr-${Date.now()}-${index}`,
      file: f.file,
      line: f.line,
      column: f.column,
      message: f.message,
      severity: f.severity as any,
      status: 'pending' as any,
      confidenceScore: f.confidence,
      suggestedFix: f.suggestedFix
    }));

    session.findings = [...session.findings, ...newFindings];
    await this.reviewService.update(session);

    return session;
  }
}

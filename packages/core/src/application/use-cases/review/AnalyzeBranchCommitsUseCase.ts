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
    if (input.onProgress) input.onProgress('Retrieving branch history...');
    
    const currentBranch = await this.ide.getActiveBranch();
    const diff = await this.ide.getBranchDiff?.(input.baseBranch) || '';
    
    if (!diff) {
        throw new Error(`No changes found between ${input.baseBranch} and current branch.`);
    }

    if (input.onProgress) input.onProgress('Analyzing cumulative changes with AI...');

    const prompt = `
You are performing a cumulative code review for an entire branch.
Analyze the provided diff and identify technical risks, architecture violations, and potential bugs.

BRANCH: ${currentBranch}
BASE: ${input.baseBranch}

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

    const newFindings: Finding[] = result.findings.map((f, index) => ({
      id: `ai-branch-${Date.now()}-${index}`,
      file: f.file,
      line: f.line,
      column: f.column,
      message: f.message,
      severity: f.severity as any,
      status: 'pending' as any,
      confidenceScore: f.confidenceScore,
      suggestedFix: f.suggestedFix
    }));

    // Merge findings
    session.findings = [...session.findings, ...newFindings];
    await this.reviewService.update(session);

    return session;
  }
}

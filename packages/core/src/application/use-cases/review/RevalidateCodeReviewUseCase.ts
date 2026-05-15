import { Finding, ReviewSession } from '@code-review/domain';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';
import { CodeReviewService } from '../../services/review/CodeReviewService';

export interface RevalidateInput {
    branch: string;
    code: string;
    filePath: string;
    signal?: AbortSignal;
}

export class RevalidateCodeReviewUseCase {
  constructor(
    private readonly analysisService: AIAnalysisService,
    private readonly reviewService: CodeReviewService
  ) {}

  async execute(input: RevalidateInput): Promise<ReviewSession> {
    const startTime = Date.now();
    console.log(`[REVALIDATE] Starting analysis for ${input.filePath} on branch ${input.branch}`);

    const existingSession = await this.reviewService.getByBranch(input.branch);
    
    const analysisResult = await this.analysisService.analyze({
        code: input.code,
        filePath: input.filePath,
        mode: 'fast',
        signal: input.signal
    });

    const newFindings: Finding[] = analysisResult.findings.map((f, index) => ({
        id: `ai-${Date.now()}-${index}`,
        file: f.file,
        line: f.line,
        column: f.column,
        message: f.message,
        severity: f.severity as any,
        status: 'pending' as any,
        confidenceScore: f.confidence,
        suggestedFix: f.suggestedFix
    }));

    if (!existingSession) {
        const session = await this.reviewService.create(input.branch, newFindings);
        const duration = Date.now() - startTime;
        console.log(`[REVALIDATE] New session created in ${duration}ms. Findings: ${newFindings.length}`);
        return session;
    }

    // Merge logic: keep approved findings if they still match
    const mergedFindings = newFindings.map(newF => {
        const matching = existingSession.findings.find(oldF => 
            oldF.file === newF.file && 
            oldF.line === newF.line && 
            oldF.message === newF.message
        );
        
        if (matching && matching.status === 'approved') {
            return { ...newF, status: 'approved' as const, id: matching.id };
        }
        return newF;
    });

    // Deduplicate findings by message and line to avoid AI noise
    const uniqueFindings = mergedFindings.filter((f, index, self) =>
        index === self.findIndex((t) => (
            t.file === f.file && t.line === f.line && t.message === f.message
        ))
    );

    // Limit findings per session (Phase 2: Performance)
    const MAX_FINDINGS = 100;
    existingSession.findings = uniqueFindings.slice(0, MAX_FINDINGS);
    
    await this.reviewService.update(existingSession);
    
    const duration = Date.now() - startTime;
    console.log(`[REVALIDATE] Completed in ${duration}ms. Findings: ${mergedFindings.length}`);

    return existingSession; 
  }
}

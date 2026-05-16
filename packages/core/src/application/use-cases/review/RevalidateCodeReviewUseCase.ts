import { Finding, ReviewSession } from '@code-review/domain';
import { AIAnalysisService } from '../../services/ai/AIAnalysisService';
import { CodeReviewService } from '../../services/review/CodeReviewService';
import { ContextPruningService } from '../../services/ai/ContextPruningService';
import { AstBuilder } from '../../../AstBuilder';

export interface RevalidateInput {
    branch: string;
    code: string;
    filePath: string;
    targetLines?: number[]; // New optional parameter for incremental focus
    signal?: AbortSignal;
    onFinding?: (finding: Finding) => void;
}

export class RevalidateCodeReviewUseCase {
  constructor(
    private readonly analysisService: AIAnalysisService,
    private readonly reviewService: CodeReviewService,
    private readonly pruningService = new ContextPruningService(),
    private readonly astBuilder = new AstBuilder()
  ) {}

  async execute(input: RevalidateInput): Promise<ReviewSession> {
    const startTime = Date.now();
    console.log(`[REVALIDATE] Starting analysis for ${input.filePath} on branch ${input.branch}`);

    const existingSession = await this.reviewService.getByBranch(input.branch);

    let codeToAnalyze = input.code;

    // Incremental Logic: If we have target lines (changed lines), use pruning
    if (input.targetLines && input.targetLines.length > 0) {
        console.log(`[REVALIDATE] Incremental mode for lines: ${input.targetLines.join(', ')}`);
        try {
            const ast = await this.astBuilder.build({ filePath: input.filePath, code: input.code });
            codeToAnalyze = this.pruningService.prune({
                ast,
                targetLines: input.targetLines
            });
        } catch (error) {
            console.warn('[REVALIDATE] Pruning failed, falling back to full code', error);
        }
    }

    const analysisResult = await this.analysisService.analyze({
        code: codeToAnalyze,
        filePath: input.filePath,
        mode: 'fast',
        signal: input.signal,
        onFinding: (dto) => {
            if (input.onFinding) {
                input.onFinding({
                    id: `ai-stream-${Date.now()}`,
                    file: dto.file,
                    line: dto.line,
                    column: dto.column,
                    message: dto.message,
                    severity: dto.severity as any,
                    status: 'pending' as any,
                    confidenceScore: dto.confidence,
                    suggestedFix: dto.suggestedFix
                });
            }
        }
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

    const MAX_FINDINGS = 100;

    if (!existingSession) {
        const limitedFindings = newFindings.slice(0, MAX_FINDINGS);
        const session = await this.reviewService.create(input.branch, limitedFindings);
        const duration = Date.now() - startTime;
        console.log(`[REVALIDATE] New session created in ${duration}ms. Findings: ${limitedFindings.length}`);
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
    existingSession.findings = uniqueFindings.slice(0, MAX_FINDINGS);
    
    await this.reviewService.update(existingSession);
    
    const duration = Date.now() - startTime;
    console.log(`[REVALIDATE] Completed in ${duration}ms. Findings: ${mergedFindings.length}`);

    return existingSession; 
  }
}

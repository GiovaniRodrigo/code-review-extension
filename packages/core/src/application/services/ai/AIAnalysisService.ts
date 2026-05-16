import { AIProviderPort } from '../../../ports/ai/AIProviderPort';
import { RagContextBuilderPort } from '../../../ports/rag/RagContextBuilderPort';
import { ReinforcementService } from './ReinforcementService';
import { ContextPruningService } from './ContextPruningService';
import { AstBuilder } from '../../../AstBuilder';
import {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../dto/ai/AIAnalysisDTO';
import { AIAnalysisResponseSchema } from '../../dto/ai/AIAnalysisSchema';

export interface AIAnalysisConfig {
    timeout?: number;
    maxRetries?: number;
}

export class AIAnalysisService {
  constructor(
    private readonly aiProvider: AIProviderPort,
    private readonly contextBuilder?: RagContextBuilderPort,
    private readonly reinforcementService?: ReinforcementService,
    private readonly pruningService = new ContextPruningService(),
    private readonly astBuilder = new AstBuilder(),
    private readonly config: AIAnalysisConfig = {}
  ) {}

  async analyze(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    const startTime = Date.now();
    const timeout = this.config.timeout ?? 30000; // default 30s
    const maxRetries = this.config.maxRetries ?? 2;
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const signal = input.signal || controller.signal;
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            if (attempt > 0) {
                console.log(`[AI] Retrying analysis... Attempt ${attempt}/${maxRetries}`);
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            }

            let context = input.context || '';
            let codeToAnalyze = input.code;

            // Phase 4: Performance - Prune large files if they are not just diffs
            if (codeToAnalyze.length > 5000 && !codeToAnalyze.startsWith('diff')) {
                try {
                    const ast = this.astBuilder.build({ filePath: input.filePath, code: codeToAnalyze });
                    codeToAnalyze = this.pruningService.prune({ 
                        ast, 
                        targetLines: [1] // Default to top, but ideally would be active lines
                    });
                } catch (e) {
                    console.warn('[AI] Context pruning failed, falling back to full code', e);
                }
            }
            
            if (this.contextBuilder && !context) {
                const chunks = await this.contextBuilder.buildContext(codeToAnalyze.substring(0, 2000));
                context = chunks.map(c => `FILE: ${c.source}\n${c.content}`).join('\n\n');
            }

            if (this.reinforcementService) {
                const reinforcement = await this.reinforcementService.getReinforcementContext(input.code);
                context += reinforcement;
            }

            // Phase 2: Performance - Truncate excessive context (~10k chars limit)
            const MAX_CONTEXT_CHARS = 10000;
            if (context.length > MAX_CONTEXT_CHARS) {
                console.warn(`[AI] Context too large (${context.length} chars). Truncating...`);
                context = context.substring(0, MAX_CONTEXT_CHARS) + '\n... [truncated]';
            }

            const rawResult = await this.aiProvider.analyzeCode({
              ...input,
              code: codeToAnalyze,
              context,
              mode: input.mode ?? 'fast',
              signal
            });

            // Phase 18: Response Validation
            const validated = AIAnalysisResponseSchema.safeParse(rawResult);
            if (!validated.success) {
                console.error('[AI] Validation failed', validated.error.format());
                // In production, we try to return what's valid or empty to avoid crashing
                return { findings: [], confidenceScore: 0 };
            }

            const data = validated.data as AIAnalysisResponseDTO;
            
            // Phase 4: Quality - Deduplicate findings from AI to reduce noise
            data.findings = data.findings.filter((f, index, self) =>
                index === self.findIndex((t) => (
                    t.file === f.file && t.line === f.line && t.message === f.message
                ))
            );

            const duration = Date.now() - startTime;
            console.log(`[AI] Analysis completed in ${duration}ms. Findings: ${data.findings.length}`);

            return data;
        } catch (e: any) {
            lastError = e;
            if (e.name === 'AbortError' || signal.aborted) {
                throw e; 
            }
            console.error(`[AI] Attempt ${attempt} failed: ${e.message}`);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    throw lastError;
  }

  async evaluateRule(prompt: string, code: string): Promise<any[]> {
    const fullPrompt = `
You are a code quality bot. 
Verify the following rule against the provided code:
RULE: ${prompt}

CODE:
${code}

Return findings as JSON list: [{"line": number, "message": "string"}]
If rule is followed, return [].
`;
    const result = await this.aiProvider.analyzeCode({
        code: fullPrompt,
        filePath: 'rule-evaluation',
        mode: 'fast'
    });

    return result.findings.map(f => ({
        line: f.line,
        message: f.message
    }));
  }
}

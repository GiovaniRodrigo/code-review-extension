import { AIProviderPort } from '../../../ports/ai/AIProviderPort';
import { RagContextBuilderPort } from '../../../ports/rag/RagContextBuilderPort';
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
    private readonly config: AIAnalysisConfig = {}
  ) {}

  async analyze(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
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
            
            if (this.contextBuilder && !context) {
                const chunks = await this.contextBuilder.buildContext(input.code);
                context = chunks.map(c => `FILE: ${c.source}\n${c.content}`).join('\n\n');
            }

            const rawResult = await this.aiProvider.analyzeCode({
              ...input,
              context,
              mode: input.mode ?? 'fast',
              signal
            });

            // Phase 18: Response Validation
            const validated = AIAnalysisResponseSchema.safeParse(rawResult);
            if (!validated.success) {
                console.error('[AI] Validation failed', validated.error.format());
                // In production, we try to return what's valid or empty to avoid crashing
                return { findings: [] };
            }

            return validated.data as AIAnalysisResponseDTO;
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
}

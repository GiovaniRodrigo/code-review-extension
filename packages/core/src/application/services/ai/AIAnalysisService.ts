import { AIProviderPort } from '../../../ports/ai/AIProviderPort';
import { RagContextBuilderPort } from '../../../ports/rag/RagContextBuilderPort';
import {
  AIAnalysisRequestDTO,
  AIAnalysisResponseDTO
} from '../../dto/ai/AIAnalysisDTO';

export class AIAnalysisService {
  constructor(
    private readonly aiProvider: AIProviderPort,
    private readonly contextBuilder?: RagContextBuilderPort
  ) {}

  async analyze(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    const timeout = 30000; // 30s
    const maxRetries = 2;
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

            return await this.aiProvider.analyzeCode({
              ...input,
              context,
              mode: input.mode ?? 'fast',
              signal
            });
        } catch (e: any) {
            lastError = e;
            if (e.name === 'AbortError' || signal.aborted) {
                throw e; // Don't retry if manually cancelled or timed out
            }
            console.error(`[AI] Attempt ${attempt} failed: ${e.message}`);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    throw lastError;
  }
}

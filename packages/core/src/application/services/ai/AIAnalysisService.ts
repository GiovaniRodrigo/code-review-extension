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
    let context = input.context || '';
    
    if (this.contextBuilder && !context) {
        const chunks = await this.contextBuilder.buildContext(input.code);
        context = chunks.map(c => `FILE: ${c.source}\n${c.content}`).join('\n\n');
    }

    return this.aiProvider.analyzeCode({
      ...input,
      context,
      mode: input.mode ?? 'fast'
    });
  }
}

import { Finding } from '@code-review/domain';
import { AIProvider, AIAnalysisInput, AIAnalysisResult } from './index';

export class MockAIProvider implements AIProvider {
  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    console.log(`MockAIProvider analyzing code for ${input.filePath}...`);
    
    // Simulação de delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      findings: [
        {
          file: input.filePath,
          line: 5,
          message: '[Mock] Use const instead of let for immutable variables.',
          severity: 'info',
          suggestedFix: 'const x = 1;'
        },
        {
          file: input.filePath,
          line: 12,
          message: '[Mock] Potential security risk: user input not sanitized.',
          severity: 'error'
        }
      ],
      confidenceScore: 0.99
    };
  }
}

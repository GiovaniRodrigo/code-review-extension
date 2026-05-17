import { 
  AIAnalysisRequestDTO, 
  AIAnalysisResponseDTO, 
  AIProviderPort, 
  HealthStatusDTO 
} from '@code-review/core';

export class MockAIProvider implements AIProviderPort {
  async analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    console.log(`MockAIProvider analyzing code for ${input.filePath}...`);
    
    const mockFindings: any[] = [
      {
        file: input.filePath,
        line: 5,
        message: '[Mock] Use const instead of let for immutable variables.',
        severity: 'info',
        category: 'code_smell',
        confidenceScore: 0.9,
        suggestedFix: 'const x = 1;'
      },
      {
        file: input.filePath,
        line: 12,
        message: '[Mock] Potential security risk: user input not sanitized.',
        severity: 'error',
        category: 'security',
        confidenceScore: 0.8
      }
    ];

    if (input.onFinding) {
      for (const f of mockFindings) {
        await new Promise(resolve => setTimeout(resolve, 300));
        await input.onFinding(f);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    return {
      findings: mockFindings,
      confidenceScore: 0.99
    };
  }

  async checkHealth(): Promise<HealthStatusDTO> {
    return { status: 'available' };
  }
}

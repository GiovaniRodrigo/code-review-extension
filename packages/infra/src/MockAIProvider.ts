import { Finding } from '@code-review/domain';
import { AIProvider, AIAnalysisInput, AIAnalysisResult, HealthStatus } from './interfaces';

export class MockAIProvider implements AIProvider {
  async analyzeCode(input: AIAnalysisInput): Promise<AIAnalysisResult> {
    console.log(`MockAIProvider analyzing code for ${input.filePath}...`);
    
    const mockFindings: Partial<Finding>[] = [
      {
        file: input.filePath,
        line: 5,
        message: '[Mock] Use const instead of let for immutable variables.',
        severity: 'info' as any,
        category: 'code_smell' as any,
        confidenceScore: 0.9,
        suggestedFix: 'const x = 1;'
      },
      {
        file: input.filePath,
        line: 12,
        message: '[Mock] Potential security risk: user input not sanitized.',
        severity: 'error' as any,
        category: 'security' as any,
        confidenceScore: 0.8
      }
    ];

    if (input.onFinding) {
      for (const f of mockFindings) {
        await new Promise(resolve => setTimeout(resolve, 300));
        input.onFinding(f);
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    return {
      findings: mockFindings,
      confidenceScore: 0.99
    };
  }

  async checkHealth(): Promise<HealthStatus> {
    return { status: 'available' };
  }
}


import { StructuredFinding } from './StructuredFinding';

export class AIReviewEngine {
  public async analyzeDiff(diff: string): Promise<StructuredFinding[]> {
    // Placeholder implementation
    // Future:
    // - AST Analysis
    // - Ollama Integration
    // - Rule Engine
    // - Risk Engine

    return [
      {
        id: 'rvw-001',
        severity: 'high',
        category: 'architecture',
        status: 'open',
        decision: 'changes_requested',
        file: 'src/controllers/UserController.ts',
        line: 84,
        title: 'Violação de responsabilidade única',
        description:
          'O controller contém lógica de negócio que deveria estar em um service.',
        suggestion: 'Extrair regra para UserService.',
        confidence: 0.92,
      },
    ];
  }
}

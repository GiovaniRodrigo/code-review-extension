import { Analyzer, AnalyzerInput, ReviewAnalysisResult, SuggestedReviewComment } from '../contracts';

export class ArchitectureAnalyzer implements Analyzer {
  readonly id = 'architecture.contracts-first';
  readonly label = 'Contracts First Architecture Analyzer';

  async analyze(input: AnalyzerInput): Promise<ReviewAnalysisResult> {
    const riskyEdges = input.graph?.edges.filter((edge) => edge.type === 'depends_on' && edge.to.includes('presentation')) ?? [];
    const suggestedComments: SuggestedReviewComment[] = riskyEdges.map((edge, index) => ({
      id: `ai-architecture-${index + 1}`,
      body: 'Possível acoplamento arquitetural detectado. Considere depender de um contrato/interface em vez de uma implementação concreta.',
      file: edge.from.replace('file:', ''),
      line: 1,
      severity: 'MEDIUM',
      source: 'automation',
      rationale: 'O roadmap define Contract First Architecture como princípio central para manter baixo acoplamento.',
      requiresHumanApproval: true
    }));

    return {
      diagnostics: [],
      suggestedComments,
      score: Math.max(60, 100 - suggestedComments.length * 10),
      risks: suggestedComments.length > 0 ? ['architecture-coupling'] : []
    };
  }
}

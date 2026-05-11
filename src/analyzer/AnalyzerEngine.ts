import { Analyzer, AnalyzerInput, ReviewAnalysisResult, SuggestedReviewComment } from '../contracts';

export class AnalyzerEngine implements Analyzer {
  readonly id = 'core.analyzer-engine';
  readonly label = 'Analyzer Engine';

  constructor(private readonly analyzers: Analyzer[]) {}

  async analyze(input: AnalyzerInput): Promise<ReviewAnalysisResult> {
    const results = await Promise.all(this.analyzers.map((analyzer) => analyzer.analyze(input)));
    const suggestedComments: SuggestedReviewComment[] = results.flatMap((result) => result.suggestedComments);
    const diagnostics = results.flatMap((result) => result.diagnostics);
    const risks = results.flatMap((result) => result.risks);
    const score = results.length === 0 ? 100 : Math.round(results.reduce((total, result) => total + result.score, 0) / results.length);

    return { diagnostics, suggestedComments, risks, score };
  }
}

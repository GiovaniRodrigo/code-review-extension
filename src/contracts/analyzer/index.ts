import { ReviewContext, ReviewAnalysisResult } from '../review';
import { ReviewGraph } from '../graph';

export interface AnalyzerInput {
  context: ReviewContext;
  graph?: ReviewGraph;
}

export interface Analyzer {
  readonly id: string;
  readonly label: string;
  analyze(input: AnalyzerInput): Promise<ReviewAnalysisResult>;
}

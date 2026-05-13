import { AnalyzerFinding } from '../domain/AnalyzerFinding';

export interface AnalyzerPort {
  analyze(paths: string[]): Promise<AnalyzerFinding[]>;
}

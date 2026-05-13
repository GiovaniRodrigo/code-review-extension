import { AnalyzerFinding } from '../domain/AnalyzerFinding';
import { AnalyzerPort } from '../ports/AnalyzerPort';

export class DependencyAnalyzer implements AnalyzerPort {
  async analyze(paths: string[]): Promise<AnalyzerFinding[]> {
    return paths
      .filter(path => path.includes('node_modules'))
      .map(path => ({
        file: path,
        rule: 'dependency.no-node-modules-input',
        message: 'Analyzer input must not include node_modules.',
        severity: 'warning'
      }));
  }
}

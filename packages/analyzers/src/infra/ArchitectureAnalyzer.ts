import { AnalyzerFinding } from '../domain/AnalyzerFinding';
import { AnalyzerPort } from '../ports/AnalyzerPort';

export class ArchitectureAnalyzer implements AnalyzerPort {
  async analyze(paths: string[]): Promise<AnalyzerFinding[]> {
    return paths
      .filter(path => path.includes('/domain/') && path.includes('/infra/'))
      .map(path => ({
        file: path,
        rule: 'clean-architecture.domain-no-infra',
        message: 'Domain must not depend on infra.',
        severity: 'critical'
      }));
  }
}

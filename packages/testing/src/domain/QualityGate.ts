import { TestToolResult } from './TestTool';

export interface QualityGateReport {
  passed: boolean;
  results: TestToolResult[];
}

export class QualityGate {
  evaluate(results: TestToolResult[]): QualityGateReport {
    return {
      passed: results.every(result => result.passed),
      results
    };
  }
}

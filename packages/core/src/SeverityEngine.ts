import { FindingSeverity } from '@code-review/domain';

export interface SeverityInput {
  severity?: FindingSeverity | string;
  message?: string;
  suggestedFix?: string;
  confidenceScore?: number;
}

const VALID_SEVERITIES: FindingSeverity[] = ['info', 'warning', 'error'];

export class SeverityEngine {
  classify(input: SeverityInput): FindingSeverity {
    if (input.severity && VALID_SEVERITIES.includes(input.severity as FindingSeverity)) {
      return input.severity as FindingSeverity;
    }

    const message = (input.message || '').toLowerCase();

    if (
      message.includes('security') ||
      message.includes('vulnerab') ||
      message.includes('injection') ||
      message.includes('leak') ||
      message.includes('crash')
    ) {
      return 'error';
    }

    if (
      message.includes('risk') ||
      message.includes('bug') ||
      message.includes('performance') ||
      message.includes('deprecated') ||
      (input.confidenceScore !== undefined && input.confidenceScore < 0.5)
    ) {
      return 'warning';
    }

    if (input.suggestedFix) {
      return 'warning';
    }

    return 'info';
  }
}

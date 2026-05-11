import { ValidationFinding } from '../../domain';
import { ReviewContext } from '../review';

export interface DiagnosticProvider {
  readonly id: string;
  collect(context: ReviewContext): Promise<ValidationFinding[]>;
}

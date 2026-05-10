import { ValidationSeverity, ValidationFindingStatus } from './types';

export interface CorrectionAttempt {
  id: string;
  author: string;
  commit: string;
  description: string;
  createdAt: string;
}

export interface Revalidation {
  id: string;
  reviewer: string;
  result: ValidationFindingStatus;
  notes: string;
  createdAt: string;
}

export interface ValidationFinding {
  id: string;
  rule: string;
  severity: ValidationSeverity;
  status: ValidationFindingStatus;
  description: string;
  file: string;
  line: number;
  commit: string;
  responsible: string;
  createdAt: string;
  updatedAt: string;
  comments: string[];
  statusHistory: Array<{ status: ValidationFindingStatus; changedAt: string; reason?: string }>;
  correctionAttempts: CorrectionAttempt[];
  revalidations: Revalidation[];
}

export interface CreateValidationFindingInput {
  rule: string;
  severity: ValidationSeverity;
  description: string;
  file: string;
  line: number;
  commit: string;
  responsible: string;
  now?: Date;
  id?: string;
}

export function createFindingEntity(sessionId: string, findingsCount: number, input: CreateValidationFindingInput): ValidationFinding {
  const createdAt = (input.now ?? new Date()).toISOString();
  const id = input.id ?? `${sessionId}-finding-${findingsCount + 1}`;

  return {
    id,
    rule: input.rule.trim(),
    severity: input.severity,
    status: 'NEEDS_CHANGES',
    description: input.description.trim(),
    file: input.file.trim(),
    line: input.line,
    commit: input.commit.trim(),
    responsible: input.responsible.trim(),
    createdAt,
    updatedAt: createdAt,
    comments: [],
    statusHistory: [{ status: 'NEEDS_CHANGES', changedAt: createdAt }],
    correctionAttempts: [],
    revalidations: []
  };
}

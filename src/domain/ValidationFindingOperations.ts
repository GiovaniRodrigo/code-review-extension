import { ReviewSession } from './ReviewSession';
import { CreateValidationFindingInput, createFindingEntity, ValidationFindingStatus } from './ValidationFinding';
import { appendHistory } from './ReviewHistory';
import { isReviewer, isAuthor } from './ReviewSessionLifecycle';

export function createValidationFinding(session: ReviewSession, input: CreateValidationFindingInput): ReviewSession {
  validateFindingInput(input);
  if (!isReviewer(session, input.responsible)) throw new Error('Apenas o reviewer oficial ou admin pode registrar novos findings.');

  const createdAt = (input.now ?? new Date()).toISOString();
  const finding = createFindingEntity(session.id, session.findings.length, input);

  return {
    ...session,
    findings: [...session.findings, finding],
    updatedAt: createdAt,
    history: appendHistory(session, 'FINDING_CREATED', `Validacao criada por ${input.responsible}: ${finding.rule} em ${finding.file}:${finding.line}`, createdAt)
  };
}

export function updateValidationFindingStatus(
  session: ReviewSession,
  findingId: string,
  status: ValidationFindingStatus,
  user: string,
  reason = '',
  now = new Date()
): ReviewSession {
  const finding = session.findings.find((item) => item.id === findingId);
  if (!finding) throw new Error(`Validacao nao encontrada: ${findingId}`);

  if (status === 'APPROVED' && !isReviewer(session, user)) {
    throw new Error('Apenas o reviewer oficial ou admin pode aprovar um finding.');
  }

  const updatedAt = now.toISOString();

  return {
    ...session,
    findings: session.findings.map((item) => item.id === findingId ? {
      ...item,
      status,
      updatedAt,
      statusHistory: [...item.statusHistory, { status, changedAt: updatedAt, reason: reason || undefined }]
    } : item),
    updatedAt,
    history: appendHistory(session, 'FINDING_STATUS_CHANGED', `Status da validacao ${finding.rule} alterado para ${status} por ${user}`, updatedAt)
  };
}

export function registerCorrectionAttempt(
  session: ReviewSession,
  findingId: string,
  input: { author: string; commit: string; description: string; now?: Date; id?: string }
): ReviewSession {
  if (!input.author.trim()) throw new Error('O autor da correcao e obrigatorio.');
  if (!input.commit.trim()) throw new Error('O commit da correcao e obrigatorio.');
  if (!input.description.trim()) throw new Error('A descricao da correcao e obrigatoria.');
  if (!isAuthor(session, input.author)) throw new Error('Apenas o autor (dev) ou admin pode registrar tentativas de correcao.');

  const finding = session.findings.find((item) => item.id === findingId);
  if (!finding) throw new Error(`Validacao nao encontrada: ${findingId}`);

  const createdAt = (input.now ?? new Date()).toISOString();
  const attempt = {
    id: input.id ?? `${findingId}-correction-${finding.correctionAttempts.length + 1}`,
    author: input.author.trim(),
    commit: input.commit.trim(),
    description: input.description.trim(),
    createdAt
  };

  return {
    ...session,
    findings: session.findings.map((item) => item.id === findingId ? {
      ...item,
      status: 'FIXED',
      updatedAt: createdAt,
      correctionAttempts: [...item.correctionAttempts, attempt],
      statusHistory: [...item.statusHistory, { status: 'FIXED', changedAt: createdAt, reason: 'Correcao registrada' }]
    } : item),
    updatedAt: createdAt,
    history: appendHistory(session, 'CORRECTION_REGISTERED', `Correcao registrada por ${input.author} para ${finding.rule}`, createdAt)
  };
}

export function revalidateFinding(
  session: ReviewSession,
  findingId: string,
  input: { reviewer: string; result: ValidationFindingStatus; notes: string; now?: Date; id?: string }
): ReviewSession {
  if (!input.reviewer.trim()) throw new Error('O reviewer da revalidacao e obrigatorio.');
  if (!input.notes.trim()) throw new Error('As notas da revalidacao sao obrigatorias.');
  if (!isReviewer(session, input.reviewer)) throw new Error('Apenas o reviewer oficial ou admin pode realizar revalidacoes.');

  const finding = session.findings.find((item) => item.id === findingId);
  if (!finding) throw new Error(`Validacao nao encontrada: ${findingId}`);

  const createdAt = (input.now ?? new Date()).toISOString();
  const revalidation = {
    id: input.id ?? `${findingId}-revalidation-${finding.revalidations.length + 1}`,
    reviewer: input.reviewer.trim(),
    result: input.result,
    notes: input.notes.trim(),
    createdAt
  };

  return {
    ...session,
    findings: session.findings.map((item) => item.id === findingId ? {
      ...item,
      status: input.result,
      updatedAt: createdAt,
      revalidations: [...item.revalidations, revalidation],
      statusHistory: [...item.statusHistory, { status: input.result, changedAt: createdAt, reason: 'Revalidacao' }]
    } : item),
    updatedAt: createdAt,
    history: appendHistory(session, 'FINDING_REVALIDATED', `Validacao revalidada por ${input.reviewer}: ${finding.rule} -> ${input.result}`, createdAt)
  };
}

function validateFindingInput(input: CreateValidationFindingInput): void {
  if (!input.rule.trim()) throw new Error('A regra violada e obrigatoria.');
  if (!input.description.trim()) throw new Error('A descricao da validacao e obrigatoria.');
  if (!input.file.trim()) throw new Error('O arquivo da validacao e obrigatorio.');
  if (!Number.isInteger(input.line) || input.line < 1) throw new Error('A linha da validacao deve ser maior que zero.');
  if (!input.commit.trim()) throw new Error('O commit da validacao e obrigatorio.');
  if (!input.responsible.trim()) throw new Error('O responsavel da validacao e obrigatorio.');
}

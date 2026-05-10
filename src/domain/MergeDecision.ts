import { ReviewSession } from './ReviewSession';

export interface MergeDecision {
  blocked: boolean;
  reasons: string[];
  updatedAt: string;
}

export function calculateMergeDecision(session: ReviewSession, now = new Date()): MergeDecision {
  const updatedAt = now.toISOString();
  const findings = session.findings ?? [];
  const reasons: string[] = [];

  const criticalOpen = findings.filter((finding) => finding.severity === 'CRITICAL' && finding.status !== 'APPROVED');
  const highOpen = findings.filter((finding) => finding.severity === 'HIGH' && finding.status !== 'APPROVED');

  if (criticalOpen.length) reasons.push(`${criticalOpen.length} validacao critica pendente`);
  if (highOpen.length) reasons.push(`${highOpen.length} validacao alta pendente`);

  const changedFiles = session.changedFiles ?? [];
  const approvals = session.partialApprovals ?? [];
  const unapprovedFiles = changedFiles.filter((file) => !approvals.some((approval) => approval.scope === 'file' && approval.target === file && approval.status === 'APPROVED'));

  if (changedFiles.length && unapprovedFiles.length) reasons.push(`${unapprovedFiles.length} arquivo(s) sem aprovacao parcial`);

  const blocked = reasons.length > 0;

  return {
    blocked,
    reasons,
    updatedAt
  };
}

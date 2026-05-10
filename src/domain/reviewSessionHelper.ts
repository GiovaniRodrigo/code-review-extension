import { ReviewSession } from './reviewSession';

export function getSessionSummary(session: ReviewSession): string {
  return `Session ${session.id} for ${session.sourceBranch}`;
}

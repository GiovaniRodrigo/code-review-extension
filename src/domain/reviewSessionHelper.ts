import { ReviewSession } from './ReviewSession';

export function getSessionSummary(session: ReviewSession): string {
  return `Session ${session.id} for ${session.sourceBranch}`;
}

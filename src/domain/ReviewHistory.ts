import { ReviewSession } from './ReviewSession';
import { ReviewHistoryEntry } from './types';

export function appendHistory(
  session: ReviewSession,
  type: ReviewHistoryEntry['type'],
  message: string,
  createdAt: string
): ReviewHistoryEntry[] {
  return [
    ...session.history,
    {
      id: `${session.id}-history-${session.history.length + 1}`,
      type,
      message,
      createdAt
    }
  ];
}

import { ReviewSession } from './ReviewSession';
import { ReviewNavigationTarget } from './types';
import { appendHistory } from './ReviewHistory';

export function navigateReviewSession(
  session: ReviewSession,
  target: ReviewNavigationTarget,
  now = new Date()
): ReviewSession {
  if (!target.ref.trim()) {
    throw new Error('A referencia de navegacao e obrigatoria.');
  }

  const updatedAt = now.toISOString();

  return {
    ...session,
    activeNavigation: target,
    updatedAt,
    history: appendHistory(session, 'NAVIGATION_CHANGED', `Navegacao alterada para ${target.kind}: ${target.ref}`, updatedAt)
  };
}

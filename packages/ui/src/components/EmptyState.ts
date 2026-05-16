import { escapeHtml } from '../shared/escapeHtml';

export function EmptyState(message: string): string {
  return `<div class="cr-empty">${escapeHtml(message)}</div>`;
}

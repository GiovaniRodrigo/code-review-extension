import { escapeHtml } from '../shared/escapeHtml';

export function Alert(message: string): string {
  return `<div class="cr-card" role="alert">${escapeHtml(message)}</div>`;
}

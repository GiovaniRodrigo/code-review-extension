import { escapeHtml } from '../shared/escapeHtml';

export function Badge(label: string): string {
  return `<span class="cr-badge">${escapeHtml(label)}</span>`;
}

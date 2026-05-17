import { escapeHtml } from '../shared/escapeHtml';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'destructive';

export function Badge(label: string, variant: BadgeVariant = 'default'): string {
  return `<span class="cr-badge cr-badge-${variant}">${escapeHtml(label)}</span>`;
}

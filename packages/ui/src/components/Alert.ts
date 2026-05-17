import { escapeHtml } from '../shared/escapeHtml';

export type AlertVariant = 'default' | 'destructive';

export function Alert(message: string, variant: AlertVariant = 'default'): string {
  return `<div class="cr-card cr-alert cr-alert-${variant}" role="alert">${message}</div>`;
}

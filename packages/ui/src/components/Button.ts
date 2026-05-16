import { escapeHtml } from '../shared/escapeHtml';

export function Button(label: string, command: string, variant: 'primary' | 'secondary' = 'primary'): string {
  const className = variant === 'secondary' ? 'cr-button secondary' : 'cr-button';

  return `<button class="${className}" data-command="${escapeHtml(command)}">${escapeHtml(label)}</button>`;
}

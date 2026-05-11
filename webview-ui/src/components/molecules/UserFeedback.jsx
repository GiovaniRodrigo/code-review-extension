import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';

const iconByTone = {
  loading: Loader2,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

export function UserFeedback({ feedback, onDismiss }) {
  if (!feedback?.message) return null;

  const tone = feedback.tone || 'info';
  const Icon = iconByTone[tone] || Info;
  const busy = tone === 'loading';

  return (
    <div className={`user-feedback user-feedback-${tone}`} role={tone === 'error' ? 'alert' : 'status'} aria-live={tone === 'error' ? 'assertive' : 'polite'} aria-busy={busy}>
      <Icon size={18} className={busy ? 'spin-icon' : ''} />
      <div>
        <strong>{feedback.title || feedbackTitle(tone)}</strong>
        <p>{feedback.message}</p>
        {typeof feedback.progress === 'number' && (
          <div className="feedback-progress" aria-label={`Progresso ${feedback.progress}%`}>
            <i style={{ width: `${Math.min(100, Math.max(0, feedback.progress))}%` }} />
          </div>
        )}
      </div>
      {!busy && <button type="button" aria-label="Fechar feedback" onClick={onDismiss}>×</button>}
    </div>
  );
}

export function InlineFeedback({ tone = 'info', title, children }) {
  const Icon = iconByTone[tone] || Info;
  return (
    <div className={`inline-feedback inline-feedback-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <Icon size={18} />
      <div>
        {title && <strong>{title}</strong>}
        <p>{children}</p>
      </div>
    </div>
  );
}

function feedbackTitle(tone) {
  if (tone === 'loading') return 'Processando';
  if (tone === 'success') return 'Concluído';
  if (tone === 'error') return 'Erro';
  if (tone === 'warning') return 'Atenção';
  return 'Informação';
}

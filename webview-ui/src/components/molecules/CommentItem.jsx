import React, { useState } from 'react';
import { Bot, Pencil } from 'lucide-react';
import { Badge } from '../atoms/Badge';

export function CommentItem({ session, comment, currentUser, t, showThread = false, onOpenFile, onOpenDiff, onEditComment, onUpdateStatus }) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(comment.body);
  const history = comment.history ?? [];
  const threadLabel = comment.threadId || `${comment.file}:${comment.line}`;
  const canApprove = session?.reviewer === currentUser || currentUser === 'admin';
  const canEdit = comment.author === currentUser || currentUser === 'admin';
  const isAI = String(comment.author ?? '').startsWith('IA ·') || String(comment.body ?? '').startsWith('[IA:');
  const displayBody = cleanAICommentBody(comment.body);

  return (
    <article className={`comment-item severity-${(comment.severity ?? 'MEDIUM').toLowerCase()} ${isAI ? 'ai-comment' : ''}`}>
      <header>
        <span>{comment.file}:{comment.line}</span>
        <div className="comment-header-actions">
          {isAI && <Badge><Bot size={13} /> IA</Badge>}
          <button onClick={() => onOpenFile?.(comment)}>Arquivo</button>
          <button onClick={() => onOpenDiff?.(comment)}>Diff</button>
          <button disabled={!canEdit} onClick={() => setEditing((value) => !value)} title={canEdit ? 'Editar comentário' : 'Apenas o autor pode editar'}><Pencil size={15} /></button>
        </div>
      </header>
      {editing ? (
        <div className="comment-edit">
          <input value={body} onChange={(event) => setBody(event.target.value)} />
          <button onClick={() => {
            onEditComment?.({ id: session.id, commentId: comment.id, body });
            setEditing(false);
          }}>{t('common.save')}</button>
        </div>
      ) : <p>{displayBody.summary}</p>}
      {isAI && displayBody.rationale && <p className="ai-rationale"><strong>Motivo:</strong> {displayBody.rationale}</p>}
      <div className="comment-meta-row">
        <Badge>{comment.severity ?? 'MEDIUM'}</Badge>
        <Badge>{comment.status ?? 'NEEDS_CHANGES'}</Badge>
        <Badge>{comment.commit ?? 'sem commit'}</Badge>
        <Badge>{isAI ? 'sugestão IA' : 'público'}</Badge>
      </div>
      <div className="finding-actions">
        {['OPEN', 'NEEDS_CHANGES', 'RESOLVED', 'APPROVED'].map((status) => (
          <button
            key={status}
            disabled={status === 'APPROVED' && !canApprove}
            className={(comment.status ?? 'NEEDS_CHANGES') === status ? 'active' : ''}
            onClick={() => onUpdateStatus?.({ id: session.id, commentId: comment.id, status })}
          >
            {status}
          </button>
        ))}
      </div>
      {showThread && (
        <section className="comment-thread">
          <strong>Thread {threadLabel}</strong>
          <div className="thread-line"><span>{isAI ? 'IA local' : 'Reviewer'}</span><p>{displayBody.summary}</p></div>
          {history.length ? history.slice(-3).map((item, index) => (
            <div className="thread-line" key={`${comment.id}-history-${index}`}><span>{item.author ?? 'sistema'}</span><p>{item.body ?? item.status ?? 'alteração registrada'}</p></div>
          )) : <small>Sem respostas ou edições adicionais.</small>}
        </section>
      )}
      <small>{history.length} edição(ões) · impacto estimado: -{['RESOLVED', 'APPROVED'].includes(comment.status ?? '') ? 0 : ({ LOW: 3, MEDIUM: 7, HIGH: 12, CRITICAL: 20 }[comment.severity ?? 'MEDIUM'] ?? 7)} ponto(s)</small>
    </article>
  );
}

function cleanAICommentBody(value = '') {
  if (!String(value).startsWith('[IA:')) return { summary: value, rationale: '' };
  const lines = String(value).split('\n').map((line) => line.trim()).filter(Boolean);
  const summary = lines.find((line) => !line.startsWith('[IA:') && !line.startsWith('Motivo:') && !line.startsWith('Ação:')) ?? '';
  const rationale = lines.find((line) => line.startsWith('Motivo:'))?.replace(/^Motivo:\s*/, '') ?? '';
  return { summary, rationale };
}

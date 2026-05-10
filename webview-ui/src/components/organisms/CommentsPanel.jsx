import React, { useMemo, useState, useEffect } from 'react';
import { MessageSquare, Info } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';
import { Tooltip } from '../atoms/Tooltip';
import { Badge } from '../atoms/Badge';
import { CommentItem } from '../molecules/CommentItem';

export function CommentsPanel({ session, currentUser, t, full = false, onAddComment, onOpenFile, onOpenDiff, onEditComment, onUpdateStatus }) {
  const files = useMemo(() => {
    const fromSession = session?.changedFiles ?? [];
    const fromComments = (session?.comments ?? []).map((comment) => comment.file).filter(Boolean);
    return Array.from(new Set([...fromSession, ...fromComments])).filter(Boolean);
  }, [session]);

  const comments = session?.comments ?? [];
  const [selectedFile, setSelectedFile] = useState(files[0] ?? '');
  const [draft, setDraft] = useState('Revisar responsabilidade deste trecho.');
  const [line, setLine] = useState(1);
  const [severity, setSeverity] = useState('MEDIUM');
  const [status, setStatus] = useState('NEEDS_CHANGES');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [fileFilter, setFileFilter] = useState('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!selectedFile && files.length) setSelectedFile(files[0]);
    if (selectedFile && files.length && !files.includes(selectedFile)) setSelectedFile(files[0]);
  }, [files, selectedFile]);

  const filteredComments = comments.filter((comment) => {
    const byStatus = statusFilter === 'ALL' || (comment.status ?? 'NEEDS_CHANGES') === statusFilter;
    const bySeverity = severityFilter === 'ALL' || (comment.severity ?? 'MEDIUM') === severityFilter;
    const byFile = fileFilter === 'ALL' || comment.file === fileFilter;
    const text = `${comment.body ?? ''} ${comment.file ?? ''} ${comment.commit ?? ''}`.toLowerCase();
    const byQuery = !query.trim() || text.includes(query.toLowerCase());
    return byStatus && bySeverity && byFile && byQuery;
  });

  const groupedComments = filteredComments.reduce((groups, comment) => {
    const key = comment.file || 'sem-arquivo';
    groups[key] = groups[key] ?? [];
    groups[key].push(comment);
    return groups;
  }, {});

  const openCount = comments.filter((comment) => !['RESOLVED', 'APPROVED'].includes(comment.status ?? 'NEEDS_CHANGES')).length;
  const criticalCount = comments.filter((comment) => (comment.severity ?? 'MEDIUM') === 'CRITICAL').length;
  const resolvedCount = comments.filter((comment) => ['RESOLVED', 'APPROVED'].includes(comment.status ?? '')).length;
  const impact = calculateCommentImpact(comments);

  return (
    <section className={full ? 'comments-workspace' : 'sessions-panel'}>
      <div className="section-title">
        <div>
          <h2>{t('dashboard.summary.comments')}</h2>
          <p className="muted">Central oficial da discussão técnica: arquivo, linha, severidade, status, thread e impacto no score.</p>
        </div>
        {full && <Badge>{comments.length} públicos</Badge>}
      </div>

      {full && (
        <section className="comment-impact-grid" aria-label="Impacto dos comentários">
          <SummaryCard title="Impacto no score" value={`-${impact}`} label="penalidade atual" color={impact > 25 ? 'red' : impact > 10 ? 'yellow' : 'green'} />
          <SummaryCard title={t('dashboard.summary.open')} value={String(openCount)} label="bloqueiam decisão" color="yellow" />
          <SummaryCard title="Críticos" value={String(criticalCount)} label="risco alto" color="red" />
          <SummaryCard title="Resolvidos" value={String(resolvedCount)} label="concluídos" color="green" />
        </section>
      )}

      <div className="comment-form enhanced-comment-form">
        <select value={selectedFile} onChange={(event) => setSelectedFile(event.target.value)} aria-label="Arquivo do comentário">
          {files.length ? files.map((file) => <option key={file} value={file}>{file}</option>) : <option value="">Sem arquivo carregado</option>}
        </select>
        <input type="number" min="1" value={line} onChange={(event) => setLine(event.target.value)} aria-label="Linha" />
        <select value={severity} onChange={(event) => setSeverity(event.target.value)} aria-label="Severidade"><option value="LOW">Baixa</option><option value="MEDIUM">Média</option><option value="HIGH">Alta</option><option value="CRITICAL">Crítica</option></select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Status"><option value="OPEN">Aberto</option><option value="NEEDS_CHANGES">Ajuste solicitado</option><option value="RESOLVED">Resolvido</option><option value="APPROVED">Aprovado</option></select>
        <input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Comentário técnico público" />
        <Tooltip label="Adicionar comentário público vinculado ao arquivo e linha">
          <button disabled={!session || !selectedFile || !draft.trim()} onClick={() => { onAddComment?.({ body: draft, file: selectedFile, line, severity, status }); setDraft(''); }}><MessageSquare size={16} /> {t('common.create')}</button>
        </Tooltip>
      </div>

      {full && (
        <div className="comments-toolbar" aria-label="Filtros de comentários">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar comentário, arquivo ou commit" />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="ALL">Todos status</option>
            <option value="OPEN">Abertos</option>
            <option value="NEEDS_CHANGES">Ajuste solicitado</option>
            <option value="RESOLVED">Resolvidos</option>
            <option value="APPROVED">Aprovados</option>
          </select>
          <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>
            <option value="ALL">Todas severidades</option>
            <option value="LOW">Baixa</option>
            <option value="MEDIUM">Média</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>
          <select value={fileFilter} onChange={(event) => setFileFilter(event.target.value)}>
            <option value="ALL">Todos arquivos</option>
            {files.map((file) => <option key={file} value={file}>{file}</option>)}
          </select>
        </div>
      )}

      <div className="comments-list grouped-comments">
        {Object.keys(groupedComments).length ? Object.entries(groupedComments).map(([file, items]) => (
          <section className="comment-file-group" key={file}>
            {full && <header><strong>{file}</strong><span>{items.length} comentário(s)</span></header>}
            {items.map((comment) => (
              <CommentItem
                key={comment.id}
                session={session}
                comment={comment}
                currentUser={currentUser}
                t={t}
                showThread={full}
                onOpenFile={onOpenFile}
                onOpenDiff={onOpenDiff}
                onEditComment={onEditComment}
                onUpdateStatus={onUpdateStatus}
              />
            ))}
          </section>
        )) : <p className="empty-state">Nenhum comentário encontrado para os filtros atuais.</p>}
      </div>
    </section>
  );
}

function calculateCommentImpact(comments = []) {
  const weights = { LOW: 3, MEDIUM: 7, HIGH: 12, CRITICAL: 20 };
  return comments.reduce((total, comment) => {
    if (['RESOLVED', 'APPROVED'].includes(comment.status ?? '')) return total;
    return total + (weights[comment.severity ?? 'MEDIUM'] ?? 7);
  }, 0);
}

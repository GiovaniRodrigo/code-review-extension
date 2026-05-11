import React from 'react';
import { PanelRightClose, RefreshCw, MoreVertical, XCircle, AlertTriangle, Info, Play, Wrench, FileDown, MessageSquare } from 'lucide-react';
import { Ring } from '../atoms/Ring';
import { Metric } from '../atoms/Metric';
import { Issue } from '../molecules/Issue';

export function Rightbar({ metrics, state, onSetView, onStartReview, onToggle, t, qualityLabel, vscodeApi }) {
  const session = state?.currentSession;
  const findings = session?.findings ?? [];
  const comments = session?.comments ?? [];
  const problems = state?.vscode?.problems ?? [];
  const hasReviewData = Boolean(session);
  const score = hasReviewData ? metrics?.qualityScore : undefined;
  const topIssues = buildTopIssues(findings, comments, problems);

  return (
    <aside className="rightbar">
      <header>
        <span>{t('dashboard.timeline')}</span>
        <div>
          <button className="sidebar-toggle inline" title="Ocultar painel lateral direito" onClick={onToggle}><PanelRightClose size={16} /></button>
          <RefreshCw size={17} />
          <MoreVertical size={17} />
        </div>
      </header>

      <section className="quality-card">
        <h4>{t('dashboard.hero.scoreLabel')}</h4>
        <Ring score={score} />
        <strong>{hasReviewData ? qualityLabel(metrics?.qualityScore ?? 0, t) : 'Aguardando sessão'}</strong>
      </section>

      <section className="kpi-stack">
        <Metric title={t('dashboard.summary.comments')} value={String(metrics?.commentsCount ?? 0)} color="red" />
        <Metric title={t('diagnostics.summary.problems')} value={String(problems.length)} color="yellow" />
        <Metric title={t('dashboard.summary.open')} value={String(metrics?.openCommentsCount ?? 0)} color="green" bar />
      </section>

      <section>
        <h3>Principais problemas <button className="link-button" onClick={() => onSetView('analysis')}>Ver todos</button></h3>
        {topIssues.length ? topIssues.map((issue) => (
          <Issue key={issue.id} icon={issue.icon} title={issue.title} text={issue.text} label={issue.label} />
        )) : (
          <div className="empty-state compact">
            <strong>Nenhum problema real carregado</strong>
            <p>Execute uma revisão, valide arquitetura ou abra um workspace com diagnostics para preencher este painel.</p>
          </div>
        )}
      </section>

      <section>
        <h3>{t('dashboard.nextActions')}</h3>
        <div className="actions">
          <button onClick={onStartReview}><Play size={18} />{hasReviewData ? t('common.update') : 'Criar sessão'}</button>
          <button onClick={() => vscodeApi?.postMessage({ type: 'runArchitectureValidation', payload: { id: session?.id } })} disabled={!session}><Wrench size={18} />Validar</button>
          <button onClick={() => vscodeApi?.postMessage({ type: 'exportReviewReport' })} disabled={!session}><FileDown size={18} />{t('dashboard.exportReport')}</button>
          <button onClick={() => onSetView('comments')} disabled={!session}><MessageSquare size={18} />Comentar</button>
        </div>
      </section>

      <section className="telemetry-card">
        <h3>Telemetria <button className="link-button" onClick={() => onSetView('telemetry')}>Ver dashboard</button></h3>
        <div className="telemetry-chart"><div className="donut" /><span>{hasReviewData ? '⌁⌁⌁⌁⌁' : 'sem dados'}</span></div>
      </section>
    </aside>
  );
}

function buildTopIssues(findings, comments, problems) {
  const findingIssues = findings.map((finding) => ({
    id: `finding-${finding.id}`,
    icon: iconForSeverity(finding.severity),
    title: finding.rule,
    text: `${finding.file}:${finding.line}`,
    label: labelForSeverity(finding.severity)
  }));

  const commentIssues = comments
    .filter((comment) => comment.status !== 'RESOLVED' && comment.status !== 'APPROVED')
    .map((comment) => ({
      id: `comment-${comment.id}`,
      icon: iconForSeverity(comment.severity),
      title: comment.body.length > 42 ? `${comment.body.slice(0, 39)}...` : comment.body,
      text: `${comment.file}:${comment.line}`,
      label: labelForSeverity(comment.severity)
    }));

  const diagnosticIssues = problems.slice(0, 6).map((problem, index) => ({
    id: `problem-${problem.file}-${problem.line}-${index}`,
    icon: problem.severity === 'Error' ? <XCircle size={17} /> : problem.severity === 'Warning' ? <AlertTriangle size={17} /> : <Info size={17} />,
    title: problem.source || problem.severity || 'Diagnostic',
    text: `${problem.file}:${problem.line}`,
    label: problem.severity === 'Error' ? 'Erro' : problem.severity === 'Warning' ? 'Aviso' : 'Info'
  }));

  return [...findingIssues, ...commentIssues, ...diagnosticIssues].slice(0, 3);
}

function iconForSeverity(severity) {
  if (severity === 'CRITICAL' || severity === 'HIGH') return <XCircle size={17} />;
  if (severity === 'MEDIUM') return <AlertTriangle size={17} />;
  return <Info size={17} />;
}

function labelForSeverity(severity) {
  if (severity === 'CRITICAL' || severity === 'HIGH') return 'Crítico';
  if (severity === 'MEDIUM') return 'Aviso';
  return 'Info';
}

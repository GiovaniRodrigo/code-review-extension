import React from 'react';
import { PanelRightClose, RefreshCw, MoreVertical, XCircle, AlertTriangle, Info, Play, Wrench, FileDown, MessageSquare } from 'lucide-react';
import { Ring } from '../atoms/Ring';
import { Metric } from '../atoms/Metric';
import { Issue } from '../molecules/Issue';

export function Rightbar({ metrics, state, onSetView, onStartReview, onToggle, t, qualityLabel, vscodeApi }) {
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
        <Ring score={metrics?.qualityScore ?? 100} />
        <strong>{qualityLabel(metrics?.qualityScore ?? 100, t)}</strong>
      </section>

      <section className="kpi-stack">
        <Metric title={t('dashboard.summary.comments')} value={String(metrics?.commentsCount ?? 0)} color="red" />
        <Metric title={t('diagnostics.summary.problems')} value={String(state?.vscode?.problems?.length ?? 0)} color="yellow" />
        <Metric title={t('dashboard.summary.open')} value={String(metrics?.openCommentsCount ?? 0)} color="green" bar />
      </section>

      <section>
        <h3>Principais problemas <button className="link-button" onClick={() => onSetView('analysis')}>Ver todos</button></h3>
        <Issue icon={<XCircle size={17} />} title="Inversão de Dependência" text="UserService.ts:11" label="Crítico" />
        <Issue icon={<AlertTriangle size={17} />} title="Muitas Responsabilidades" text="UserService.ts:16" label="Aviso" />
        <Issue icon={<Info size={17} />} title="Tratamento de Erro" text="UserService.ts:24" label="Erro" />
      </section>

      <section>
        <h3>{t('dashboard.nextActions')}</h3>
        <div className="actions">
          <button onClick={onStartReview}><Play size={18} />{t('common.update')}</button>
          <button onClick={() => vscodeApi?.postMessage({ type: 'runArchitectureValidation', payload: { id: state?.currentSession?.id } })} disabled={!state?.currentSession}><Wrench size={18} />Corrigir</button>
          <button onClick={() => vscodeApi?.postMessage({ type: 'exportReviewReport' })}><FileDown size={18} />{t('dashboard.exportReport')}</button>
          <button onClick={() => onSetView('comments')}><MessageSquare size={18} />Comentar</button>
        </div>
      </section>

      <section className="telemetry-card">
        <h3>Telemetria <button className="link-button" onClick={() => onSetView('telemetry')}>Ver dashboard</button></h3>
        <div className="telemetry-chart"><div className="donut" /><span>⌁⌁⌁⌁⌁</span></div>
      </section>
    </aside>
  );
}

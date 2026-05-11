import React from 'react';
import { Bot, RefreshCw } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';
import { IntelligenceRiskPanel } from './IntelligenceRiskPanel';
import { HotspotPanel } from './HotspotPanel';
import { CorrelationPanel } from './CorrelationPanel';
import { IntelligenceSuggestionsPanel } from './IntelligenceSuggestionsPanel';
import { TextListPanel } from '../molecules/TextListPanel';

export function IntelligenceCenter({ state, t, onRunReview, vscodeApi }) {
  const intelligence = state?.intelligence ?? {};
  const hotspots = intelligence.hotspots ?? [];
  const moduleHotspots = intelligence.moduleHotspots ?? [];
  const correlations = intelligence.correlations ?? [];
  const riskAnalysis = intelligence.riskAnalysis ?? [];
  const topRisk = Math.max(0, ...hotspots.map((item) => item.riskScore ?? 0), ...moduleHotspots.map((item) => item.riskScore ?? 0));
  const session = state?.currentSession;
  const aiProviderStatus = state?.premium?.aiProvider?.status ?? state?.ai?.status;
  const aiProviderLabel = state?.premium?.aiProvider?.label ?? state?.ai?.label ?? 'IA local';
  const canGenerateAI = Boolean(session);
  const aiComments = (state?.currentSession?.comments ?? [])
    .filter((comment) => String(comment.author ?? '').startsWith('IA ·'))
    .map((comment) => `${comment.file}:${comment.line} — ${String(comment.body ?? '').replace(/^\[IA\][^\n]*\n*/i, '').slice(0, 220)}`);

  return (
    <main className="center-panel simple intelligence-page">
      <header className="center-header">
        <div>
          <span className="eyebrow">Inteligência</span>
          <h1>Interpretação analítica da revisão</h1>
          <p>Transforma comentários, findings, histórico, Problems e testes em riscos, hotspots e recomendações acionáveis.</p>
        </div>
        <div className="header-actions" data-tour="intelligence-actions">
          <button onClick={() => vscodeApi?.postMessage({ type: 'requestState' })}>
            <RefreshCw size={16} /> Atualizar contexto
          </button>
          <button
            className="primary"
            onClick={() => onRunReview?.({ id: session?.id })}
            disabled={!canGenerateAI}
            title={canGenerateAI ? 'Gerar comentários técnicos com IA para a sessão ativa' : 'Crie uma sessão no Dashboard antes de gerar comentários com IA'}
          >
            <Bot size={16} /> Gerar comentários IA
          </button>
        </div>
      </header>
      {!session && (
        <section className="empty-state intelligence-empty">
          <strong>Nenhuma sessão ativa</strong>
          <p>Crie uma sessão no Dashboard para habilitar a geração de comentários técnicos com IA.</p>
        </section>
      )}
      <section className="ai-execution-strip">
        <span className="badge ai">IA</span>
        <strong>{aiProviderLabel}</strong>
        <span>{aiProviderStatus || 'status não informado'}</span>
        <span className="muted">A geração automática fica concentrada nesta tela para separar sessão de inteligência.</span>
      </section>
      <section className="summary-grid">
        <SummaryCard title="Hotspots" value={String(hotspots.length + moduleHotspots.length)} label="arquivos e módulos críticos" color="red" />
        <SummaryCard title="Correlação" value={String(correlations.length)} label="comentários + findings" color="yellow" />
        <SummaryCard title="Risco" value={String(topRisk)} label="maior pontuação local" color={topRisk >= 10 ? 'red' : 'blue'} />
        <SummaryCard title="Recomendações" value={String(intelligence.recommendations?.length ?? 0)} label="ações propostas" color="green" />
      </section>
      <section className="intelligence-layout">
        <div className="intelligence-main">
          <IntelligenceRiskPanel risks={riskAnalysis} />
          <HotspotPanel title="Hotspots por arquivo" items={hotspots} />
          <CorrelationPanel correlations={correlations} />
          <IntelligenceSuggestionsPanel intelligence={intelligence} />
        </div>
        <aside className="intelligence-side">
          <HotspotPanel title="Hotspots por módulo" items={moduleHotspots} compact />
          <TextListPanel title="Comentários IA gerados" items={aiComments} />
          <TextListPanel title="Recomendações inteligentes" items={intelligence.recommendations ?? []} />
          <TextListPanel title="Padrões detectados" items={intelligence.patterns ?? []} />
          <TextListPanel title="Comparação histórica" items={intelligence.comparisons ?? []} />
          <TextListPanel title="Erros recorrentes" items={(intelligence.recurringErrors ?? []).map((item) => `${item.rule}: ${item.count}`)} />
        </aside>
      </section>
    </main>
  );
}

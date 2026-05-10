import React from 'react';
import { SummaryCard } from '../molecules/SummaryCard';
import { IntelligenceRiskPanel } from './IntelligenceRiskPanel';
import { HotspotPanel } from './HotspotPanel';
import { CorrelationPanel } from './CorrelationPanel';
import { IntelligenceSuggestionsPanel } from './IntelligenceSuggestionsPanel';
import { TextListPanel } from '../molecules/TextListPanel';

export function IntelligenceCenter({ state, t }) {
  const intelligence = state?.intelligence ?? {};
  const hotspots = intelligence.hotspots ?? [];
  const moduleHotspots = intelligence.moduleHotspots ?? [];
  const correlations = intelligence.correlations ?? [];
  const riskAnalysis = intelligence.riskAnalysis ?? [];
  const topRisk = Math.max(0, ...hotspots.map((item) => item.riskScore ?? 0), ...moduleHotspots.map((item) => item.riskScore ?? 0));

  return (
    <main className="center-panel simple intelligence-page">
      <header className="center-header">
        <div>
          <span className="eyebrow">Inteligência</span>
          <h1>Interpretação analítica da revisão</h1>
          <p>Transforma comentários, findings, histórico, Problems e testes em riscos, hotspots e recomendações acionáveis.</p>
        </div>
      </header>
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
          <TextListPanel title="Recomendações inteligentes" items={intelligence.recommendations ?? []} />
          <TextListPanel title="Padrões detectados" items={intelligence.patterns ?? []} />
          <TextListPanel title="Comparação histórica" items={intelligence.comparisons ?? []} />
          <TextListPanel title="Erros recorrentes" items={(intelligence.recurringErrors ?? []).map((item) => `${item.rule}: ${item.count}`)} />
        </aside>
      </section>
    </main>
  );
}

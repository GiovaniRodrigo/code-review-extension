import React from 'react';
import { Play, AlertTriangle } from 'lucide-react';

export function VSCodeContextPanel({ vscodeContext, t, onRunTests, onOpenFile }) {
  const problems = vscodeContext?.problems ?? [];
  const tests = vscodeContext?.tests ?? { available: false, lastRunStatus: 'NOT_RUN' };

  return (
    <section className="sessions-panel vscode-context-panel">
      <div className="section-title">
        <div>
          <h2>VS Code: Problems e Testes</h2>
          <p className="muted">Erros reais da aba Problems e integração com o Test Explorer disponível no VS Code.</p>
        </div>
        <button className="panel-action" onClick={onRunTests}>
          <Play size={16} /> Executar testes do VS Code
        </button>
      </div>
      <div className="vscode-context-grid">
        <article>
          <strong>{problems.length}</strong>
          <span>Problemas detectados</span>
          <small>{problems.filter((item) => item.severity === 'Error').length} erros · {problems.filter((item) => item.severity === 'Warning').length} avisos</small>
        </article>
        <article>
          <strong>{tests.available ? 'Disponível' : 'Indisponível'}</strong>
          <span>Test Explorer</span>
          <small>{tests.lastRunStatus}{tests.lastRunAt ? ` · ${new Date(tests.lastRunAt).toLocaleString()}` : ''}</small>
        </article>
      </div>
      <div className="problems-list">
        {problems.length ? problems.slice(0, 8).map((problem, index) => (
          <button key={`${problem.file}-${problem.line}-${index}`} onClick={() => onOpenFile?.({ file: problem.file, line: problem.line })}>
            <AlertTriangle size={15} />
            <span><strong>{problem.file}:{problem.line}</strong><small>{problem.severity} · {problem.source ?? 'VS Code'} · {problem.message}</small></span>
          </button>
        )) : <p className="empty-state">Nenhum problema ativo na aba Problems para o workspace atual.</p>}
      </div>
    </section>
  );
}

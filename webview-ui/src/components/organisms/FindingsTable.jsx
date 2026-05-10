import React from 'react';
import { Severity } from '../atoms/Severity';

export function FindingsTable({ session, git, vscodeContext, t, onOpenDiff }) {
  const findings = session?.findings ?? [];
  const problems = vscodeContext?.problems ?? [];
  const changedFiles = session?.changedFiles?.length ? session.changedFiles : (git?.changedFiles ?? []);

  const rows = [
    ...findings.map((finding) => ({
      id: finding.id,
      status: finding.severity === 'CRITICAL' ? 'Crítico' : finding.severity === 'HIGH' ? 'Erro' : finding.severity === 'MEDIUM' ? 'Aviso' : 'Sugestão',
      rule: finding.rule,
      file: finding.file,
      line: finding.line,
      action: finding.status,
      commit: finding.commit ?? 'HEAD'
    })),
    ...problems.map((problem, index) => ({
      id: `problem-${index}`,
      status: problem.severity === 'Error' || problem.severity === 'error' ? 'Erro' : 'Aviso',
      rule: problem.source || 'VS Code Problems',
      file: problem.file,
      line: problem.line,
      action: problem.message,
      commit: 'HEAD'
    }))
  ];

  return (
    <div className="table-shell">
      <table className="findings-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Regra/Fonte</th>
            <th>Arquivo</th>
            <th>Linha</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row) => (
            <tr key={row.id}>
              <td><Severity label={row.status} /></td>
              <td>{row.rule}</td>
              <td>{row.file}</td>
              <td>{row.line}</td>
              <td>
                <button
                  className="link-button"
                  disabled={!row.file}
                  onClick={() => onOpenDiff?.({ file: row.file, line: Number(row.line) || 1, commit: row.commit })}
                >Abrir diff</button>
                <span className="table-action-text">{row.action}</span>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5">
                <div className="empty-state diagnostic-empty-state">
                  Nenhum diagnóstico real registrado para esta sessão. Selecione PR/branch, rode “Validar arquitetura” ou crie findings em Validações.
                  {changedFiles.length ? <small>{changedFiles.length} arquivo(s) alterado(s) aguardando validação.</small> : <small>Sem arquivos alterados carregados no contexto Git atual.</small>}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

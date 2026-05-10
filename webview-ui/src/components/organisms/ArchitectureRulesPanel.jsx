import React from 'react';
import { Shield } from 'lucide-react';
import { Tooltip } from '../atoms/Tooltip';

export function ArchitectureRulesPanel({ session, t, onRunValidation }) {
  const rules = [
    ['SOLID', 'SRP, OCP, LSP, ISP, DIP'],
    ['Clean Architecture', 'Dependência incorreta, camadas, circularidade e acoplamento'],
    ['DDD', 'Bounded Context, Entidades, Value Objects e Serviços de domínio']
  ];

  return (
    <section className="sessions-panel">
      <div className="section-title">
        <div>
          <h2>Regras arquiteturais</h2>
          <p className="muted">Validação automática dos arquivos alterados da sessão atual.</p>
        </div>
        <Tooltip label="Executar SOLID, Clean Architecture e DDD nos arquivos alterados da sessão atual" placement="bottom">
          <button
            className="panel-action"
            disabled={!session}
            onClick={onRunValidation}
          >
            <Shield size={16} /> Validar arquitetura
          </button>
        </Tooltip>
      </div>
      <div className="architecture-rules-grid">
        {rules.map(([title, text]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

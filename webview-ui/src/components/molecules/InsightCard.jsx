import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Severity } from '../atoms/Severity';

export function InsightCard({ title, severity, text, file = 'src/extension.ts', line = 1, onOpenFile }) {
  return (
    <article className="insight-card">
      <div>
        <Severity label={severity === 'Crítico' ? 'Crítico' : severity === 'Erro' ? 'Erro' : 'Aviso'} />
        <MoreVertical size={18} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      <button onClick={() => onOpenFile?.({ file, line })}>Abrir no editor real do VS Code</button>
    </article>
  );
}

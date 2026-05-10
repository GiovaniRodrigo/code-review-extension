import React from 'react';
import { Loader2, AlertTriangle, Info } from 'lucide-react';

export function TreatedDiffPanel({ viewer, diffLines, onSelectLine }) {
  const treated = buildTreatedDiff(diffLines);

  if (viewer.loading) {
    return (
      <section className="treated-diff-screen" aria-busy="true">
        <div className="treated-diff-state"><Loader2 size={20} /> Carregando comparação tratada...</div>
      </section>
    );
  }

  if (viewer.error) {
    return (
      <section className="treated-diff-screen">
        <div className="treated-diff-state error"><AlertTriangle size={20} /> {viewer.error}</div>
      </section>
    );
  }

  return (
    <section className="treated-diff-screen" aria-label="Comparação tratada de diferenças">
      <header className="treated-diff-summary">
        <article><span>Arquivo</span><strong>{viewer.file || 'sem arquivo'}</strong></article>
        <article><span>Adições</span><strong>+{treated.added}</strong></article>
        <article><span>Remoções</span><strong>-{treated.removed}</strong></article>
        <article><span>Blocos</span><strong>{treated.hunks.length}</strong></article>
      </header>

      <div className="treated-diff-content">
        {treated.hunks.length ? treated.hunks.map((hunk, hunkIndex) => (
          <article className="treated-hunk" key={`${hunk.header}-${hunkIndex}`}>
            <header>
              <span>Bloco {hunkIndex + 1}</span>
              <strong>{hunk.header}</strong>
            </header>
            <div className="treated-lines">
              {hunk.lines.map((line, index) => (
                <button
                  key={`${hunkIndex}-${index}-${line.content}`}
                  className={`treated-line ${line.type}`}
                  onClick={() => line.afterLine ? onSelectLine?.(line.afterLine) : undefined}
                  title={line.afterLine ? `Comentar linha ${line.afterLine}` : 'Linha sem número atual'}
                >
                  <span className="line-kind">{line.symbol}</span>
                  <span className="line-number">{line.afterLine || line.beforeLine || ''}</span>
                  <code>{line.content || ' '}</code>
                </button>
              ))}
            </div>
          </article>
        )) : (
          <div className="treated-diff-state"><Info size={20} /> Nenhuma diferença encontrada para o arquivo selecionado.</div>
        )}
      </div>
    </section>
  );
}

function buildTreatedDiff(diffLines = []) {
  const hunks = [];
  let current = null;
  let beforeLine = 0;
  let afterLine = 0;
  let added = 0;
  let removed = 0;

  for (const raw of diffLines) {
    if (!raw || raw.startsWith('\\')) continue;
    if (raw.startsWith('@@')) {
      const match = raw.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      beforeLine = match ? Number(match[1]) : 0;
      afterLine = match ? Number(match[2]) : 0;
      current = { header: raw, lines: [] };
      hunks.push(current);
      continue;
    }

    if (!current) continue;
    if (raw.startsWith('+') && !raw.startsWith('+++')) {
      added += 1;
      current.lines.push({ type: 'added', symbol: '+', beforeLine: '', afterLine, content: raw.slice(1) });
      afterLine += 1;
      continue;
    }
    if (raw.startsWith('-') && !raw.startsWith('---')) {
      removed += 1;
      current.lines.push({ type: 'removed', symbol: '-', beforeLine, afterLine: '', content: raw.slice(1) });
      beforeLine += 1;
      continue;
    }
    current.lines.push({ type: 'context', symbol: ' ', beforeLine, afterLine, content: raw.startsWith(' ') ? raw.slice(1) : raw });
    beforeLine += 1;
    afterLine += 1;
  }

  return { added, removed, hunks: hunks.filter((hunk) => hunk.lines.length) };
}

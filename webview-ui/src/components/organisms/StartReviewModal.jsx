import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { XCircle, Play } from 'lucide-react';

export function StartReviewModal({ state, onClose, onStartReview }) {
  const git = state?.git ?? {};
  const [mode, setMode] = useState(git.pullRequestId ? 'pr' : 'branch');
  const [sourceBranch, setSourceBranch] = useState(git.currentBranch ?? '');
  const [targetBranch, setTargetBranch] = useState(git.baseBranch ?? 'main');
  const [pullRequestId, setPullRequestId] = useState(git.pullRequestId ?? '');
  const [title, setTitle] = useState(git.pullRequestId ? `PR #${git.pullRequestId} - ${git.currentBranch ?? ''}` : `Review - ${git.currentBranch ?? ''}`);
  const [subtitle, setSubtitle] = useState(`${git.currentBranch ?? ''} → ${git.baseBranch ?? 'main'}`);
  const branchOwner = inferDeveloperFromBranchName(sourceBranch) || 'dono da branch atual';

  const submit = () => {
    onStartReview?.({
      currentBranch: sourceBranch,
      baseBranch: targetBranch,
      pullRequestId: mode === 'pr' ? pullRequestId : undefined,
      title: title.trim(),
      subtitle: subtitle.trim()
    });
    onClose();
  };

  return createPortal(
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Iniciar revisão">
      <div className="modal-backdrop" onClick={onClose} />
      <section className="start-review-modal">
        <header>
          <div><span className="eyebrow">Iniciar revisão</span><h2>Selecione o PR ou branch que será avaliado</h2></div>
          <button onClick={onClose}><XCircle size={18} /></button>
        </header>
        <p className="muted">A avaliação seguirá uma esteira de alterações/arquivos: selecionar origem → comparar diff → criar comentários/findings → dev corrige → reviewer revalida.</p>
        <div className="review-source-toggle">
          <button className={mode === 'branch' ? 'active' : ''} onClick={() => setMode('branch')}>Branch</button>
          <button className={mode === 'pr' ? 'active' : ''} onClick={() => setMode('pr')}>Pull Request</button>
        </div>
        <label>Branch/Origem<input value={sourceBranch} onChange={(event) => setSourceBranch(event.target.value)} placeholder="feature/usuario/minha-alteracao" /></label>
        <label>Base/Destino<input value={targetBranch} onChange={(event) => setTargetBranch(event.target.value)} placeholder="main, develop..." /></label>
        {mode === 'pr' && <label>Número ou identificador do PR<input value={pullRequestId} onChange={(event) => setPullRequestId(event.target.value)} placeholder="123" /></label>}
        <label>Título da sessão<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Revisão Sprint 12 - Pagamentos" /></label>
        <label>Subtítulo da sessão<input value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="Ex.: PR 123 · feature/pagamentos → main" /></label>
        <div className="review-pipeline-preview">
          <strong>Esteira de avaliação</strong>
          <span>{sourceBranch || 'origem'} → diff contra {targetBranch || 'base'} → arquivos alterados → findings → correções → revalidação</span>
          <small>Desenvolvedor/responsável inferido: {branchOwner}. Em integrações reais, usar o autor do PR como fonte principal.</small>
        </div>
        <footer>
          <button onClick={onClose}>Cancelar</button>
          <button className="primary" disabled={!sourceBranch.trim() || !targetBranch.trim() || !title.trim() || !subtitle.trim()} onClick={submit}><Play size={16} /> Criar revisão</button>
        </footer>
      </section>
    </div>,
    document.body
  );
}

function inferDeveloperFromBranchName(branch) {
  const match = String(branch || '').match(/^(?:feature|fix|hotfix|bugfix|chore|refactor)\/([^/]+)\//i);
  return match?.[1];
}

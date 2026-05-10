import React, { useState, useEffect } from 'react';
import { GitPullRequest, GitCommit, FolderOpen, MessageSquare, RefreshCw, Play } from 'lucide-react';
import { TreatedDiffPanel } from '../molecules/TreatedDiffPanel';
import { CommentItem } from '../molecules/CommentItem';

export function GitReviewCenter({ state, currentUser, vscodeApi, t }) {
  const session = state?.currentSession;
  const git = state?.git ?? {};
  const baseFiles = session?.changedFiles?.length ? session.changedFiles : (git.changedFiles ?? []);
  const commits = session?.commits?.length ? session.commits : (git.commits ?? []);
  const [commitFiles, setCommitFiles] = useState([]);
  const files = commitFiles.length ? commitFiles : baseFiles;
  const [selectedFile, setSelectedFile] = useState(files[0] ?? '');
  const [selectedCommit, setSelectedCommit] = useState(commits[0]?.split(' ')[0] ?? 'HEAD');
  const [viewer, setViewer] = useState({ file: selectedFile, commit: selectedCommit, beforeContent: '', afterContent: '', diff: '', loading: false, error: '' });
  const [comparisonMode, setComparisonMode] = useState('treated');
  const [commentLine, setCommentLine] = useState(1);
  const [commentBody, setCommentBody] = useState('Solicitar ajuste neste trecho.');
  const [commentSeverity, setCommentSeverity] = useState('MEDIUM');
  const [commentStatus, setCommentStatus] = useState('NEEDS_CHANGES');
  const canApprove = session?.reviewer === currentUser || currentUser === 'admin';

  const requestFile = (file = selectedFile, commit = selectedCommit) => {
    if (!file) {
      setViewer({ file: '', commit, beforeContent: '', afterContent: '// Nenhum arquivo alterado encontrado para este contexto Git.', diff: 'Sem diff disponível.', loading: false, error: 'Nenhum arquivo alterado encontrado para comparação.' });
      return;
    }

    setViewer((current) => ({ ...current, loading: true, file, commit }));
    vscodeApi?.postMessage({ type: 'loadGitFile', payload: { file, commit } });
  };

  const selectCommit = (commitLine) => {
    const hash = commitLine.split(' ')[0] || 'HEAD';
    setSelectedCommit(hash);
    setCommitFiles([]);
    setViewer((current) => ({ ...current, loading: true, commit: hash }));
    vscodeApi?.postMessage({ type: 'loadCommitFiles', payload: { commit: hash } });
  };

  useEffect(() => {
    if (files.length && !files.includes(selectedFile)) setSelectedFile(files[0]);
  }, [files.join('|')]);

  useEffect(() => {
    requestFile(selectedFile, selectedCommit);
  }, [selectedFile, selectedCommit]);

  useEffect(() => {
    const listener = (event) => {
      if (event.data?.type === 'gitFileLoaded') {
        setViewer({ ...event.data.payload, loading: false, error: '' });
      }

      if (event.data?.type === 'commitFilesLoaded') {
        const payload = event.data.payload ?? {};
        const loadedFiles = Array.isArray(payload.files) ? payload.files : [];
        setCommitFiles(loadedFiles);
        if (loadedFiles.length) {
          setSelectedFile(loadedFiles[0]);
          requestFile(loadedFiles[0], payload.commit || selectedCommit);
        } else {
          setViewer({
            file: '',
            commit: payload.commit || selectedCommit,
            beforeContent: '',
            afterContent: '// Nenhum arquivo encontrado nesse commit. Verifique se o hash pertence ao repositório aberto.',
            diff: 'Sem diff disponível para este commit.',
            loading: false,
            error: 'Nenhum arquivo encontrado nesse commit para comparação tratada.'
          });
        }
      }
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, [selectedFile, selectedCommit]);

  const submitComment = () => {
    if (!session || !commentBody.trim()) return;
    vscodeApi?.postMessage({
      type: 'addReviewComment',
      payload: {
        id: session.id,
        body: commentBody,
        file: selectedFile,
        line: Number(commentLine) || 1,
        commit: selectedCommit,
        severity: commentSeverity,
        status: commentStatus
      }
    });
    setCommentBody('');
  };

  const beforeLines = (viewer.beforeContent || '').split('\n').slice(0, 300);
  const afterLines = (viewer.afterContent || '// Selecione um arquivo alterado para visualizar o conteúdo.').split('\n').slice(0, 300);
  const diffLines = (viewer.diff || 'Sem diff disponível para este arquivo no contexto atual.').split('\n').slice(0, 300);

  return (
    <main className="center-panel simple git-review-center">
      <header className="center-header">
        <div>
          <span className="eyebrow">Git Review</span>
          <h1>Seguir alterações do Git</h1>
          <p>Baseie a revisão em PR, commit ou branch, abra o arquivo alterado na tela e registre comentários vinculados à linha.</p>
        </div>
        <div className="header-actions">
          <button onClick={() => vscodeApi?.postMessage({ type: 'requestState' })}><RefreshCw size={16} /> Atualizar Git</button>
          <button className="primary" onClick={() => vscodeApi?.postMessage({ type: 'startReview' })}><Play size={16} /> Criar sessão</button>
        </div>
      </header>

      <section className="git-context-grid">
        <article><GitPullRequest size={18} /><span>Origem</span><strong>{git.currentBranch ?? session?.sourceBranch ?? 'sem branch'}</strong></article>
        <article><GitCommit size={18} /><span>Base</span><strong>{git.baseBranch ?? session?.targetBranch ?? 'main'}</strong></article>
        <article><FolderOpen size={18} /><span>Arquivos</span><strong>{files.length}</strong></article>
        <article><MessageSquare size={18} /><span>Comentários</span><strong>{session?.comments?.length ?? 0}</strong></article>
      </section>

      <section className="git-review-workspace">
        <aside className="git-change-list">
          <div className="section-title compact">
            <div>
              <h2>Alterações</h2>
              <p className="muted">Arquivos vindos do diff atual.</p>
            </div>
          </div>
          <div className="git-scroll-list">
            {files.length ? files.map((file) => (
              <button key={file} className={selectedFile === file ? 'active' : ''} onClick={() => setSelectedFile(file)}>
                <FolderOpen size={15} />
                <span>{file}</span>
              </button>
            )) : <p className="empty-state">Nenhum arquivo alterado encontrado no Git.</p>}
          </div>

          <div className="section-title compact commits-title">
            <div>
              <h2>Commits</h2>
              <p className="muted">Use como referência da revisão.</p>
            </div>
          </div>
          <div className="git-scroll-list commits">
            {commits.length ? commits.slice(0, 20).map((commit) => {
              const hash = commit.split(' ')[0];
              return (
                <button key={commit} className={selectedCommit === hash ? 'active' : ''} onClick={() => selectCommit(commit)}>
                  <GitCommit size={15} />
                  <span>{commit}</span>
                </button>
              );
            }) : <p className="empty-state">Nenhum commit listado.</p>}
          </div>
        </aside>

        <section className="git-file-viewer" data-tour="git-file-viewer">
          <div className="file-viewer-toolbar">
            <div>
              <span className="eyebrow">Arquivo selecionado</span>
              <h2>{selectedFile}</h2>
              <p className="muted">Commit/base: {selectedCommit}</p>
            </div>
            <div className="header-actions comparison-actions">
              <button disabled={!selectedFile} onClick={() => { setComparisonMode('split'); requestFile(selectedFile, selectedCommit); }}>Base x Atual</button>
              <button className="primary" disabled={!selectedFile} onClick={() => { setComparisonMode('treated'); requestFile(selectedFile, selectedCommit); }}>Comparar em tela</button>
              <button disabled={!selectedFile} onClick={() => { requestFile(selectedFile, selectedCommit); vscodeApi?.postMessage({ type: 'openWorkspaceFile', payload: { file: selectedFile, line: Number(commentLine) || 1, commit: selectedCommit } }); }}>Abrir arquivo</button>
              <button disabled={!selectedFile} onClick={() => vscodeApi?.postMessage({ type: 'openDiff', payload: { file: selectedFile, line: Number(commentLine) || 1, commit: selectedCommit } })}>Abrir diff no VS Code</button>
            </div>
          </div>

          {comparisonMode === 'treated' ? (
            <TreatedDiffPanel
              viewer={viewer}
              diffLines={diffLines}
              onSelectLine={setCommentLine}
            />
          ) : (
            <div className="split-code-review">
              <div className="code-pane">
                <h3>Antes (Base) {viewer.loading ? '· carregando...' : ''}</h3>
                <pre aria-busy={viewer.loading}>{beforeLines.map((line, index) => (
                  <div key={`${index}-${line}`} className="code-line">
                    <span>{index + 1}</span><code>{line || ' '}</code>
                  </div>
                ))}</pre>
              </div>
              <div className="code-pane">
                <h3>Depois (Atual) {viewer.loading ? '· carregando...' : ''}</h3>
                <pre aria-busy={viewer.loading}>{afterLines.map((line, index) => (
                  <button key={`${index}-${line}`} className={Number(commentLine) === index + 1 ? 'code-line active' : 'code-line'} onClick={() => setCommentLine(index + 1)}>
                    <span>{index + 1}</span><code>{line || ' '}</code>
                  </button>
                ))}</pre>
              </div>
            </div>
          )}
        </section>

        <aside className="git-comment-panel" data-tour="git-comment-panel">
          <h2>Comentário inline</h2>
          <p className="muted">O comentário fica vinculado ao arquivo, linha e commit selecionados.</p>
          <label>Arquivo<input value={selectedFile} readOnly /></label>
          <label>Linha<input type="number" min="1" value={commentLine} onChange={(event) => setCommentLine(event.target.value)} /></label>
          <label>Commit<input value={selectedCommit} onChange={(event) => setSelectedCommit(event.target.value)} /></label>
          <label>Severidade<select value={commentSeverity} onChange={(event) => setCommentSeverity(event.target.value)}><option value="LOW">Baixa</option><option value="MEDIUM">Média</option><option value="HIGH">Alta</option><option value="CRITICAL">Crítica</option></select></label>
          <label>Status<select value={commentStatus} onChange={(event) => setCommentStatus(event.target.value)}>
            <option value="OPEN">Aberto</option>
            <option value="NEEDS_CHANGES">Ajuste solicitado</option>
            <option value="RESOLVED">Resolvido</option>
            {canApprove && <option value="APPROVED">Aprovado</option>}
          </select></label>
          <label>Comentário<textarea value={commentBody} onChange={(event) => setCommentBody(event.target.value)} /></label>
          <button className="primary full" disabled={!session || !selectedFile || !commentBody.trim()} onClick={submitComment}><MessageSquare size={16} /> Publicar comentário</button>
          {!session && <p className="empty-state">Crie uma sessão de review antes de comentar.</p>}
          <div className="comments-list compact-comments">
            {(session?.comments ?? []).filter((comment) => comment.file === selectedFile).map((comment) => (
              <CommentItem
                key={comment.id}
                session={session}
                comment={comment}
                currentUser={currentUser}
                t={t}
                onOpenFile={(c) => vscodeApi?.postMessage({ type: 'openWorkspaceFile', payload: { file: c.file, line: c.line ?? 1, commit: c.commit ?? 'HEAD' } })}
                onOpenDiff={(c) => vscodeApi?.postMessage({ type: 'openDiff', payload: { file: c.file, line: c.line ?? 1, commit: c.commit ?? 'HEAD' } })}
                onEditComment={(p) => vscodeApi?.postMessage({ type: 'editReviewComment', payload: p })}
                onUpdateStatus={(p) => vscodeApi?.postMessage({ type: 'updateReviewCommentStatus', payload: p })}
              />
            ))}
            {!(session?.comments ?? []).filter((comment) => comment.file === selectedFile).length && <p className="empty-state">Nenhum comentário para este arquivo.</p>}
          </div>
        </aside>
      </section>
    </main>
  );
}
